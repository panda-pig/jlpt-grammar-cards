-- Enable Row Level Security
alter table if exists grammar enable row level security;
alter table if exists profiles enable row level security;
alter table if exists user_grammar_progress enable row level security;
alter table if exists daily_stats enable row level security;

-- Grammar table
CREATE TABLE IF NOT EXISTS grammar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  jlpt_level TEXT NOT NULL CHECK (jlpt_level IN ('N1', 'N2', 'N3', 'N4', 'N5')),
  source_route TEXT NOT NULL CHECK (source_route IN ('蓝宝书', 'TRY', '一册合格', '综合')),
  grammar_type TEXT NOT NULL DEFAULT 'その他',
  tags TEXT[] DEFAULT '{}',
  meaning_cn TEXT NOT NULL DEFAULT '',
  meaning_en TEXT DEFAULT '',
  structure TEXT DEFAULT '',
  explanation TEXT DEFAULT '',
  usage_note TEXT DEFAULT '',
  example_jp TEXT DEFAULT '',
  example_cn TEXT DEFAULT '',
  furigana TEXT,
  similar_grammar JSONB DEFAULT '[]',
  common_mistake TEXT DEFAULT '',
  memory_tip TEXT DEFAULT '',
  quiz_question TEXT DEFAULT '',
  quiz_choices JSONB DEFAULT '[]',
  quiz_answer TEXT DEFAULT '',
  quiz_explanation TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User grammar progress (study status, favorites, reviews)
CREATE TABLE IF NOT EXISTS user_grammar_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grammar_id UUID REFERENCES grammar(id) ON DELETE CASCADE NOT NULL,
  study_status TEXT NOT NULL DEFAULT '未学习' CHECK (study_status IN ('未学习', '学习中', '已掌握')),
  is_favorite BOOLEAN DEFAULT false,
  review_count INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  last_rating TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, grammar_id)
);

-- Daily stats
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  new_cards INTEGER DEFAULT 0,
  review_cards INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- RLS Policies
-- Grammar: readable by all, writable by authenticated
CREATE POLICY "Grammar readable by all" ON grammar FOR SELECT USING (true);
CREATE POLICY "Grammar writable by authenticated" ON grammar FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Profiles: users can only access their own
CREATE POLICY "Profiles accessible by owner" ON profiles FOR ALL USING (auth.uid() = id);

-- User grammar progress: users can only access their own
CREATE POLICY "Progress accessible by owner" ON user_grammar_progress FOR ALL USING (auth.uid() = user_id);

-- Daily stats: users can only access their own
CREATE POLICY "Stats accessible by owner" ON daily_stats FOR ALL USING (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_grammar_jlpt ON grammar(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_grammar_slug ON grammar(slug);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_grammar_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_grammar ON user_grammar_progress(grammar_id);
CREATE INDEX IF NOT EXISTS idx_progress_next_review ON user_grammar_progress(next_review_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date);
