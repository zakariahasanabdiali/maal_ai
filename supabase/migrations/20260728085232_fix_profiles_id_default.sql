-- Fix: profiles.id is uuid NOT NULL with no default.
-- The handle_new_user() trigger inserts (user_id, full_name) without id.
-- Add DEFAULT gen_random_uuid() so the trigger insert succeeds.

ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();