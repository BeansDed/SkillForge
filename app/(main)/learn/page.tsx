import { getOrCreateUser } from '@/lib/getOrCreateUser';
import { redirect } from 'next/navigation';

export default async function LearnPage() {
  const user = await getOrCreateUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Learn</h1>
      <p className="text-gray-400">Welcome back, {user.username}!</p>
      <div className="grid gap-4">
        <div className="bg-surface rounded-2xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-2">Start Learning</h2>
          <p className="text-gray-400">Begin your journey to mastery.</p>
        </div>
      </div>
    </div>
  );
}
