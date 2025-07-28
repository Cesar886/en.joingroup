// ✅ Archivo: /app/clans/clans-de-clash-royale/page.jsx

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import ClashRoyaleClient from './ClashRoyaleClient';
import Head from 'next/head'; // Asegúrate de importar esto si no usas app router con metadata export

export const metadata = {
  title: 'Active Clash Royale Clans 2025 ⚔️ | Join, Search, or Recruit Players',
  description: 'Explore the most up-to-date list of active Clash Royale clans in 2025. Filter by trophies, find your ideal clan, or publish yours for free to attract new members.',
  keywords: 'clash royale clans, join clash royale clan, recruit players, publish clan free, clan wars, active clans 2025, top clash royale clans, clans in English',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://en.joingroups.pro/clans/clash-royale-clans',
    languages: {
      'en-US': 'https://en.joingroups.pro/clans/clash-royale-clans',
      'es': 'https://joingroups.pro/clans/clans-de-clash-royale',
      'x-default': 'https://en.joingroups.pro/clans/clash-royale-clans',
    },
  },
  openGraph: {
    title: '⚔️ Active Clash Royale Clans 2025 | Find or Publish Yours',
    description: 'Discover active Clash Royale clans and find the perfect one for you. Clan leader? Publish your clan for free and recruit active players easily.',
    url: 'https://en.joingroups.pro/clans/clash-royale-clans',
    siteName: 'JoinGroups.pro',
    images: [
      {
        url: 'https://joingroups.pro/clashRoyaleFondo1.png',
        width: 1200,
        height: 630,
        alt: 'Clash Royale characters battling in the arena',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Active Clash Royale Clans in 2025 | Publish or Join for Free',
    description: 'Browse active Clash Royale clans or list your own for free. Perfect for players and leaders looking to grow in clan wars.',
    images: ['https://joingroups.pro/clashRoyaleFondo1.png'],
  },
};


export default async function ClashRoyalePage() {
  const snapshot = await getDocs(collection(db, 'clans'));
  const groups = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString() || null,
    };
  });

  const clashRoyaleFilter = groups.filter(g => g.tipo === 'clash-royale');
  const destacados = clashRoyaleFilter.filter(g => g.destacado);
  const normales = clashRoyaleFilter.filter(g => !g.destacado);
  const sorted = [...destacados, ...normales];

  const itemListElements = sorted.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: g.name,
    url: g.url,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Active Clash Royale Clans 2025',
    description: metadata.description,
    url: 'https://en.joingroups.pro/clans/clash-royale-clans',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://en.joingroups.pro/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Clans',
          item: 'https://en.joingroups.pro/clans',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Clash Royale',
          item: 'https://en.joingroups.pro/clans/clash-royale-clans',
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: itemListElements,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Clash Royale Clans',
      url: 'https://en.joingroups.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://joingroups.pro/icon-512.png',
      },
    },
  };


  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <ClashRoyaleClient initialData={sorted} />
    </>
  );
}
