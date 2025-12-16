import { Zap, Gem, Heart } from 'lucide-react';

interface StatsCardProps {
  xp: number;
  gems: number;
  hearts: number;
}

export function StatsCard({ xp, gems, hearts }: StatsCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-4">Stats</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total XP</p>
            <p className="text-xl font-bold text-white">{xp.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Gem className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Gems</p>
            <p className="text-xl font-bold text-white">{gems.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Hearts</p>
            <p className="text-xl font-bold text-white">{hearts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
