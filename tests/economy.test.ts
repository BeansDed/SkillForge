import { describe, it, expect } from 'vitest';
import {
  calculateXP,
  calculateStreakMultiplier,
  applyLessonRewards,
  applyFailurePenalty,
  ECONOMY,
} from '@/lib/economy';

describe('Economy System', () => {
  describe('calculateStreakMultiplier', () => {
    it('returns 1 for 0 streak', () => {
      expect(calculateStreakMultiplier(0)).toBe(1);
    });

    it('increases by 0.05 per streak day', () => {
      expect(calculateStreakMultiplier(1)).toBe(1.05);
      expect(calculateStreakMultiplier(10)).toBe(1.5);
    });

    it('caps at 2.0 max multiplier', () => {
      expect(calculateStreakMultiplier(100)).toBe(2.0);
    });
  });

  describe('calculateXP', () => {
    it('calculates base XP correctly', () => {
      expect(calculateXP(1.0, 0)).toBe(10);
    });

    it('applies difficulty multiplier', () => {
      expect(calculateXP(2.0, 0)).toBe(20);
    });

    it('applies streak multiplier', () => {
      expect(calculateXP(1.0, 10)).toBe(15);
    });

    it('clamps difficulty within bounds', () => {
      expect(calculateXP(0.5, 0)).toBe(10);
      expect(calculateXP(3.0, 0)).toBe(20);
    });
  });

  describe('applyLessonRewards', () => {
    it('returns correct rewards for new streak', () => {
      const rewards = applyLessonRewards(1.0, 0, true);
      expect(rewards.xp).toBe(10);
      expect(rewards.gems).toBe(15);
      expect(rewards.streakBonus).toBe(10);
    });

    it('returns correct rewards without streak bonus', () => {
      const rewards = applyLessonRewards(1.0, 0, false);
      expect(rewards.gems).toBe(5);
      expect(rewards.streakBonus).toBe(0);
    });
  });

  describe('applyFailurePenalty', () => {
    it('loses 1 heart when hearts > 0', () => {
      const penalty = applyFailurePenalty(5);
      expect(penalty.heartsLost).toBe(1);
      expect(penalty.canContinue).toBe(true);
    });

    it('cannot continue when hearts reach 0', () => {
      const penalty = applyFailurePenalty(1);
      expect(penalty.heartsLost).toBe(1);
      expect(penalty.canContinue).toBe(false);
    });

    it('loses 0 hearts when already at 0', () => {
      const penalty = applyFailurePenalty(0);
      expect(penalty.heartsLost).toBe(0);
      expect(penalty.canContinue).toBe(false);
    });
  });
});
