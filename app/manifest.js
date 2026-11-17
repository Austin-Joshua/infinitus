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
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
