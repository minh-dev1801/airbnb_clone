'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Link from 'next/link';
import BulbIcon from '@/components/client/icons/BulbIcon';
import { useTranslations } from 'next-intl';

export default function UnderDevelopmentPage() {
  const t = useTranslations('UnderDev');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl dark:bg-gray-800 text-center">
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            <BulbIcon />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {t('title')}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('description')}
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('backHome')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
