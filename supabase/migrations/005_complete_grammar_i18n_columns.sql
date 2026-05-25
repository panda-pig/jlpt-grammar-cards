-- Complete grammar multilingual columns for projects that skipped migration 003.
-- This is safe to run repeatedly.
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
