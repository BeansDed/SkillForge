'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { updateProfile } from '@/actions/profile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentAvatarUrl: string | null;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentAvatarUrl,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateProfile({ username, avatarUrl: avatarUrl || null });
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white"
              placeholder="https://..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
