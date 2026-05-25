-- Stable grammar keys and user-specific grammar library support.
-- The public grammar table remains the curated default deck.
ALTER TABLE grammar
ADD COLUMN IF NOT EXISTS source_key TEXT,
ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS content_version INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE grammar
SET source_key = COALESCE(
  source_key,
  substring(slug from '-([0-9]+)$'),
  'db:' || id::text
)
WHERE source_key IS NULL;

ALTER TABLE grammar
ALTER COLUMN source_key SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_grammar_source_key ON grammar(source_key);

-- Users can override selected fields of a system grammar item without mutating
-- the shared default deck. hidden=true means the user removed it from their deck.
CREATE TABLE IF NOT EXISTS user_grammar_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grammar_source_key TEXT NOT NULL,
  hidden BOOLEAN NOT NULL DEFAULT false,
  title TEXT,
  slug TEXT,
  jlpt_level TEXT CHECK (jlpt_level IN ('N1', 'N2', 'N3', 'N4', 'N5')),
  source_route TEXT CHECK (source_route IN ('蓝宝书', 'TRY', '一册合格', '综合')),
  grammar_type TEXT,
  tags TEXT[],
  meaning_cn TEXT,
  meaning_zh TEXT,
  meaning_en TEXT,
  structure TEXT,
  explanation TEXT,
  explanation_zh TEXT,
  explanation_en TEXT,
  usage_note TEXT,
  usage_note_zh TEXT,
  usage_note_en TEXT,
  example_jp TEXT,
  example_cn TEXT,
  example_zh TEXT,
  example_en TEXT,
  furigana TEXT,
  similar_grammar JSONB,
  common_mistake TEXT,
  common_mistake_zh TEXT,
  common_mistake_en TEXT,
  memory_tip TEXT,
  memory_tip_zh TEXT,
  memory_tip_en TEXT,
  quiz_question TEXT,
  quiz_choices JSONB,
  quiz_answer TEXT,
  quiz_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, grammar_source_key)
);

-- User-created grammar cards are private and can be studied like system cards.
CREATE TABLE IF NOT EXISTS user_grammar_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_key TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  jlpt_level TEXT NOT NULL CHECK (jlpt_level IN ('N1', 'N2', 'N3', 'N4', 'N5')),
  source_route TEXT NOT NULL DEFAULT '综合' CHECK (source_route IN ('蓝宝书', 'TRY', '一册合格', '综合')),
  grammar_type TEXT NOT NULL DEFAULT 'その他',
  tags TEXT[] DEFAULT '{}',
  meaning_cn TEXT NOT NULL DEFAULT '',
  meaning_zh TEXT,
  meaning_en TEXT DEFAULT '',
  structure TEXT DEFAULT '',
  explanation TEXT DEFAULT '',
  explanation_zh TEXT,
  explanation_en TEXT,
  usage_note TEXT DEFAULT '',
  usage_note_zh TEXT,
  usage_note_en TEXT,
  example_jp TEXT DEFAULT '',
  example_cn TEXT DEFAULT '',
  example_zh TEXT,
  example_en TEXT,
  furigana TEXT,
  similar_grammar JSONB DEFAULT '[]',
  common_mistake TEXT DEFAULT '',
  common_mistake_zh TEXT,
  common_mistake_en TEXT,
  memory_tip TEXT DEFAULT '',
  memory_tip_zh TEXT,
  memory_tip_en TEXT,
  quiz_question TEXT DEFAULT '',
  quiz_choices JSONB DEFAULT '[]',
  quiz_answer TEXT DEFAULT '',
  quiz_explanation TEXT DEFAULT '',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, slug),
  UNIQUE(user_id, source_key)
);

ALTER TABLE user_grammar_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_grammar_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Grammar overrides accessible by owner" ON user_grammar_overrides;
CREATE POLICY "Grammar overrides accessible by owner"
ON user_grammar_overrides FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "User grammar items accessible by owner" ON user_grammar_items;
CREATE POLICY "User grammar items accessible by owner"
ON user_grammar_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Progress and review history should use stable text keys. The legacy grammar_id
-- UUID columns are retained for old rows and future joins, but are no longer
-- required for user-created cards.
ALTER TABLE user_grammar_progress
ADD COLUMN IF NOT EXISTS grammar_key TEXT;

ALTER TABLE user_grammar_progress
ADD COLUMN IF NOT EXISTS interval INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS repetition INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS ease_factor REAL NOT NULL DEFAULT 2.5;

UPDATE user_grammar_progress progress
SET grammar_key = COALESCE(progress.grammar_key, grammar.source_key, progress.grammar_id::text)
FROM grammar
WHERE progress.grammar_id = grammar.id;

UPDATE user_grammar_progress
SET grammar_key = COALESCE(grammar_key, grammar_id::text)
WHERE grammar_key IS NULL;

ALTER TABLE user_grammar_progress
ALTER COLUMN grammar_key SET NOT NULL;

ALTER TABLE user_grammar_progress
ALTER COLUMN grammar_id DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_grammar_key_unique
ON user_grammar_progress(user_id, grammar_key);

-- Some projects may not have applied the earlier review-history migration yet.
-- Keep this migration standalone and repeatable by creating the table when needed.
CREATE TABLE IF NOT EXISTS review_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grammar_id UUID REFERENCES grammar(id) ON DELETE CASCADE,
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

ALTER TABLE review_history
ADD COLUMN IF NOT EXISTS grammar_key TEXT;

UPDATE review_history history
SET grammar_key = COALESCE(history.grammar_key, grammar.source_key, history.grammar_id::text)
FROM grammar
WHERE history.grammar_id = grammar.id;

UPDATE review_history
SET grammar_key = COALESCE(grammar_key, grammar_id::text)
WHERE grammar_key IS NULL;

ALTER TABLE review_history
ALTER COLUMN grammar_key SET NOT NULL;

ALTER TABLE review_history
ALTER COLUMN grammar_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_review_history_user_grammar_key
ON review_history(user_id, grammar_key, reviewed_at DESC);

-- Public grammar stays readable by all and writable only through service role.
DROP POLICY IF EXISTS "Grammar writable by authenticated" ON grammar;
DROP POLICY IF EXISTS "Grammar writable by service role" ON grammar;
CREATE POLICY "Grammar writable by service role"
ON grammar FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
