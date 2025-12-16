'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Trophy, Target, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/leaderboards', icon: Trophy, label: 'Ranks' },
  { href: '/quests', icon: Target, label: 'Quests' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                isActive ? 'text-primary' : 'text-gray-400'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
