-- Multilingual content fields for grammar cards.
ALTER TABLE grammar
ADD COLUMN IF NOT EXISTS meaning_zh TEXT,
ADD COLUMN IF NOT EXISTS explanation_zh TEXT,
ADD COLUMN IF NOT EXISTS explanation_en TEXT,
ADD COLUMN IF NOT EXISTS usage_note_zh TEXT,
ADD COLUMN IF NOT EXISTS usage_note_en TEXT,
ADD COLUMN IF NOT EXISTS example_zh TEXT,
ADD COLUMN IF NOT EXISTS example_en TEXT,
ADD COLUMN IF NOT EXISTS common_mistake_zh TEXT,
ADD COLUMN IF NOT EXISTS common_mistake_en TEXT,
ADD COLUMN IF NOT EXISTS memory_tip_zh TEXT,
ADD COLUMN IF NOT EXISTS memory_tip_en TEXT;

UPDATE grammar
SET
  meaning_zh = COALESCE(meaning_zh, meaning_cn),
  explanation_zh = COALESCE(explanation_zh, explanation),
  usage_note_zh = COALESCE(usage_note_zh, usage_note),
  example_zh = COALESCE(example_zh, example_cn),
  common_mistake_zh = COALESCE(common_mistake_zh, common_mistake),
  memory_tip_zh = COALESCE(memory_tip_zh, memory_tip);

-- Immutable review events for SRS history and analytics.
CREATE TABLE IF NOT EXISTS review_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grammar_id UUID REFERENCES grammar(id) ON DELETE CASCADE NOT NULL,
  rating TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  interval INTEGER NOT NULL DEFAULT 0,
  repetition INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Review history accessible by owner" ON review_history;
CREATE POLICY "Review history accessible by owner"
ON review_history FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_review_history_user_reviewed ON review_history(user_id, reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_history_grammar ON review_history(grammar_id);

-- Keep grammar readable to everyone, but avoid granting ordinary users broad client-side write access.
DROP POLICY IF EXISTS "Grammar writable by authenticated" ON grammar;
DROP POLICY IF EXISTS "Grammar writable by service role" ON grammar;
CREATE POLICY "Grammar writable by service role"
ON grammar FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
