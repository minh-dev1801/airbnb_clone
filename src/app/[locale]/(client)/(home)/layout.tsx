'use client';

import { ReactNode } from 'react';
import Banner from '@/components/client/banner';
import Search from '@/components/client/search';
import FilterRoom from '@/components/client/rooms/FilterRoom';

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
