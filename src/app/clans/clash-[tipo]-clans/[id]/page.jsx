// app/clans/clash-royale-clans/page.jsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import GroupDetailclans from './GroupDetailclans';
import Head from 'next/head';

// 🔥 SEO Metadata for /clans/clash-royale-clans
const metadata = {
  title: 'Clash Royale Clans 2025 ⚔️ | Join, Search, or Recruit Players',
  description:
    'Discover the best Clash Royale clans of 2025. Filter by cups, join active clans, or publish yours for free to recruit players.',
  keywords:
    'clash royale clans, join clash royale clan, recruit players, publish clan free, clan wars, active clans 2025, top clash royale clans, clans in English',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://en.joingroups.pro/clans/clash-royale-clans/blacknigthmare',
    languages: {
      'en-US': 'https://en.joingroups.pro/clans/clash-royale-clans',
      es: 'https://joingroups.pro/clans/clash-royale-clans',
      'x-default': 'https://en.joingroups.pro/clans/clash-royale-clans',
    },
  },
  openGraph: {
    title: '⚔️ Active Clash Royale Clans 2025 | Find or Publish Yours',
    description:
      'Discover active Clash Royale clans and find the perfect one for you. Clan leader? Publish your clan for free and recruit active players easily.',
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
    title: 'Active Clash Royale Clans in 2025 | Publish or Join for Free',
    description:
      'Browse active Clash Royale clans or list your own for free. Perfect for players and leaders looking to grow in clan wars.',
    images: ['https://joingroups.pro/clashRoyaleFondo1.png'],
  },
};

export default async function ClashRoyalePage() {
  // 🔄 Obtener clanes desde Firestore
  const snapshot = await getDocs(collection(db, 'clanes'));

  const allGroups = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString() || null,
    };
  });

  // 🎯 Filtrar solo clanes de Clash Royale
  const clashRoyaleClans = allGroups.filter(g => g.tipo === 'clash-royale');
  const destacados = clashRoyaleClans.filter(g => g.destacado);
  const normales = clashRoyaleClans.filter(g => !g.destacado);
  const sortedClans = [...destacados, ...normales];

  // 📦 JSON-LD Schema.org for SEO Sitelinks
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Active Clash Royale Clans 2025',
    description: metadata.description,
    url: metadata.alternates.canonical,
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
          item: metadata.alternates.canonical,
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: sortedClans.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: g.name,
        url: g.url,
      })),
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
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <link rel="canonical" href={metadata.alternates.canonical} />
        <link rel="alternate" hrefLang="en-US" href={metadata.alternates.languages['en-US']} />
        <link rel="alternate" hrefLang="es" href={metadata.alternates.languages.es} />
        <link rel="alternate" hrefLang="x-default" href={metadata.alternates.languages['x-default']} />
        <link rel="icon" href="/favicon.ico" />

        {/* OG + Twitter */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <GroupDetailclans initialData={sortedClans} />
    </>
  );
}
