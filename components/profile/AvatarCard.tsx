import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarCardProps {
  username: string;
  avatarUrl: string | null;
}

export function AvatarCard({ username, avatarUrl }: AvatarCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6 border border-gray-800 flex flex-col items-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-4">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-500" />
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold text-white">{username}</h2>
    </div>
  );
}
