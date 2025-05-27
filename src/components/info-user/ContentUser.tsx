'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/client/store/store';
import CheckIcon from '@/components/client/icons/CheckIcon';
import { useTranslations } from 'next-intl';

const ContentUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const t = useTranslations('InfoUser');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <p className="font-bold text-xl">{t('verifyIdentity')}</p>
      </div>
      <p className="text-justify text-gray-600 dark:text-white">
        {t('verifyIdentityDescription')}
      </p>
      <button className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer dark:text-white dark:hover:bg-gray-700">
        {t('getBadge')}
      </button>
      <div className="w-full h-px bg-gray-300"></div>
      <p className="text-xl font-bold uppercase text-gray-800 dark:text-white">
        {t('userConfirmed', { name: user?.name })}
      </p>
      <p className="flex items-center space-x-3">
        <CheckIcon />
        <span>{t('emailAddress')}</span>
      </p>
    </div>
  );
};

export default ContentUser;
