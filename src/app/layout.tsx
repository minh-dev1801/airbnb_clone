import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '@/app/globals.css';
import ProviderRedux from '@/lib/client/store/StoreProvider';
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'] });
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProviderWrapper } from '@/lib/client/providers/ThemeProviderWrapper';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
  title: {
    template: '%s | AirBnb Clone',
    default: 'AirBnb Clone',
  },
  description:
    'Chào mừng đến với AirBnb Clone - Nơi cung cấp dịch vụ để tìm kiếm chỗ ở tốt nhất.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'AirBnb Clone',
    title: 'AirBnb Clone',
    description:
      'Chào mừng đến với AirBnb Clone - Nơi cung cấp dịch vụ để tìm kiếm chỗ ở tốt nhất.',
    images: [
      {
        url: '/default-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ảnh đại diện mặc định',
      },
    ],
  },
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={roboto.className}>
        <ProviderRedux>
          <NextIntlClientProvider locale={locale}>
            <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
          </NextIntlClientProvider>
        </ProviderRedux>
      </body>
    </html>
  );
}
