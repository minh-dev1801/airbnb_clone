'use client';

import Footer from '@/components/client/footer';
import Header from '@/components/client/header';
import { ToastContainer } from 'react-toastify';
import AOSInitializer from '@/lib/client/providers/AOSInitializer';
import { ReactNode } from 'react';
import FloatingChatbox from '@/components/client/chatbox/FloatingChatbox';
import BackToTop from '@/components/client/common/button/BackToTop';
import useInitializeUser from '@/components/client/hooks/useInitializeUser';

export default function ClientLayout({ children }: { children: ReactNode }) {
  useInitializeUser();
  return (
    <>
      <BackToTop />
      <FloatingChatbox />
      <ToastContainer />
      <AOSInitializer />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
