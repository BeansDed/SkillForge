'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface UpdateProfileData {
  username: string;
  avatarUrl: string | null;
}

export async function updateProfile(data: UpdateProfileData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.update({
    where: { clerkId },
    data: {
      username: data.username,
      avatarUrl: data.avatarUrl,
    },
  });

  revalidatePath('/profile');
  return user;
}
