'use client';

import { Heart, Gem, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StickyWrapperProps {
  hearts: number;
  gems: number;
  streak: number;
  isStreakActive: boolean;
}

export function StickyWrapper({
  hearts,
  gems,
  streak,
  isStreakActive,
}: StickyWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 lg:left-64 bg-surface/95 backdrop-blur-sm border-b border-gray-800 z-40"
    >
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-end gap-6">
        <div className="flex items-center gap-2">
          <Heart className={cn('w-5 h-5', hearts > 0 ? 'text-red-500' : 'text-gray-500')} />
          <span className="font-bold text-white">{hearts}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-cyan-500" />
          <span className="font-bold text-white">{gems.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className={cn('w-5 h-5', isStreakActive ? 'text-orange-500' : 'text-gray-500')} />
          <span className="font-bold text-white">{streak}</span>
        </div>
      </div>
    </motion.div>
  );
}
