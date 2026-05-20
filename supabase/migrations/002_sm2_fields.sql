-- Add SM-2 algorithm fields to user_grammar_progress
ALTER TABLE user_grammar_progress
ADD COLUMN IF NOT EXISTS interval INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS repetition INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ease_factor REAL DEFAULT 2.5;
