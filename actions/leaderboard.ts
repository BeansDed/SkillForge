'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setUTCDate(diff));
  weekStart.setUTCHours(0, 0, 0, 0);
  return weekStart;
}

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  xpEarned: number;
  isCurrentUser: boolean;
};

async function fetchWeeklyLeaderboard(clerkId: string | null) {
  const weekStart = getWeekStart();

  const entries = await db.leaderboardEntry.findMany({
    where: { weekStart },
    orderBy: { xpEarned: 'desc' },
    take: 100,
    include: { user: { select: { id: true, username: true, avatarUrl: true, clerkId: true } } },
  });

  return entries.map((entry, index) => ({
    rank: index + 1,
    userId: entry.userId,
    username: entry.user.username,
    avatarUrl: entry.user.avatarUrl,
    xpEarned: entry.xpEarned,
    isCurrentUser: entry.user.clerkId === clerkId,
  }));
}

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  const { userId: clerkId } = await auth();

  const getCached = unstable_cache(
    () => fetchWeeklyLeaderboard(clerkId),
    ['weekly-leaderboard'],
    { revalidate: 300, tags: ['leaderboard'] }
  );

  return getCached();
}

export async function getUserRank(): Promise<number | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return null;

  const weekStart = getWeekStart();
  const entry = await db.leaderboardEntry.findUnique({
    where: { userId_weekStart: { userId: user.id, weekStart } },
  });

  if (!entry) return null;

  const rank = await db.leaderboardEntry.count({
    where: { weekStart, xpEarned: { gt: entry.xpEarned } },
  });

  return rank + 1;
}

export async function updateLeaderboardXP(userId: string, xpGained: number) {
  const weekStart = getWeekStart();

  await db.leaderboardEntry.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    update: { xpEarned: { increment: xpGained } },
    create: { userId, weekStart, xpEarned: xpGained },
  });
}
