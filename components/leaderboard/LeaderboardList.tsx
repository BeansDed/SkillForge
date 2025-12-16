'use client';

import Image from 'next/image';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/actions/leaderboard';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 text-center text-gray-500">{rank}</span>;
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.userId}
          className={cn(
            'flex items-center gap-4 p-4 rounded-xl',
            entry.isCurrentUser ? 'bg-primary/20 border border-primary' : 'bg-surface'
          )}
        >
          <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
            {entry.avatarUrl ? (
              <Image src={entry.avatarUrl} alt={entry.username} width={40} height={40} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>
          <span className="flex-1 font-medium">{entry.username}</span>
          <span className="text-yellow-500 font-bold">{entry.xpEarned.toLocaleString()} XP</span>
        </div>
      ))}
    </div>
  );
}
