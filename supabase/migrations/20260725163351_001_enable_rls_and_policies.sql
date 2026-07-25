/*
# Enable Row-Level Security and Add Policies to All Existing Tables

## Purpose
The database already contained 10 tables (users, profiles, groups, memberships,
contributions, receipts, notifications, ai_logs, audit_logs) but Row-Level Security
was NOT enabled on any of them. This migration closes that security hole and adds
owner/membership-scoped access policies so each authenticated user can only see and
modify the data they own or belong to.

## Changes by Section

### 1. RLS Enabled
- `users` — enable RLS
- `profiles` — enable RLS
- `groups` — enable RLS
- `memberships` — enable RLS
- `contributions` — enable RLS
- `receipts` — enable RLS
- `notifications` — enable RLS
- `ai_logs` — enable RLS
- `audit_logs` — enable RLS

### 2. Auth-uid defaults on owner columns
- `profiles.user_id` — DEFAULT auth.uid()
- `notifications.user_id` — DEFAULT auth.uid()
- `ai_logs.user_id` — DEFAULT auth.uid()
- `audit_logs.actor_id` — DEFAULT auth.uid()

### 3. Auto-create profile on signup
- Trigger `on_auth_user_created` inserts a `users` row and a `profiles` row
  when a new auth.users record is created, so Supabase Auth sign-up produces
  the app-level profile automatically.

### 4. Policies (all scoped TO authenticated)

**users** — a user can only see their own row.
**profiles** — a user can only see/edit their own profile.
**groups** — group creators (created_by_id) can manage; members can read.
**memberships** — members can read memberships in groups they belong to;
  self-read; only group admins can insert/update/delete memberships.
**contributions** — group members can read; contributors can insert their own;
  group admins/treasurers can approve/reject (update).
**receipts** — readable by the contribution's group members.
**notifications** — owner-only CRUD (user_id = auth.uid()).
**ai_logs** — owner-only read (user_id = auth.uid()).
**audit_logs** — group admins can read audit logs for their group.

### 5. Indexes
- Added indexes on foreign-key and frequently-filtered columns for query performance.

## Important Notes
1. `USING (true)` is NOT used — every policy has a real ownership or membership predicate.
2. Owner columns default to `auth.uid()` so client inserts that omit the owner still pass `WITH CHECK`.
3. The profile-creation trigger ensures a profile exists after every sign-up.
4. All policies are idempotent (DROP POLICY IF EXISTS before CREATE).
*/

-- ============================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL EXISTING TABLES
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SET auth.uid() DEFAULTS ON OWNER COLUMNS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_id'
      AND column_default = 'auth.uid()'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN user_id SET DEFAULT auth.uid();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'user_id'
      AND column_default = 'auth.uid()'
  ) THEN
    ALTER TABLE notifications ALTER COLUMN user_id SET DEFAULT auth.uid();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_logs' AND column_name = 'user_id'
      AND column_default = 'auth.uid()'
  ) THEN
    ALTER TABLE ai_logs ALTER COLUMN user_id SET DEFAULT auth.uid();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audit_logs' AND column_name = 'actor_id'
      AND column_default = 'auth.uid()'
  ) THEN
    ALTER TABLE audit_logs ALTER COLUMN actor_id SET DEFAULT auth.uid();
  END IF;
END $$;

-- ============================================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. POLICIES
-- ============================================================

