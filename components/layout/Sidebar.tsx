'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Trophy, Target, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/leaderboards', icon: Trophy, label: 'Leaderboards' },
  { href: '/quests', icon: Target, label: 'Quests' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-surface border-r border-gray-800 fixed left-0 top-0">
      <div className="p-6">
        <Link href="/learn" className="text-2xl font-bold">
          Skill<span className="text-primary">Forge</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                isActive
                  ? 'bg-primary/20 text-primary border-l-4 border-primary'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
