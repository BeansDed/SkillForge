import { db } from '@/lib/db';

export type AchievementTrigger = 'XP' | 'STREAK' | 'LESSONS' | 'GEMS';

export interface UserStats {
  xp: number;
  currentStreak: number;
  lessonsCompleted: number;
  gems: number;
}

export interface AchievementCheck {
  achievementId: string;
  name: string;
  trigger: string;
  threshold: number;
  unlocked: boolean;
}

export async function checkAchievements(
  userId: string,
  stats: UserStats
): Promise<AchievementCheck[]> {
  const achievements = await db.achievement.findMany();
  const userAchievements = await db.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  return achievements.map((achievement) => {
    const currentValue = getStatValue(stats, achievement.trigger as AchievementTrigger);
    const meetsThreshold = currentValue >= achievement.threshold;
    const alreadyUnlocked = unlockedIds.has(achievement.id);

    return {
      achievementId: achievement.id,
      name: achievement.name,
      trigger: achievement.trigger,
      threshold: achievement.threshold,
      unlocked: alreadyUnlocked || meetsThreshold,
    };
  });
}

function getStatValue(stats: UserStats, trigger: AchievementTrigger): number {
  switch (trigger) {
    case 'XP': return stats.xp;
    case 'STREAK': return stats.currentStreak;
    case 'LESSONS': return stats.lessonsCompleted;
    case 'GEMS': return stats.gems;
    default: return 0;
  }
}

export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<boolean> {
  const existing = await db.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId } },
  });

  if (existing) return false;

  await db.userAchievement.create({
    data: { userId, achievementId },
  });

  return true;
}

export async function processAchievements(
  userId: string,
  stats: UserStats
): Promise<string[]> {
  const checks = await checkAchievements(userId, stats);
  const newlyUnlocked: string[] = [];

  for (const check of checks) {
    if (check.unlocked) {
      const wasNew = await unlockAchievement(userId, check.achievementId);
      if (wasNew) newlyUnlocked.push(check.name);
    }
  }

  return newlyUnlocked;
}
