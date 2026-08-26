-- Fix: RLS was never actually enabled on the four tables from 001_schema.sql.
--
-- 001 ran `alter table if exists <t> enable row level security` ABOVE the
-- `CREATE TABLE` statements. On a fresh database the tables did not exist yet,
-- so `if exists` made every one of those statements a silent no-op — no error,
-- no RLS. The policies below were then created and have been inert ever since,
-- leaving grammar, profiles, user_grammar_progress and daily_stats open to
-- anonymous read AND write through the public anon key.
--
-- Policies are (re)created first so that enabling RLS never leaves a window
-- where the tables are protected but unreachable.

-- ── grammar: public read; writes limited to admins and the service role ──────
DROP POLICY IF EXISTS "Grammar readable by all" ON public.grammar;
CREATE POLICY "Grammar readable by all"
  ON public.grammar FOR SELECT USING (true);

DROP POLICY IF EXISTS "Grammar writable by authenticated" ON public.grammar;

DROP POLICY IF EXISTS "Grammar writable by service role" ON public.grammar;
CREATE POLICY "Grammar writable by service role"
  ON public.grammar FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Grammar writable by admin" ON public.grammar;
CREATE POLICY "Grammar writable by admin"
  ON public.grammar FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Grammar updatable by admin" ON public.grammar;
CREATE POLICY "Grammar updatable by admin"
  ON public.grammar FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Grammar deletable by admin" ON public.grammar;
CREATE POLICY "Grammar deletable by admin"
  ON public.grammar FOR DELETE USING (public.is_admin());

-- ── owner-scoped tables ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Profiles accessible by owner" ON public.profiles;
CREATE POLICY "Profiles accessible by owner"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Progress accessible by owner" ON public.user_grammar_progress;
CREATE POLICY "Progress accessible by owner"
  ON public.user_grammar_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Stats accessible by owner" ON public.daily_stats;
CREATE POLICY "Stats accessible by owner"
  ON public.daily_stats FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── now actually turn RLS on ────────────────────────────────────────────────
ALTER TABLE public.grammar               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_grammar_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats           ENABLE ROW LEVEL SECURITY;

-- Verification: every row must report rowsecurity = true.
--   SELECT relname, relrowsecurity FROM pg_class
--   WHERE relnamespace = 'public'::regnamespace AND relkind = 'r' ORDER BY relname;

-- ── Fix: user_roles policy recursed into its own table ──────────────────────
-- "Admins can manage roles" ran EXISTS (SELECT 1 FROM user_roles ...) inside a
-- policy ON user_roles, so every non-service-role query returned
-- 42P17 infinite recursion. That is why the admin role page could not list or
-- grant roles. public.is_admin() is SECURITY DEFINER and bypasses RLS, so
-- calling it breaks the cycle.
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
