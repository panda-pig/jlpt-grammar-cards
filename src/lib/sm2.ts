export interface SM2Card {
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReviewDate: Date;
}

export function calculateSM2(
  quality: number,
  previous: SM2Card
): SM2Card {
  let { interval, repetition, easeFactor } = previous;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    repetition,
    easeFactor,
    nextReviewDate,
  };
}

export function ratingToQuality(rating: "忘记了" | "有点模糊" | "记住了" | "很简单"): number {
  const map: Record<string, number> = {
    "忘记了": 1,
    "有点模糊": 3,
    "记住了": 4,
    "很简单": 5,
  };
  return map[rating] ?? 3;
}

export function getInitialSM2(): SM2Card {
  return {
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date(),
  };
}
