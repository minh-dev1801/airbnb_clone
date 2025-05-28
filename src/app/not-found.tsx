"use client"

import Link from "next/link";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslations } from 'next-intl';

const NotFound = () => {
  const t = useTranslations('NotFound');
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-transparent">
      <DotLottieReact
        src="/lottie/error.lottie"
        loop
        autoplay
        style={{ height: 400, width: 400 }}
        onError={(error) => console.error("Lottie error:", error)}
      />
      <h1 className="text-4xl font-bold text-red-600">{t('404')}</h1>
      <p className="mt-4 text-lg">{t('pageNotFound')}</p>
      <Link href="/" className="mt-4 bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition dark:bg-gray-800   dark:hover:bg-gray-700 cursor-pointer">
        {t('backToHome')}
      </Link>
    </div>
  );
};

export default NotFound;