-- Enforce Free/Pro private grammar item limits at the database layer.
-- Free users can keep up to 10 active private grammar items.
-- Active Pro users have no private-item limit.

CREATE OR REPLACE FUNCTION public.is_active_pro(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_entitlements
    WHERE user_id = target_user_id
      AND plan = 'pro'
      AND (
        lifetime = true
        OR (expires_at IS NOT NULL AND expires_at > now())
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.enforce_user_grammar_item_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_count INTEGER;
BEGIN
  IF public.is_active_pro(NEW.user_id) THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*)
  INTO active_count
  FROM public.user_grammar_items
  WHERE user_id = NEW.user_id
    AND deleted_at IS NULL;

  IF active_count >= 10 THEN
    RAISE EXCEPTION 'free_private_grammar_limit_reached'
      USING ERRCODE = 'P0001',
            DETAIL = 'Free users can create up to 10 private grammar items.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_user_grammar_item_limit ON public.user_grammar_items;
CREATE TRIGGER enforce_user_grammar_item_limit
  BEFORE INSERT ON public.user_grammar_items
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_user_grammar_item_limit();
