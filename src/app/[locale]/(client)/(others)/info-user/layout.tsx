'use client';

import { ReactNode } from 'react';
import SubBanner from '@/components/client/banner/SubBanner';

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
