import { Shield } from 'lucide-react';
import { LEAGUES, type LeagueName } from '@/lib/leagues';

interface LeagueBadgeProps {
  league: LeagueName;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export function LeagueBadge({ league, size = 'md' }: LeagueBadgeProps) {
  const { name, color } = LEAGUES[league];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${SIZES[size]} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: `${color}20` }}
      >
        <Shield className={SIZES[size]} style={{ color }} />
      </div>
      {size !== 'sm' && (
        <span className="text-sm font-medium" style={{ color }}>
          {name}
        </span>
      )}
    </div>
  );
}
