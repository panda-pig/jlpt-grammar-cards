DO $$
DECLARE
  target text;
  targets text[] := ARRAY[
    'public.is_admin()',
    'public.handle_new_user()',
    'public.set_updated_at()',
    'public.is_active_pro(uuid)',
    'public.enforce_user_grammar_item_limit()'
  ];
BEGIN
  FOREACH target IN ARRAY targets LOOP
    IF to_regprocedure(target) IS NOT NULL THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', target);
    END IF;
  END LOOP;
END $$;
