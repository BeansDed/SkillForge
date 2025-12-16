import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const [userCount, lessonCount, totalXP] = await Promise.all([
    db.user.count(),
    db.userAchievement.count(),
    db.user.aggregate({ _sum: { xp: true } }),
  ]);

  const stats = [
    { label: 'Total Users', value: userCount },
    { label: 'Achievements Earned', value: lessonCount },
    { label: 'Total XP Earned', value: totalXP._sum.xp?.toLocaleString() || 0 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
