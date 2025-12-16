import { redirect } from 'next/navigation';
import { getOrCreateUser } from '@/lib/getOrCreateUser';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsCard } from '@/components/profile/StatsCard';
import { StreakCard } from '@/components/profile/StreakCard';

export default async function ProfilePage() {
  const user = await getOrCreateUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileHeader username={user.username} avatarUrl={user.avatarUrl} />
        <StatsCard xp={user.xp} gems={user.gems} hearts={user.hearts} />
        <StreakCard
          currentStreak={user.currentStreak}
          lastStudyDate={user.lastStudyDate}
        />
      </div>
    </div>
  );
}
