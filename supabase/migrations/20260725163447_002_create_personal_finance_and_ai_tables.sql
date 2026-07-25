/*
# Create Personal Finance and AI Conversation Tables

## Purpose
The existing schema covered the community/group side of the app (groups,
memberships, contributions, receipts) but was missing tables for the
personal-finance features shown in the frontend: transactions, budget
categories, saving goals, and AI chat conversations. This migration adds
those tables so the app can persist user-level financial data.

## New Tables

### 1. transactions
Personal income/expense records for each user.
- `id` (uuid PK)
- `user_id` (uuid, defaults to auth.uid(), FK to auth.users)
- `date` (date, when the transaction occurred)
- `description` (text)
- `category` (enum: food, transport, shopping, bills, education, business,
  entertainment, health, income, savings, community, other)
- `amount` (numeric, positive = income, negative = expense)
- `currency` (text, default 'USD')
- `status` (enum: completed, pending, failed)
- `merchant` (text, nullable)
- `created_at`, `updated_at` (timestamps)

### 2. budget_categories
Monthly budget limits per spending category.
- `id` (uuid PK)
- `user_id` (uuid, defaults to auth.uid(), FK to auth.users)
- `name` (text)
- `budget_limit` (numeric, monthly cap — column named budget_limit because
  LIMIT is a SQL reserved keyword)
- `spent` (numeric, running total, default 0)
- `color` (text, UI color token like 'chart-1')
- `created_at`, `updated_at` (timestamps)

### 3. saving_goals
Personal savings targets with progress tracking.
- `id` (uuid PK)
- `user_id` (uuid, defaults to auth.uid(), FK to auth.users)
- `name` (text)
- `target` (numeric, goal amount)
- `current` (numeric, saved so far, default 0)
- `deadline` (date, nullable)
- `emoji` (text, UI emoji)
- `color` (text, UI color token)
- `created_at`, `updated_at` (timestamps)

### 4. ai_conversations
Chat conversation sessions for the AI assistant.
- `id` (uuid PK)
- `user_id` (uuid, defaults to auth.uid(), FK to auth.users)
- `title` (text)
- `pinned` (boolean, default false)
- `created_at`, `updated_at` (timestamps)

### 5. ai_messages
Individual messages within an AI conversation.
- `id` (uuid PK)
- `conversation_id` (uuid, FK to ai_conversations, cascade delete)
- `role` (enum: user, assistant)
- `content` (text)
- `created_at` (timestamp)

## Security
- RLS enabled on every new table.
- All tables are owner-scoped (user_id = auth.uid()) with 4 CRUD policies each.
- ai_messages is scoped through its parent conversation (EXISTS subquery).
- Owner columns default to auth.uid() so inserts omitting user_id still pass WITH CHECK.
- No USING (true) shortcuts — every policy has a real ownership predicate.

## Indexes
- Foreign-key and frequently-filtered columns indexed for query speed.

## Important Notes
1. All enums use IF NOT EXISTS via DO blocks to remain idempotent.
2. Policies are dropped before creation to be safe to re-run.
3. The updated_at columns use a trigger to auto-set on row update.
4. The budget limit column is named `budget_limit` because `limit` is a SQL
   reserved keyword and cannot be used as an unquoted column name.
*/

-- ============================================================
-- ENUM TYPES
-- ============================================================

DO $$ BEGIN
  CREATE TYPE transaction_category AS ENUM (
    'food', 'transport', 'shopping', 'bills', 'education',
    'business', 'entertainment', 'health', 'income',
    'savings', 'community', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('completed', 'pending', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_message_role AS ENUM ('user', 'assistant');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  category transaction_category NOT NULL DEFAULT 'other',
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status transaction_status NOT NULL DEFAULT 'completed',
  merchant text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_transactions" ON transactions;
CREATE POLICY "update_own_transactions" ON transactions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_transactions" ON transactions;
CREATE POLICY "delete_own_transactions" ON transactions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

DROP TRIGGER IF EXISTS trg_transactions_updated_at ON transactions;
CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. BUDGET CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  budget_limit numeric(12,2) NOT NULL DEFAULT 0,
  spent numeric(12,2) NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT 'chart-1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_budgets" ON budget_categories;
CREATE POLICY "select_own_budgets" ON budget_categories
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_budgets" ON budget_categories;
CREATE POLICY "insert_own_budgets" ON budget_categories
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_budgets" ON budget_categories;
CREATE POLICY "update_own_budgets" ON budget_categories
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_budgets" ON budget_categories;
CREATE POLICY "delete_own_budgets" ON budget_categories
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id ON budget_categories(user_id);

DROP TRIGGER IF EXISTS trg_budget_categories_updated_at ON budget_categories;
CREATE TRIGGER trg_budget_categories_updated_at
  BEFORE UPDATE ON budget_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. SAVING GOALS
-- ============================================================

CREATE TABLE IF NOT EXISTS saving_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target numeric(12,2) NOT NULL DEFAULT 0,
  current numeric(12,2) NOT NULL DEFAULT 0,
  deadline date,
  emoji text NOT NULL DEFAULT '🎯',
  color text NOT NULL DEFAULT 'chart-1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saving_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_savings" ON saving_goals;
CREATE POLICY "select_own_savings" ON saving_goals
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_savings" ON saving_goals;
CREATE POLICY "insert_own_savings" ON saving_goals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_savings" ON saving_goals;
CREATE POLICY "update_own_savings" ON saving_goals
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_savings" ON saving_goals;
CREATE POLICY "delete_own_savings" ON saving_goals
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saving_goals_user_id ON saving_goals(user_id);

DROP TRIGGER IF EXISTS trg_saving_goals_updated_at ON saving_goals;
CREATE TRIGGER trg_saving_goals_updated_at
  BEFORE UPDATE ON saving_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. AI CONVERSATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New conversation',
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON ai_conversations;
CREATE POLICY "select_own_conversations" ON ai_conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON ai_conversations;
CREATE POLICY "insert_own_conversations" ON ai_conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_conversations" ON ai_conversations;
CREATE POLICY "update_own_conversations" ON ai_conversations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON ai_conversations;
CREATE POLICY "delete_own_conversations" ON ai_conversations
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated_at ON ai_conversations(updated_at DESC);

DROP TRIGGER IF EXISTS trg_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER trg_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. AI MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role ai_message_role NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ai_messages" ON ai_messages;
CREATE POLICY "select_own_ai_messages" ON ai_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations c
      WHERE c.id = ai_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_ai_messages" ON ai_messages;
CREATE POLICY "insert_own_ai_messages" ON ai_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations c
      WHERE c.id = ai_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_own_ai_messages" ON ai_messages;
CREATE POLICY "update_own_ai_messages" ON ai_messages
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations c
      WHERE c.id = ai_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations c
      WHERE c.id = ai_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_ai_messages" ON ai_messages;
CREATE POLICY "delete_own_ai_messages" ON ai_messages
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations c
      WHERE c.id = ai_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);
