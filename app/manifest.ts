import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SkillForge - Learn & Level Up',
    short_name: 'SkillForge',
    description: 'A gamified learning platform to master new skills',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#6366F1',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
