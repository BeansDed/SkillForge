'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ECONOMY } from '@/lib/economy';

export async function getStoreItems() {
  return db.storeItem.findMany({
    where: { isActive: true },
    orderBy: { priceGems: 'asc' },
  });
}

export async function purchaseItem(itemId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error('User not found');

  const item = await db.storeItem.findUnique({ where: { id: itemId } });
  if (!item) throw new Error('Item not found');

  if (user.gems < item.priceGems) {
    throw new Error('Insufficient gems');
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { gems: { decrement: item.priceGems } },
    });

    await tx.userPurchase.create({
      data: { userId: user.id, storeItemId: item.id },
    });

    await applyPurchaseEffect(tx, user.id, item.type);
  });

  revalidatePath('/shop');
  revalidatePath('/profile');
  return { success: true };
}

async function applyPurchaseEffect(tx: any, userId: string, itemType: string) {
  switch (itemType) {
    case 'HEART_REFILL':
      await tx.user.update({
        where: { id: userId },
        data: { hearts: ECONOMY.MAX_HEARTS },
      });
      break;
    case 'STREAK_FREEZE':
      break;
    default:
      break;
  }
}
