import { getWeeklyLeaderboard, getUserRank } from '@/actions/leaderboard';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';

export default async function LeaderboardsPage() {
  const [entries, userRank] = await Promise.all([
    getWeeklyLeaderboard(),
    getUserRank(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leaderboards</h1>
        {userRank && (
          <div className="bg-surface px-4 py-2 rounded-xl">
            <span className="text-gray-400">Your Rank: </span>
            <span className="font-bold text-primary">#{userRank}</span>
          </div>
        )}
      </div>
      <LeaderboardList entries={entries} />
    </div>
  );
}
