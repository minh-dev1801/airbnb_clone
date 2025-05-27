import { ReactNode } from 'react';
import Banner from '@/components/client/banner';
import Search from '@/components/client/search';
import FilterRoom from '@/components/client/rooms/FilterRoom';
import { getLocale } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as 'vi' | 'en';
  const translations = {
    vi: {
      title: 'Trang chủ',
      description: 'Khám phá các chỗ ở tuyệt vời với AirBnb Clone.',
    },
    en: {
      title: 'Home',
      description: 'Discover amazing accommodations with AirBnb Clone.',
    },
  };

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    ),
    title: translations[locale]?.title || translations.vi.title,
    description:
      translations[locale]?.description || translations.vi.description,
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: translations[locale]?.title || translations.vi.title,
      description:
        translations[locale]?.description || translations.vi.description,
      url: `/${locale}`,
      siteName: 'AirBnb Clone',
      locale,
      type: 'website',
      images: [
        {
          url: '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Ảnh đại diện mặc định',
        },
      ],
    },
  };
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Banner />
      <Search />
      <FilterRoom />
      {children}
    </>
  );
}
