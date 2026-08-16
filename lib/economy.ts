export const ECONOMY = {
  BASE_XP: 10,
  MIN_DIFFICULTY: 1.0,
  MAX_DIFFICULTY: 2.0,
  MAX_STREAK_MULTIPLIER: 2.0,
  STREAK_BONUS_PER_DAY: 0.05,
  LESSON_GEMS: 5,
  DAILY_STREAK_GEMS: 10,
  HEART_REFILL_COST: 50,
  MAX_HEARTS: 5,
  HEART_REGEN_HOURS: 4,
} as const;

export function calculateStreakMultiplier(streak: number): number {
  const safeStreak = Number.isFinite(streak) ? Math.max(0, Math.floor(streak)) : 0;
  return Math.min(
    1 + safeStreak * ECONOMY.STREAK_BONUS_PER_DAY,
    ECONOMY.MAX_STREAK_MULTIPLIER
  );
}

export function calculateXP(
  difficulty: number,
  streak: number,
  baseXP: number = ECONOMY.BASE_XP
): number {
  const safeDifficulty = Number.isFinite(difficulty) ? difficulty : ECONOMY.MIN_DIFFICULTY;
  const safeBaseXP = Number.isFinite(baseXP) ? Math.max(0, baseXP) : ECONOMY.BASE_XP;
  const clampedDifficulty = Math.max(
    ECONOMY.MIN_DIFFICULTY,
    Math.min(safeDifficulty, ECONOMY.MAX_DIFFICULTY)
  );
  const streakMultiplier = calculateStreakMultiplier(streak);
  return Math.round(safeBaseXP * clampedDifficulty * streakMultiplier);
}

export interface LessonReward {
  xp: number;
  gems: number;
  streakBonus: number;
}

export function applyLessonRewards(
  difficulty: number,
  streak: number,
  isNewStreak: boolean
): LessonReward {
  const xp = calculateXP(difficulty, streak);
  const gems = ECONOMY.LESSON_GEMS;
  const streakBonus = isNewStreak ? ECONOMY.DAILY_STREAK_GEMS : 0;
  return { xp, gems: gems + streakBonus, streakBonus };
}

export interface FailurePenalty {
  heartsLost: number;
  canContinue: boolean;
}

export function applyFailurePenalty(currentHearts: number): FailurePenalty {
  const safeHearts = Number.isFinite(currentHearts)
    ? Math.max(0, Math.floor(currentHearts))
    : 0;
  const heartsLost = safeHearts > 0 ? 1 : 0;
  const remainingHearts = safeHearts - heartsLost;
  return { heartsLost, canContinue: remainingHearts > 0 };
}

export function canRefillHearts(gems: number): boolean {
  return Number.isFinite(gems) && gems >= ECONOMY.HEART_REFILL_COST;
}

export function getHeartRegenTime(lastRegenTime: Date, now: Date = new Date()): number {
  const cycleMs = ECONOMY.HEART_REGEN_HOURS * 60 * 60 * 1000;
  const elapsedMs = Math.max(0, now.getTime() - lastRegenTime.getTime());

  if (elapsedMs === 0) {
    return ECONOMY.HEART_REGEN_HOURS * 60;
  }

  const remainder = elapsedMs % cycleMs;
  if (remainder === 0) {
    return 0;
  }

  return Math.ceil((cycleMs - remainder) / (60 * 1000));
}
