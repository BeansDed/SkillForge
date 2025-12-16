'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addFriend(friendId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error('User not found');

  await db.friendship.create({
    data: { userId: user.id, friendId, status: 'PENDING' },
  });

  revalidatePath('/friends');
}

export async function acceptFriend(friendshipId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error('User not found');

  await db.friendship.update({
    where: { id: friendshipId, friendId: user.id },
    data: { status: 'ACCEPTED' },
  });

  revalidatePath('/friends');
}

export async function getFeed(limit: number = 20) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return [];

  const friendships = await db.friendship.findMany({
    where: { OR: [{ userId: user.id }, { friendId: user.id }], status: 'ACCEPTED' },
  });

  const friendIds = friendships.map((f) => (f.userId === user.id ? f.friendId : f.userId));

  return db.activity.findMany({
    where: { userId: { in: [...friendIds, user.id] } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { username: true, avatarUrl: true } } },
  });
}

export async function cheerUser(targetUserId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error('User not found');

  await db.activity.create({
    data: { userId: user.id, type: 'CHEER', targetUserId },
  });
}
