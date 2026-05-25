export type JLPTLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export type SourceRoute =
  | "蓝宝书"
  | "TRY"
  | "一册合格"
  | "综合";

export type GrammarCategory =
  | "原因・理由"
  | "条件"
  | "逆接・譲歩"
  | "推量・様態"
  | "否定"
  | "敬語"
  | "比較"
  | "目的"
  | "限定"
  | "範囲"
  | "並列"
  | "例示"
  | "伝聞"
  | "提示"
  | "意志・勧誘"
  | "願望"
  | "義務・当然"
  | "存在"
  | "結果"
  | "関係"
  | "時点"
  | "程度"
  | "変化"
  | "評価"
  | "感情"
  | "確認"
  | "強調"
  | "規則"
  | "その他";

export type StudyStatus = "未学习" | "学习中" | "已掌握";

export type ReviewRating = 1 | 2 | 3 | 4;

export interface SimilarGrammar {
  title: string;
  slug: string;
  difference: string;
}

export interface QuizChoice {
  key: string;
  text: string;
}

export interface GrammarEntry {
  id: string;
  dbId?: string;
  ownerId?: string | null;
  isSystem?: boolean;
  isUserCreated?: boolean;
  isHidden?: boolean;
  baseGrammarKey?: string | null;
  title: string;
  slug: string;
  jlptLevel: JLPTLevel;
  sourceRoute: SourceRoute;
  grammarType: GrammarCategory;
  tags: string[];
  meaningCn: string;
  meaningZh: string;
  meaningEn: string;
  structure: string;
  explanation: string;
  explanationZh: string;
  explanationEn: string;
  usageNote: string;
  usageNoteZh: string;
  usageNoteEn: string;
  exampleJp: string;
  exampleCn: string;
  exampleZh: string;
  exampleEn: string;
  furigana?: string;
  similarGrammar: SimilarGrammar[];
  commonMistake: string;
  commonMistakeZh: string;
  commonMistakeEn: string;
  memoryTip: string;
  memoryTipZh: string;
  memoryTipEn: string;
  quizQuestion: string;
  quizChoices: QuizChoice[];
  quizAnswer: string;
  quizExplanation: string;
}

export interface UserGrammarProgress {
  grammarId: string;
  studyStatus: StudyStatus;
  isFavorite: boolean;
  reviewCount: number;
  masteryLevel: number;
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
  lastRating: string | null;
}

export interface GrammarWithProgress extends GrammarEntry {
  studyStatus: StudyStatus;
  isFavorite: boolean;
  reviewCount: number;
  masteryLevel: number;
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
  lastRating: string | null;
}

export interface UserStats {
  todayNewCards: number;
  todayReviewCards: number;
  todayCompleted: number;
  todayTotal: number;
  totalLearned: number;
  totalMastered: number;
  totalFavorites: number;
  streakDays: number;
}

export interface LevelProgress {
  level: JLPTLevel;
  total: number;
  learned: number;
  mastered: number;
}

export interface StudySession {
  currentIndex: number;
  totalCards: number;
  level: JLPTLevel;
  cards: GrammarEntry[];
}

export interface ReviewRecord {
  grammarId: string;
  title: string;
  level: JLPTLevel;
  lastRating: string;
  nextReviewDate: string;
  isFavorite: boolean;
}

export interface ReviewHistoryRecord {
  id?: string;
  grammarId: string;
  rating: string;
  reviewedAt: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReviewAt: string;
}

export interface FavoriteCollection {
  id: string;
  name: string;
  count: number;
}

export const REVIEW_RATINGS: Record<ReviewRating, { label: string; color: string; nextDays: number }> = {
  1: { label: "忘记了", color: "bg-rose-100 text-rose-700 hover:bg-rose-200", nextDays: 0 },
  2: { label: "有点模糊", color: "bg-amber-100 text-amber-700 hover:bg-amber-200", nextDays: 1 },
  3: { label: "记住了", color: "bg-sky-100 text-sky-700 hover:bg-sky-200", nextDays: 3 },
  4: { label: "很简单", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", nextDays: 7 },
};

export const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  "原因・理由": "原因・理由",
  "条件": "条件",
  "逆接・譲歩": "逆接・譲歩",
  "推量・様態": "推量・様態",
  "否定": "否定",
  "敬語": "敬語",
  "比較": "比較",
  "目的": "目的",
  "限定": "限定",
  "範囲": "範囲",
  "並列": "並列",
  "例示": "例示",
  "伝聞": "伝聞",
  "提示": "提示",
  "意志・勧誘": "意志・勧誘",
  "願望": "願望",
  "義務・当然": "義務・当然",
  "存在": "存在",
  "結果": "結果",
  "関係": "関係",
  "時点": "時点",
  "程度": "程度",
  "変化": "変化",
  "評価": "評価",
  "感情": "感情",
  "確認": "確認",
  "強調": "強調",
  "規則": "規則",
  "その他": "その他",
};
