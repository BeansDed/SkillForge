'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function exportUserData(userId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: { id: userId, clerkId },
    include: {
      purchases: true,
      achievements: true,
      leaderboardEntries: true,
    },
  });

  if (!user) throw new Error('User not found');

  return {
    user: {
      username: user.username,
      email: user.email,
      xp: user.xp,
      gems: user.gems,
      currentStreak: user.currentStreak,
      createdAt: user.createdAt,
    },
    purchases: user.purchases,
    achievements: user.achievements,
    leaderboardEntries: user.leaderboardEntries,
    exportedAt: new Date().toISOString(),
  };
}

export async function anonymizeUser(userId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({ where: { id: userId, clerkId } });
  if (!user) throw new Error('User not found');

  const anonymousId = crypto.randomUUID().slice(0, 8);

  await db.user.update({
    where: { id: userId },
    data: {
      email: `deleted_${anonymousId}@void.skillforge.com`,
      username: `Ghost_${anonymousId}`,
      avatarUrl: null,
      deletedAt: new Date(),
    },
  });

  return { success: true };
}

export async function getDataExportStatus(userId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({ where: { id: userId, clerkId } });
  return { canExport: !!user, canDelete: !!user && !user.deletedAt };
}
