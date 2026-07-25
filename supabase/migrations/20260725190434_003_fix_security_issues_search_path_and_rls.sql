/*
# Fix Security Issues: Mutable Search Path and SECURITY DEFINER Exposure

## Purpose
Fix three database-level security findings:
1. Function Search Path Mutable — `public.set_updated_at` did not pin its
   `search_path`, allowing a role to influence which schema an unqualified
   name resolves to. This function is called by triggers on every personal
   finance table, so locking it down matters.
2. Public Can Execute SECURITY DEFINER Function — `public.handle_new_user()`
   was callable by the `anon` role via the PostgREST RPC endpoint, even
   though it is a SECURITY DEFINER function that inserts into `users` and
   `profiles`. Only the auth trigger should ever invoke it.
3. Signed-In Users Can Execute SECURITY DEFINER Function — same function was
   also callable by the `authenticated` role.

## Changes

### 1. Lock the search_path on set_updated_at
- Recreate `public.set_updated_at` with `SET search_path = public` so the
  function always resolves against the public schema regardless of the
  caller's search_path.

### 2. Lock down handle_new_user execution
- Revoke EXECUTE on `public.handle_new_user()` from `PUBLIC`, `anon`, and
  `authenticated`. The function is still called by the
  `on_auth_user_created` trigger on `auth.users`, which executes as the
  function owner (postgres) — the trigger does not need any explicit grants
  to anon/authenticated.
- The function already pins `search_path = public`, so no change needed
  there.

## Important Notes
1. No data is modified or deleted — only function definitions and grants.
2. Revoking EXECUTE from PUBLIC does NOT break signup: the trigger fires
   with owner privileges, not as anon/authenticated.
3. `handle_new_user` remains SECURITY DEFINER intentionally — it must write
   to `users`/`profiles` during the auth insert, which happens before the
   session is established.
*/

-- 1. Pin search_path on set_updated_at (fixes mutable search path)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Revoke public/authenticated/anon execute on the signup trigger function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
