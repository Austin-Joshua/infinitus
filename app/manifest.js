import { SITE, CLUB_NAME, CLUB_SHORT } from '@/lib/site';

export default function manifest() {
  return {
    name: `${CLUB_NAME} — Mathematics Club, RIT Chennai`,
    short_name: CLUB_SHORT,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F0E8D8',
    theme_color: '#090A10',
    icons: [
      {
        src: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/brand/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/brand/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
