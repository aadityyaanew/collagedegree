export default function manifest() {
  return {
    name: 'Compare Degree - Smart Decisions, Brighter Futures',
    short_name: 'Compare Degree',
    description:
      'Compare colleges, courses, fees, placements, rankings, and reviews side by side. India’s most comprehensive higher education portal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#9E0927',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
