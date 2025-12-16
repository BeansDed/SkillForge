import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import type { User } from '@prisma/client';

export async function getOrCreateUser(): Promise<User | null> {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) return null;

  const existingUser = await db.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) return existingUser;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const username = clerkUser.username || 
    clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 
    `user_${clerkId.slice(-8)}`;

  const email = clerkUser.emailAddresses[0]?.emailAddress || '';
  const avatarUrl = clerkUser.imageUrl;

  const newUser = await db.user.create({
    data: {
      clerkId,
      email,
      username,
      avatarUrl,
      xp: 0,
      gems: 500,
      hearts: 5,
      currentStreak: 0,
    },
  });

  return newUser;
}

export async function getCurrentUser(): Promise<User | null> {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) return null;

  return db.user.findUnique({
    where: { clerkId },
  });
}
