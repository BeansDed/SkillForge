import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/store', label: 'Store' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth();
  const isAdmin = (sessionClaims?.metadata as { role?: string })?.role === 'admin';

  if (!isAdmin) redirect('/learn');

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-danger/20 border-b border-danger p-2 text-center">
        <span className="text-danger font-bold">ADMIN MODE</span>
      </div>
      <div className="flex">
        <aside className="w-64 bg-surface border-r border-gray-800 min-h-screen p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