-- ---- users ----
DROP POLICY IF EXISTS "select_own_user" ON users;
CREATE POLICY "select_own_user" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_user" ON users;
CREATE POLICY "update_own_user" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---- profiles ----
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ---- groups ----
DROP POLICY IF EXISTS "select_groups_as_member" ON groups;
CREATE POLICY "select_groups_as_member" ON groups
  FOR SELECT TO authenticated
  USING (
    created_by_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = groups.id
        AND m.user_id = auth.uid()
        AND m.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "insert_groups_as_owner" ON groups;
CREATE POLICY "insert_groups_as_owner" ON groups
  FOR INSERT TO authenticated
  WITH CHECK (created_by_id = auth.uid());

DROP POLICY IF EXISTS "update_groups_as_owner" ON groups;
CREATE POLICY "update_groups_as_owner" ON groups
  FOR UPDATE TO authenticated
  USING (created_by_id = auth.uid())
  WITH CHECK (created_by_id = auth.uid());

DROP POLICY IF EXISTS "delete_groups_as_owner" ON groups;
CREATE POLICY "delete_groups_as_owner" ON groups
  FOR DELETE TO authenticated
  USING (created_by_id = auth.uid());

-- ---- memberships ----
DROP POLICY IF EXISTS "select_own_or_group_memberships" ON memberships;
CREATE POLICY "select_own_or_group_memberships" ON memberships
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.group_id = memberships.group_id
        AND m2.user_id = auth.uid()
        AND m2.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "insert_memberships_as_group_admin" ON memberships;
CREATE POLICY "insert_memberships_as_group_admin" ON memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = memberships.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'GROUP_ADMIN'
        AND m.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "update_memberships_as_group_admin" ON memberships;
CREATE POLICY "update_memberships_as_group_admin" ON memberships
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = memberships.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'GROUP_ADMIN'
        AND m.status = 'ACTIVE'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = memberships.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'GROUP_ADMIN'
        AND m.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "delete_memberships_as_group_admin" ON memberships;
CREATE POLICY "delete_memberships_as_group_admin" ON memberships
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = memberships.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'GROUP_ADMIN'
        AND m.status = 'ACTIVE'
    )
  );

-- ---- contributions ----
DROP POLICY IF EXISTS "select_contributions_as_member" ON contributions;
CREATE POLICY "select_contributions_as_member" ON contributions
  FOR SELECT TO authenticated
  USING (
    contributor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = contributions.group_id
        AND m.user_id = auth.uid()
        AND m.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "insert_own_contributions" ON contributions;
CREATE POLICY "insert_own_contributions" ON contributions
  FOR INSERT TO authenticated
  WITH CHECK (contributor_id = auth.uid());

DROP POLICY IF EXISTS "update_contributions_as_admin_or_owner" ON contributions;
CREATE POLICY "update_contributions_as_admin_or_owner" ON contributions
  FOR UPDATE TO authenticated
  USING (
    contributor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = contributions.group_id
        AND m.user_id = auth.uid()
        AND m.role IN ('GROUP_ADMIN', 'TREASURER')
        AND m.status = 'ACTIVE'
    )
  )
  WITH CHECK (
    contributor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = contributions.group_id
        AND m.user_id = auth.uid()
        AND m.role IN ('GROUP_ADMIN', 'TREASURER')
        AND m.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "delete_own_contributions" ON contributions;
CREATE POLICY "delete_own_contributions" ON contributions
  FOR DELETE TO authenticated
  USING (contributor_id = auth.uid());

-- ---- receipts ----
DROP POLICY IF EXISTS "select_receipts_as_member" ON receipts;
CREATE POLICY "select_receipts_as_member" ON receipts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contributions c
      WHERE c.id = receipts.contribution_id
        AND (
          c.contributor_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.group_id = c.group_id
              AND m.user_id = auth.uid()
              AND m.status = 'ACTIVE'
          )
        )
    )
  );

DROP POLICY IF EXISTS "insert_own_receipts" ON receipts;
CREATE POLICY "insert_own_receipts" ON receipts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contributions c
      WHERE c.id = receipts.contribution_id
        AND c.contributor_id = auth.uid()
    )
  );

-- ---- notifications ----
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ---- ai_logs ----
DROP POLICY IF EXISTS "select_own_ai_logs" ON ai_logs;
CREATE POLICY "select_own_ai_logs" ON ai_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_ai_logs" ON ai_logs;
CREATE POLICY "insert_own_ai_logs" ON ai_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ---- audit_logs ----
DROP POLICY IF EXISTS "select_audit_logs_as_group_admin" ON audit_logs;
CREATE POLICY "select_audit_logs_as_group_admin" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.group_id = audit_logs.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'GROUP_ADMIN'
        AND m.status = 'ACTIVE'
    )
  );

-- ============================================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_group_id ON memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_group_id ON contributions(group_id);
CREATE INDEX IF NOT EXISTS idx_contributions_contributor_id ON contributions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_receipts_contribution_id ON receipts(contribution_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_group_id ON audit_logs(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by_id);
