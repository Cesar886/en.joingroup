import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import HomeClient from './HomeClient';

export const metadata = {
  title: 'Join Active Telegram & WhatsApp Groups and Top Gaming Clans',
  description: 'Explore a curated directory of the best Telegram and WhatsApp groups, plus top gaming clans like Clash of Clans, Clash Royale, and more. Filter by country, interest, or game category and join instantly.',
  keywords: 'join Telegram groups, WhatsApp communities, gaming clans, Clash of Clans clans, active Telegram groups, groups by country, Clash Royale, international chat groups, online communities',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://joingroups.pro',
    languages: {
      'en-US': 'https://en.joingroups.pro',
      'es-ES': 'https://es.joingroups.pro',
    },
  },
  openGraph: {
    title: 'Join Top Telegram & WhatsApp Groups and Gaming Clans | JoinGroups.pro',
    description: 'Discover thousands of active groups and clans. Find your community by country, category, or game — fast and easy.',
    url: 'https://joingroups.pro/',
    siteName: 'JoinGroups.pro',
    images: [
      {
        url: 'https://joingroups.pro/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Telegram and WhatsApp group directory, gaming clans, and online communities',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Telegram & WhatsApp Groups + Gaming Clans | JoinGroups.pro',
    description: 'Browse and join thousands of active groups by country, category, or game. Fast, easy, and always up-to-date.',
    images: ['https://joingroups.pro/opengraph-image.png'],
  },
  other: {
    'yandex-verification': '6a0e37aeb6ffa1fa',
  },
};


export default async function Page() {
  const snapshot = await getDocs(collection(db, 'groups'));
  const grupos = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString() || null,
    };
  });

  const destacados = grupos.filter((g) => g.destacado);
  const normales = grupos.filter((g) => !g.destacado);
  const serverData = [...destacados, ...normales];

  return <HomeClient serverData={serverData} />;
}
