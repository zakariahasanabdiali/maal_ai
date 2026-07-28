-- Fix: authenticated and anon roles lack USAGE on public schema.
-- Without this, all queries from the browser client fail with "permission denied for schema public".
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Also grant SELECT/INSERT/UPDATE/DELETE on all existing tables in public schema
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;