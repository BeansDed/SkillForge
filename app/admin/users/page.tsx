import { db } from '@/lib/db';

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    select: { id: true, username: true, email: true, xp: true, gems: true, hearts: true },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4">Username</th>
              <th className="text-left p-4">Email</th>
              <th className="text-right p-4">XP</th>
              <th className="text-right p-4">Gems</th>
              <th className="text-right p-4">Hearts</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-800">
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4 text-right text-yellow-500">{user.xp}</td>
                <td className="p-4 text-right text-cyan-500">{user.gems}</td>
                <td className="p-4 text-right text-red-500">{user.hearts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
