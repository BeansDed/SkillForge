import { describe, expect, it } from 'vitest';
import {
  ECONOMY,
  applyFailurePenalty,
  applyLessonRewards,
  calculateStreakMultiplier,
  calculateXP,
  canRefillHearts,
  getHeartRegenTime,
} from './economy';

describe('SkillForge economy', () => {
  it('never lets a negative streak reduce the base multiplier', () => {
    expect(calculateStreakMultiplier(-10)).toBe(1);
    expect(calculateStreakMultiplier(Number.NaN)).toBe(1);
  });

  it('caps the streak multiplier', () => {
    expect(calculateStreakMultiplier(100)).toBe(ECONOMY.MAX_STREAK_MULTIPLIER);
  });

  it('clamps lesson difficulty and invalid base XP', () => {
    expect(calculateXP(0.2, 0)).toBe(10);
    expect(calculateXP(99, 0)).toBe(20);
    expect(calculateXP(1, 0, -50)).toBe(0);
  });

  it('adds daily streak gems only when a new streak is earned', () => {
    expect(applyLessonRewards(1, 0, false)).toEqual({
      xp: 10,
      gems: ECONOMY.LESSON_GEMS,
      streakBonus: 0,
    });

    expect(applyLessonRewards(1, 1, true)).toEqual({
      xp: 11,
      gems: ECONOMY.LESSON_GEMS + ECONOMY.DAILY_STREAK_GEMS,
      streakBonus: ECONOMY.DAILY_STREAK_GEMS,
    });
  });

  it('handles heart penalties safely at the lower boundary', () => {
    expect(applyFailurePenalty(2)).toEqual({ heartsLost: 1, canContinue: true });
    expect(applyFailurePenalty(1)).toEqual({ heartsLost: 1, canContinue: false });
    expect(applyFailurePenalty(-5)).toEqual({ heartsLost: 0, canContinue: false });
  });

  it('requires enough gems for a heart refill', () => {
    expect(canRefillHearts(ECONOMY.HEART_REFILL_COST - 1)).toBe(false);
    expect(canRefillHearts(ECONOMY.HEART_REFILL_COST)).toBe(true);
    expect(canRefillHearts(Number.NaN)).toBe(false);
  });

  it('calculates deterministic heart regeneration timing', () => {
    const lastRegen = new Date('2026-08-16T08:00:00.000Z');

    expect(getHeartRegenTime(lastRegen, new Date('2026-08-16T08:00:00.000Z'))).toBe(240);
    expect(getHeartRegenTime(lastRegen, new Date('2026-08-16T10:00:00.000Z'))).toBe(120);
    expect(getHeartRegenTime(lastRegen, new Date('2026-08-16T12:00:00.000Z'))).toBe(0);
  });
});
