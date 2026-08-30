-- ==============================================================================
-- KOPAR - Supabase Schema & RLS Policies (Fase 1)
-- Ejecutar esto en el SQL Editor de Supabase
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE member_status AS ENUM ('active', 'pending');
CREATE TYPE split_type AS ENUM ('50_50', '100_PAID_BY_ME', '100_PAID_BY_OTHER', 'CUSTOM');
CREATE TYPE transaction_status AS ENUM ('PAGADO', 'PENDIENTE', 'DEBES');

-- 2. Create Tables

-- Households
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  currency TEXT DEFAULT 'COP',
  default_split_rule split_type DEFAULT '50_50',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members (Profiles linked to Auth)
-- Using UUID for ID to match auth.users.id
CREATE TABLE members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  role user_role DEFAULT 'member',
  status member_status DEFAULT 'pending',
  income NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraint: Only 1 Admin per Household
CREATE UNIQUE INDEX one_admin_per_household_idx 
ON members (household_id) 
WHERE role = 'admin';

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  definition TEXT,
  icon TEXT NOT NULL,
  budget_limit NUMERIC,
  color TEXT NOT NULL,
  subcategories JSONB DEFAULT '[]'::jsonb
);

-- Expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  paid_by_id UUID REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status transaction_status DEFAULT 'PENDIENTE',
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense Splits
CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  percentage NUMERIC NOT NULL
);

-- Settlements
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  paid_by UUID REFERENCES members(id) ON DELETE CASCADE,
  paid_to UUID REFERENCES members(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's household_id
CREATE OR REPLACE FUNCTION get_current_user_household() 
RETURNS UUID AS $$
  SELECT household_id FROM members WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies for Households
-- Members can only see their own household
CREATE POLICY "Users can view their own household" ON households
  FOR SELECT USING (id = get_current_user_household());

-- Policies for Members
-- Members can view other members in the same household
CREATE POLICY "Users can view members in their household" ON members
  FOR SELECT USING (household_id = get_current_user_household());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON members
  FOR UPDATE USING (id = auth.uid());

-- Policies for Categories
CREATE POLICY "Users can view categories of their household" ON categories
  FOR SELECT USING (household_id = get_current_user_household());

-- Only admins can modify categories
CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT WITH CHECK (
    household_id = get_current_user_household() AND 
    EXISTS (SELECT 1 FROM members WHERE id = auth.uid() AND role = 'admin')
  );
  
CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE USING (
    household_id = get_current_user_household() AND 
    EXISTS (SELECT 1 FROM members WHERE id = auth.uid() AND role = 'admin')
  );

-- Policies for Expenses
CREATE POLICY "Users can view expenses of their household" ON expenses
  FOR SELECT USING (household_id = get_current_user_household());

CREATE POLICY "Users can insert expenses for their household" ON expenses
  FOR INSERT WITH CHECK (household_id = get_current_user_household());
  
CREATE POLICY "Users can update expenses of their household" ON expenses
  FOR UPDATE USING (household_id = get_current_user_household());

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (paid_by_id = auth.uid());

-- Policies for Expense Splits
CREATE POLICY "Users can view splits of their household" ON expense_splits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE expenses.id = expense_splits.expense_id 
      AND expenses.household_id = get_current_user_household()
    )
  );

CREATE POLICY "Users can insert splits for their household" ON expense_splits
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE expenses.id = expense_splits.expense_id 
      AND expenses.household_id = get_current_user_household()
    )
  );

-- Policies for Settlements
CREATE POLICY "Users can view settlements of their household" ON settlements
  FOR SELECT USING (household_id = get_current_user_household());

CREATE POLICY "Users can insert settlements for their household" ON settlements
  FOR INSERT WITH CHECK (household_id = get_current_user_household());
