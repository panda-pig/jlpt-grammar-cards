-- Admin Roles & RLS Hardening
-- Run this in Supabase SQL Editor

-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS for user_roles: only the user themselves can read, only admins can write
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 2. Function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

-- 3. Update grammar RLS: read for all, write only for admins
DROP POLICY IF EXISTS "Grammar writable by authenticated" ON grammar;
CREATE POLICY "Grammar writable by admin" ON grammar
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Grammar updatable by admin" ON grammar
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Grammar deletable by admin" ON grammar
  FOR DELETE USING (public.is_admin());

-- 4. Update user_grammar_overrides RLS
DROP POLICY IF EXISTS "Overrides accessible by authenticated" ON user_grammar_overrides;
CREATE POLICY "Overrides writable by owner" ON user_grammar_overrides
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Update user_grammar_items RLS
CREATE POLICY "Items readable by owner" ON user_grammar_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Items writable by owner" ON user_grammar_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Insert your account as admin (replace with your actual user ID after login)
-- Run after logging in once: SELECT auth.uid() to get your ID
-- INSERT INTO user_roles (user_id, role) VALUES ('<your-user-uuid>', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
