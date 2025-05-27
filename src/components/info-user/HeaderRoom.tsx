'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/client/store/store';
import UpdateUser from './UpdateUser';
import { useTranslations } from 'next-intl';

const HeaderRoom = () => {
  const user = useSelector((state: RootState) => state.user);
  const t = useTranslations('InfoUser');

  return (
    <>
      <p className="font-bold text-xl">
        {t('greeting', { name: user?.name })}
      </p>
      <p className="text-gray-500 text-sm dark:text-gray-400">
        {t('joinedSince', { year: new Date().getFullYear() })}
      </p>
      <UpdateUser />

      <h1 className="font-bold text-2xl mt-6 mb-4">{t('rentedRooms')}</h1>
    </>
  );
};

export default HeaderRoom;
