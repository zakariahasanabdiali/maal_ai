-- Fix: updated_at columns on users and profiles are NOT NULL with no default.
-- The handle_new_user() trigger inserts without updated_at, causing a 500 error on signup.
-- Add DEFAULT CURRENT_TIMESTAMP so the trigger insert succeeds.

ALTER TABLE public.users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.profiles ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;