-- All features are free: remove the private-grammar cap.
--
-- The 007 trigger raised free_private_grammar_limit_reached once a non-Pro
-- account held 10 active private items. With the paywall gone the frontend no
-- longer blocks the 11th entry, so the trigger has to go too — otherwise the
-- insert fails at the database instead.

DROP TRIGGER IF EXISTS enforce_user_grammar_item_limit ON public.user_grammar_items;
DROP FUNCTION IF EXISTS public.enforce_user_grammar_item_limit();

-- public.is_active_pro() is intentionally kept: entitlement rows and the
-- payment tables still exist, so restoring a paid tier stays a config change.
