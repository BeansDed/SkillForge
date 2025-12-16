'use client';

import { useTransition } from 'react';
import { Gem, Heart, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { purchaseItem } from '@/actions/store';

interface StoreItemCardProps {
  id: string;
  type: string;
  name: string;
  priceGems: number;
  userGems: number;
}

const ITEM_ICONS: Record<string, React.ReactNode> = {
  HEART_REFILL: <Heart className="w-8 h-8 text-red-500" />,
  STREAK_FREEZE: <Shield className="w-8 h-8 text-blue-500" />,
  AVATAR_COSMETIC: <Palette className="w-8 h-8 text-purple-500" />,
  PROFILE_THEME: <Palette className="w-8 h-8 text-pink-500" />,
};

export function StoreItemCard({ id, type, name, priceGems, userGems }: StoreItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const canAfford = userGems >= priceGems;

  const handlePurchase = () => {
    startTransition(async () => {
      try {
        await purchaseItem(id);
      } catch (error) {
        console.error('Purchase failed:', error);
      }
    });
  };

  return (
    <div className="bg-surface rounded-2xl p-6 border border-gray-800 flex flex-col items-center gap-4">
      <div className="p-4 bg-gray-800 rounded-xl">{ITEM_ICONS[type] || <Gem className="w-8 h-8" />}</div>
      <h3 className="font-bold text-lg">{name}</h3>
      <div className="flex items-center gap-2">
        <Gem className="w-5 h-5 text-cyan-500" />
        <span className="font-bold">{priceGems}</span>
      </div>
      <Button
        onClick={handlePurchase}
        disabled={!canAfford || isPending}
        variant={canAfford ? 'primary' : 'secondary'}
        className="w-full"
      >
        {isPending ? 'Buying...' : canAfford ? 'Buy' : 'Not enough gems'}
      </Button>
    </div>
  );
}
