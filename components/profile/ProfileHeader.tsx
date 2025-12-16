'use client';

import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AvatarCard } from './AvatarCard';
import { EditProfileModal } from './EditProfileModal';

interface ProfileHeaderProps {
  username: string;
  avatarUrl: string | null;
}

export function ProfileHeader({ username, avatarUrl }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="relative">
        <AvatarCard username={username} avatarUrl={avatarUrl} />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentUsername={username}
        currentAvatarUrl={avatarUrl}
      />
    </>
  );
}
