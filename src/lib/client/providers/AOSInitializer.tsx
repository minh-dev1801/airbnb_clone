// components/AOSInitializer.tsx
'use client'; // Đánh dấu đây là component client

import { useEffect } from 'react';
import AOS from 'aos';

export default function AOSInitializer() {
  useEffect(() => {
    AOS.init();
  }, []);

  return null;
} 