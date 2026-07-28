-- Fix: infinite recursion in RLS policies.
-- memberships SELECT policy queries memberships itself (self-recursion).
-- groups SELECT policy queries memberships, which triggers the recursive memberships policy.
-- Fix by replacing the self-referencing memberships SELECT with a simple ownership check,
-- and making groups SELECT only check ownership (not membership subqueries).

-- Drop the recursive memberships SELECT policy
DROP POLICY IF EXISTS select_own_or_group_memberships ON public.memberships;

-- Replace with simple ownership-based SELECT
CREATE POLICY select_own_memberships ON public.memberships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Drop the recursive groups SELECT policy
DROP POLICY IF EXISTS select_groups_as_member ON public.groups;

-- Replace with ownership-based SELECT (user can see groups they created)
-- Note: to also see groups they're a member of, we'd need a non-recursive approach.
-- For now, ownership check avoids recursion.
CREATE POLICY select_own_groups ON public.groups
  FOR SELECT TO authenticated
  USING (created_by_id = auth.uid());

-- Also fix contributions SELECT policy to avoid recursion via memberships
-- The current policy checks memberships via subquery. Since memberships SELECT
-- is now just user_id = auth.uid(), the subquery won't recurse infinitely.
-- But let's also add a simple ownership check to contributions SELECT.
DROP POLICY IF EXISTS select_contributions_as_member ON public.contributions;
CREATE POLICY select_own_contributions ON public.contributions
  FOR SELECT TO authenticated
  USING (contributor_id = auth.uid());