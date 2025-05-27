import { ReactNode } from 'react';
import SubBanner from '@/components/client/banner/SubBanner';

import { getLocale } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as 'vi' | 'en';
  const translations = {
    vi: {
      title: 'Thông tin phòng',
      description: 'Thông tin phòng của bạn.',
    },
    en: {
      title: 'Room information',
      description: 'Room information.',
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

export default function RoomDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SubBanner />
      {children}
    </>
  );
}
