'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

interface AchievementToastProps {
  achievement: string | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 z-50"
        >
          <Trophy className="w-8 h-8" />
          <div>
            <p className="text-sm font-medium">Achievement Unlocked!</p>
            <p className="font-bold text-lg">{achievement}</p>
          </div>
          <button onClick={onClose} className="ml-4">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
