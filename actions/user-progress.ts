'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { unstable_cache } from 'next/cache';

export type UserStats = {
  id: string;
  xp: number;
  gems: number;
  hearts: number;
  currentStreak: number;
  lastStudyDate: Date | null;
  username: string;
  avatarUrl: string | null;
};

async function fetchUserStats(clerkId: string): Promise<UserStats | null> {
  const user = await db.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      xp: true,
      gems: true,
      hearts: true,
      currentStreak: true,
      lastStudyDate: true,
      username: true,
      avatarUrl: true,
    },
  });
  return user;
}

export async function getUserStats(): Promise<UserStats | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const getCachedStats = unstable_cache(
    () => fetchUserStats(clerkId),
    [`user-stats-${clerkId}`],
    { revalidate: 60, tags: [`user-${clerkId}`] }
  );

  return getCachedStats();
}

export async function revalidateUserStats(): Promise<void> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;
  revalidatePath('/profile');
  revalidatePath('/learn');
}
