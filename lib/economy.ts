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
  return Math.min(1 + streak * ECONOMY.STREAK_BONUS_PER_DAY, ECONOMY.MAX_STREAK_MULTIPLIER);
}

export function calculateXP(
  difficulty: number,
  streak: number,
  baseXP: number = ECONOMY.BASE_XP
): number {
  const clampedDifficulty = Math.max(
    ECONOMY.MIN_DIFFICULTY,
    Math.min(difficulty, ECONOMY.MAX_DIFFICULTY)
  );
  const streakMultiplier = calculateStreakMultiplier(streak);
  return Math.round(baseXP * clampedDifficulty * streakMultiplier);
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
  const heartsLost = currentHearts > 0 ? 1 : 0;
  const remainingHearts = currentHearts - heartsLost;
  return { heartsLost, canContinue: remainingHearts > 0 };
}

export function canRefillHearts(gems: number): boolean {
  return gems >= ECONOMY.HEART_REFILL_COST;
}

export function getHeartRegenTime(lastRegenTime: Date): number {
  const now = new Date();
  const diff = now.getTime() - lastRegenTime.getTime();
  const hoursElapsed = diff / (1000 * 60 * 60);
  const remainingHours = ECONOMY.HEART_REGEN_HOURS - (hoursElapsed % ECONOMY.HEART_REGEN_HOURS);
  return Math.ceil(remainingHours * 60);
}
