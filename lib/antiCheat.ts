import { db } from '@/lib/db';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SuspiciousActivity {
  userId: string;
  type: string;
  level: ThreatLevel;
  details: string;
  timestamp: Date;
}

const THRESHOLDS = {
  MIN_LESSON_TIME_MS: 30000,
  MAX_XP_PER_HOUR: 500,
  MAX_LESSONS_PER_HOUR: 20,
} as const;

export function validateLessonCompletion(
  startTime: Date,
  endTime: Date,
  expectedMinDuration: number = THRESHOLDS.MIN_LESSON_TIME_MS
): { valid: boolean; level: ThreatLevel; reason?: string } {
  const duration = endTime.getTime() - startTime.getTime();

  if (duration < expectedMinDuration) {
    return {
      valid: false,
      level: 'MEDIUM',
      reason: `Lesson completed too fast: ${duration}ms (min: ${expectedMinDuration}ms)`,
    };
  }

  return { valid: true, level: 'LOW' };
}

export async function checkXPVelocity(
  userId: string,
  newXP: number
): Promise<{ allowed: boolean; level: ThreatLevel }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentXP = await db.leaderboardEntry.aggregate({
    where: { userId, createdAt: { gte: oneHourAgo } },
    _sum: { xpEarned: true },
  });

  const totalXP = (recentXP._sum.xpEarned || 0) + newXP;

  if (totalXP > THRESHOLDS.MAX_XP_PER_HOUR) {
    return { allowed: false, level: 'HIGH' };
  }

  return { allowed: true, level: 'LOW' };
}

export function flagSuspiciousActivity(activity: SuspiciousActivity): void {
  console.warn('[AntiCheat] Suspicious activity detected:', {
    ...activity,
    timestamp: activity.timestamp.toISOString(),
  });
}

export function getEnforcementAction(level: ThreatLevel): string {
  switch (level) {
    case 'LOW': return 'LOG_ONLY';
    case 'MEDIUM': return 'THROTTLE_XP';
    case 'HIGH': return 'TEMPORARY_LOCK';
    default: return 'LOG_ONLY';
  }
}
