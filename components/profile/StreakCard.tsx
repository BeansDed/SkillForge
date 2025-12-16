import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  currentStreak: number;
  lastStudyDate: Date | null;
}

function isStreakActive(lastStudyDate: Date | null): boolean {
  if (!lastStudyDate) return false;
  const now = new Date();
  const last = new Date(lastStudyDate);
  const diffTime = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
}

export function StreakCard({ currentStreak, lastStudyDate }: StreakCardProps) {
  const isActive = isStreakActive(lastStudyDate);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-4">Streak</h3>
      <div className="flex items-center gap-4">
        <div className={cn(
          'p-3 rounded-xl',
          isActive ? 'bg-orange-500/20' : 'bg-gray-700/50'
        )}>
          <Flame className={cn(
            'w-8 h-8',
            isActive ? 'text-orange-500' : 'text-gray-500'
          )} />
        </div>
        <div>
          <p className="text-3xl font-bold text-white">{currentStreak}</p>
          <p className="text-sm text-gray-400">
            {isActive ? 'day streak!' : 'days - keep learning!'}
          </p>
        </div>
      </div>
    </div>
  );
}
