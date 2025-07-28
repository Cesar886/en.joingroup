"use client";
import {
  ActionIcon,
  Title,
  Text,
  Button,
  Container,
  Stack,
  Group,
  Box,
  Menu,
  Center,
  Divider,
  Paper,
  rem,
  Table,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconFlame,
  IconTrendingUp,
  IconCrown,
  IconStar,
  IconNews,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import styles from '@/app/styles/Page.module.css';
import { useEffect, useState, useRef } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import slugify from '@/lib/slugify';
import { useRouter } from 'next/navigation';
import '@/locales/i18n'; // Importa tus archivos de traducción




const countries = [
  { value: 'es', label: 'México', emoji: '🇲🇽', lang: 'es' },
  { value: 'en', label: 'Estados Unidos', emoji: '🇺🇸', lang: 'en' },
];

const countryMap = {
  mx: '🇲🇽',
  us: '🇺🇸',
};


const featuredButtons = [
  {
    to: '/comunidades/grupos-de-telegram?orden=top',
    label: 'Top grupos de Telegram',
    icon: <IconFlame size={18} />, color: 'cyan',
  },
  {
    to: '/comunidades?orden=top',
    label: 'Más vistos',
    icon: <IconTrendingUp size={18} />, color: 'orange',
  },
  {
    to: '/clans/clash-royale-clans',
    label: 'Clash Royale clans',
    icon: <IconCrown size={18} />, color: 'pink',
  },
  {
    to: '/comunidades/grupos-de-whatsapp?orden=top',
    label: 'Top grupos de WhatsApp',
    icon: <IconStar size={18} />, color: 'teal',
  },
  {
    to: '/comunidades?orden=nuevos',
    label: 'Nuevos grupos',
    icon: <IconNews size={18} />, color: 'cyan',
  },
  {
    to: '/clans/clsh-of-clans-clans',
    label: 'Clash of Clans clans',
    icon: <IconStar size={18} />, color: 'pink',
  },
];

export default function HomeClient({ serverData }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [clanes, setClanes] = useState([]);
  const [subdomain, setSubdomain] = useState('es'); // valor por defecto
  const baseLang = typeof i18n.language === 'string' ? i18n.language.split('-')[0] : 'es';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [buttonPosition, setButtonPosition] = useState('top-left');
  const positionRef = useRef('top-left');
  const [groupsTelegram, setGroupsTelegram] = useState([]);
  const [groupsWhatsapp, setGroupsWhatsapp] = useState([]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const sd = host.includes('.') ? host.split('.')[0] : 'es';
      setSubdomain(sd);
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const groupsSnapshot = await getDocs(collection(db, 'groups'));
      const allGroups = groupsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ordenar todos por fecha (más nuevos primero)
      const sortedGroups = [...allGroups]
        .filter(g => g.createdAt)
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      // ---------- GRUPOS GENERALES ----------
      const destacadosGroups = sortedGroups.filter(g => g.destacado === true);
      const sinDestacados = sortedGroups.filter(g => !destacadosGroups.some(d => d.id === g.id));
      const gruposFinales = [...destacadosGroups, ...sinDestacados].slice(0, 5);
      setGroups(gruposFinales);

      // ---------- TELEGRAM ----------
      const destacadosTelegram = sortedGroups.filter(
        g => g.tipo?.toLowerCase() === 'telegram' && g.destacado === true
      );
      const nuevosTelegram = sortedGroups.filter(
        g =>
          g.tipo?.toLowerCase() === 'telegram' &&
          !destacadosTelegram.some(d => d.id === g.id)
      );
      const telegramGroups = [...destacadosTelegram, ...nuevosTelegram].slice(0, 5);
      setGroupsTelegram(telegramGroups);

      // ---------- WHATSAPP ----------
      const destacadosWhatsapp = sortedGroups.filter(
        g => g.tipo?.toLowerCase() === 'whatsapp' && g.destacado === true
      );
      const nuevosWhatsapp = sortedGroups.filter(
        g =>
          g.tipo?.toLowerCase() === 'whatsapp' &&
          !destacadosWhatsapp.some(d => d.id === g.id)
      );
      const whatsappGroups = [...destacadosWhatsapp, ...nuevosWhatsapp].slice(0, 5);
      setGroupsWhatsapp(whatsappGroups);

      // ---------- CLANES ----------
      const clanesSnapshot = await getDocs(collection(db, 'clanes'));
      const allClanes = clanesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const destacadosClanes = allClanes.filter(c => c.destacado === true);
      const nuevosClanes = allClanes
        .filter(c => c.createdAt)
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .filter(c => !destacadosClanes.some(d => d.id === c.id))
        .slice(0, 4 - destacadosClanes.length);

      setClanes([...destacadosClanes, ...nuevosClanes]);
    };

    fetchData();
  }, []);


  useEffect(() => {
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

    const changePosition = () => {
      let next;
      do {
        next = positions[Math.floor(Math.random() * positions.length)];
      } while (next === positionRef.current); // evitar repetir la misma

      setButtonPosition(next);
      positionRef.current = next;
    };

    const interval = setInterval(changePosition, 10000);
    return () => clearInterval(interval);
  }, []);


  const renderCard = (row, idx, isGroup = true) => {
    const slug = row.slug || slugify(row.name);
    const iconSrc = isGroup
      ? (row.tipo?.trim().toLowerCase() === 'telegram' ? '/telegramicons.png' : '/wapp.webp')
      : (row.tipo === 'clash-royale' ? '/clashRoyaleFondo1.png' : '/clashOfClansFondo.png');

    const descriptionText =
      typeof row.description === 'object'
        ? row.description[baseLang] || row.description[i18n.language] || row.description['es']
        : row.description;

    return (
      <Paper
        key={`${row.id}-${idx}`}
        withBorder
        radius="md"
        shadow="xs"
        onClick={() => {
          const categoria = row.categories?.[0] || 'otros';
          const basePath = isGroup
            ? `/comunidades/grupos-de-${row.tipo}/${slugify(categoria)}`
            : `/clans/clans-de-${row.tipo}`;
          router.push(`${basePath}/${slug}`);
        }}
        style={{ cursor: 'pointer' }}
      >
        <Table withRowBorders={false}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Group align="center" w="100%">
                  <Group gap={10} align="center">
                    {row.city && (
                      <Text >
                        {countryMap[row.city]}
                      </Text>
                    )}
                    <Text fw={700}>{row.name}</Text>
                  </Group>

                  <Box ml="auto">
                    <img
                      src={iconSrc}
                      alt={row.name}
                      width={24}
                      height={24}
                      style={{ borderRadius: 4 }}
                    />
                  </Box>
                </Group>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" lineClamp={isMobile ? 1 : 2}>{descriptionText}</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    );
  };

  const floatingStyle = (position) => {
    const common = {
      position: 'fixed',
      zIndex: 1000,
      animation: 'pulse 1.5s infinite',
    };

    switch (position) {
      case 'top-left':
        return { ...common, top: '60px', left: '20px' };
      case 'bottom-right':
        return { ...common, bottom: '20px', right: '20px' };
      case 'top-right':
        return { ...common, top: '60px', right: '20px' };
      case 'bottom-left':
        return { ...common, bottom: '20px', left: '20px' };
      default:
        return common;
    }
  };


  return (
    <>
      <Container size="lg" py="md" className={styles.mobileContainerFix}>

        <Stack align="center" spacing="lg" px="md" mt="md">
          <Title
            order={1}
            ta="center"
            fw={isMobile ? 600 : 800}
            fz={isMobile ? 28 : 36} // puedes ajustar estos valores según tu diseño
          >
            {isMobile
              ? 'Grupos de Telegram, WhatsApp y Juegos'
              : 'The best Telegram, WhatsApp groups and active games'}
          </Title>


          <Text ta="center" c="dimmed" fz="md" maw={700} mx="auto">
            {isMobile
              ? 'Únete a comunidades en Telegram, WhatsApp y juegos populares.'
              : (
                  <>
                    {t('En')} <strong>JoinGroups.pro</strong> {t('puedes unirte fácilmente a comunidades populares en')} <strong>Telegram</strong>, <strong>WhatsApp</strong> {t('y juegos como')} <strong>Clash Royale</strong>. {t('Explora grupos organizados por temas, idiomas y más.')}
                  </>
                )}
          </Text>
          <Button
            size="lg"
            color="blue"
            component={Link}
            variant="light"
            radius="lg"
            href="/comunidades"
            style={{ fontWeight: 600 }}
          >
            {t('Explorar Grupos Populares')}
          </Button>
        </Stack>


        <Box className={styles['scrolling-container']} mt="xl" >
          <div className={styles['scrolling-track']}>
            {[...featuredButtons, ...featuredButtons].map((b, i) => (
              <Button
                key={i}
                component={Link}
                href={b.to}
                leftSection={b.icon}
                variant="light"
                radius="xl"
                color={b.color}
                style={{
                  whiteSpace: 'nowrap',
                  pointerEvents: 'auto',
                  flexShrink: 0,
                }}
              >
                {b.label}
              </Button>
            ))}
          </div>
        </Box>


        <Paper mt="xl" withBorder shadow="sm" p="md" radius="lg">
          <Group align="center" spacing="sm">
            <Title order={2} mb="sm" fz={isMobile ? 20 : 26}>
              {isMobile
                ? '✨ Grupos nuevos de Telegram'
                : '✨ Grupos nuevos y destacados de Telegram'}
            </Title>
          </Group>

          <Stack mt="sm">
            {groupsTelegram.map((group, i) => renderCard(group, i, true))}
          </Stack>

          <Center mt="md">
            <Button
              variant="light"
              component={Link}
              radius="md"
              href="/comunidades/grupos-de-telegram"
            >
              {t('Ver todos los grupos de Telegram')}
            </Button>
          </Center>
        </Paper>

        <Paper mt="xl" withBorder shadow="sm" p="md" radius="lg">
          <Group align="center" spacing="sm">
            <Title order={2} mb="sm" fz={isMobile ? 20 : 26}>
              {isMobile ? '✨ t(Grupos nuevos de WhatsApp)' : '✨ t(Grupos nuevos y destacados de WhatsApp)'}
            </Title>
          </Group>

          <Stack mt="sm">
            {groupsWhatsapp.map((group, i) => renderCard(group, i, true))}
          </Stack>

          <Center mt="md">
            <Button
              variant="light"
              component={Link}
              radius="md"
              href="/comunidades/grupos-de-whatsapp"            
            >
              {t('Ver todos los grupos de WhatsApp')}
            </Button>
          </Center>
        </Paper>


        <Paper mt="xl" withBorder shadow="sm" p="md" radius="lg">
          <Title order={2} mb="sm" fz={isMobile ? 20 : 26}>{isMobile ? '🏆 clans destacados' : '🏆 clans destacados y con más vistas'}</Title>
          <Stack>
            {clanes.map((clan, i) => renderCard(clan, i, false))}
          </Stack>
          <Center mt="md">
            <Button variant="light" component={Link} radius="md" href="/clans" color='violet'>
              Ver todos los clans
            </Button>
          </Center>
        </Paper>

        <Center mt="xl">
          <Button component={Link} href="/clans/publish-clan" variant='light' color="violet" size="lg" radius='lg'>
            Publica tu CLAN ahora
          </Button>
        </Center>

        <Box
          onPointerDownCapture={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <Menu shadow="md" width={200} withinPortal position="bottom-end">
            <Menu.Target>
              <ActionIcon
                size="lg"
                radius="xl"
                variant="subtle"
                style={{
                  fontSize: rem(24),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{
                  fontSize: '16px',
                  display: 'inline-block',
                  lineHeight: '1',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  width: '20px',
                  height: '14px',
                }}>
                  {countries.find((c) => c.value === subdomain)?.emoji ?? '🇲🇽'}
                </span>
                <span style={{ fontSize: '0.75rem', transform: 'translateY(1px)' }}>▼</span>
              </ActionIcon>

            </Menu.Target>

            <Menu.Dropdown
              style={{
                maxHeight: rem(300),
                overflowY: 'auto',
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              {countries.map((country) => (
                <Menu.Item
                  key={country.value}
                  leftSection={
                    <span style={{
                      fontSize: '16px',
                      display: 'inline-block',
                      lineHeight: '1',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      width: '20px',
                      height: '14px',
                    }}>
                      {country.emoji}
                    </span>
                  }
                  onClick={() => {
                    const currentPath = window.location.pathname + window.location.search;
                    i18n.changeLanguage(country.lang);
                    window.location.href = `https://${country.value}.joingroups.pro${currentPath}`;
                  }}
                >
                  {country.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>

          </Menu>
        </Box>

        <Box mt="xl" mx="auto" style={isMobile ? { textAlign: 'center' } : {}}>
          <Divider my="lg" />
          <Title order={2} mb="xs">Únete a los mejores grupos y canales de Telegram, WhatsApp y más</Title>

          <Text fz="sm" c="dimmed" mb="sm">
            ¿Quieres encontrar un <strong>grupo</strong> o <strong>canal</strong> activo en <strong>Telegram</strong>, <strong>WhatsApp</strong> o incluso juegos? En <strong>JoinGroups</strong> puedes <strong>descubrir, conocer</strong> y unirte fácilmente a miles de <strong>grupos</strong> clasificados por temática, país y número de <strong>miembros</strong>. 
          </Text>

          <Text fz="sm" c="dimmed" mb="sm">
            Nuestra plataforma te ayuda a encontrar <strong>canales</strong> de calidad en categorías como anime, música, desarrollo, amistad, NSFW, salud, IA, memes y más. Todos los <strong>grupos</strong> son verificados y contienen contenido actualizado.
          </Text>

          <Text fz="sm" c="dimmed" mb="sm">
            <strong>JoinGroups</strong> ha sido diseñado para que <strong>puedas</strong> navegar rápidamente, desde cualquier dispositivo, ya sea <strong>Android</strong> o PC. Utiliza nuestros filtros inteligentes por idioma, país o tipo de <strong>contenido</strong> para encontrar exactamente lo que buscas.
          </Text>

          <Text fz="sm" c="dimmed" mb="sm">
            Si eres creador, también puedes <strong>crear</strong> tu propio <strong>grupo</strong> y publicarlo gratis. Miles de <strong>usuarios</strong> buscan comunidades nuevas cada día, así que no pierdas la oportunidad de hacer crecer la tuya.
          </Text>

          <Text fz="sm" c="dimmed" mb="sm">
            En <strong>JoinGroups</strong> priorizamos la seguridad: no recopilamos datos personales y verificamos cada enlace manualmente. Nuestra misión es ayudarte a <strong>conectar</strong> con <strong>personas</strong> reales y comunidades auténticas, sin spam.
          </Text>

          <Text fz="sm" c="dimmed">
            Ya sea que quieras hacer nuevos amigos, aprender algo nuevo o simplemente pasar el rato, aquí encontrarás la <strong>forma</strong> más fácil de acceder a las mejores comunidades. Incluso si vienes desde <strong>Google</strong>, te damos la bienvenida a JoinGroups.
          </Text>
        </Box>

        <Button
          radius="md" 
          component={Link}
          href="/clans/clans-de-clash-royale"
          variant="light"
          color="blue"
          size="lg"
        >
           Ver clans de Clash Royale
        </Button>

        <Button
          component={Link}
          href="/comunidades/subir-grupo"
          color="rgba(255, 0, 0, 1)"
          size="sm"
          variant='filled'
          radius="xl"
          className={styles['floating-publish-button']}
          style={{
            ...floatingStyle(buttonPosition),
          }}
        >
          {t('Publica tu grupo GRATIS !!')}
        </Button>

        <Button
          variant="outline"
          color="blue"
          mt='xl'
          component="a"
          href="https://wa.me/5212284935831?text=Hola,%20quisiera%20sugerir%20un%20cambio%20para%20la%20pagina%20de%20JoinGroups"
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
        >
          {t('¿Tienes problemas? O quisieras sugerir un cambio en la página? Escríbenos por WhatsApp')}
        </Button>

      </Container>
    </>

  );
}

export async function getServerSideProps() {
  const snapshot = await getDocs(collection(db, 'groups'));
  const groups = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
  }));

  const destacados = groups.filter(g => g.destacado);
  const normales = groups.filter(g => !g.destacado);
  const ordenados = [...destacados, ...normales];

  return {
    props: {
      serverData: ordenados, // ⬅️ Este nombre debe coincidir con la prop que usas en el componente
    },
  };
}
