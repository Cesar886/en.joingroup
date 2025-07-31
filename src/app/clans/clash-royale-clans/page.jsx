
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import ClashRoyaleClient from './ClashRoyaleClient';
import Head from 'next/head'; // Asegúrate de importar esto si no usas app router con metadata export

export const metadata = {
  title: 'Clash Royale Clans ⚔️ | Join, Recruit or Publish Your Clan FREE',
  description: 'Find the best Clash Royale clans to join or recruit active players. Use filters to sort by trophies, region, language, or activity. Discover new teams, connect with active players, or list your clan for free to start recruiting today.',
  keywords: 'clash royale clans, join clash royale clan, recruit clash royale players, publish clan free, active clash royale clans, best clash royale clans, clan wars, clash royale clan search',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://en.joingroups.pro/clans/clash-royale-clans',
    languages: {
      'en-US': 'https://en.joingroups.pro/clans/clash-royale-clans',
      'es': 'https://joingroups.pro/clans/clash-royale-clans',
      'x-default': 'https://en.joingroups.pro/clans/clash-royale-clans',
    },
  },
  openGraph: {
    title: '⚔️ Clash Royale Clans | Find or Publish Yours',
    description: 'Discover Clash Royale clans and find the perfect one for you. Clan leader? Publish your clan for free and recruit active players easily.',
    url: 'https://en.joingroups.pro/clans/clash-royale-clans',
    siteName: 'Clash Royale Clans',
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
    title: 'Clash Royale Clans | Publish or Join for Free',
    description: 'Browse Clash Royale clans or list your own for free. Perfect for players and leaders looking to grow in clan wars.',
    images: ['https://joingroups.pro/clashRoyaleFondo1.png'],
  },
};



export default async function ClashRoyalePage() {
  const snapshot = await getDocs(collection(db, 'clanes'));
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
    name: 'Clash Royale Clans | Join, Recruit or Publish Your Clan FREE',
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://en.joingroups.pro/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    significantLink: [
      {
        '@type': 'WebPage',
        name: 'Join a Clash Royale Clan',
        url: 'https://en.joingroups.pro/clans/clash-royale-clans?action=join'
      },
      {
        '@type': 'WebPage',
        name: 'Recruit Clash Royale Players',
        url: 'https://en.joingroups.pro/clans/clash-royale-clans?action=recruit'
      },
      {
        '@type': 'WebPage',
        name: 'Publish Your Clan for Free',
        url: 'https://en.joingroups.pro/clans/clash-royale-clans?action=publish'
      },
      {
        '@type': 'WebPage',
        name: 'Active Clash Royale Clans',
        url: 'https://en.joingroups.pro/clans/clash-royale-clans?filter=active'
      }
    ]
  };


  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <ClashRoyaleClient initialData={sorted} />
    </>
  );
}
