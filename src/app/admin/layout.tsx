'use client';

import { ReactNode, useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Header = dynamic(() => import('../components/admin/header/Header'), {
  ssr: false,
});
const SideBar = dynamic(() => import('../components/admin/sidebar/SideBar'), {
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // Kiểm tra role ADMIN khi component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    let parsedUser;

    try {
      parsedUser = user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    if (!parsedUser || parsedUser.role !== 'ADMIN') {
      router.push('/');
    }
  }, [router]);

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <SideBar>{memoizedChildren}</SideBar>
      </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;
