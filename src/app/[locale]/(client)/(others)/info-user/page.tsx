'use client';

import AvatarUser from '@/components/info-user/AvatarUser';
import RoomUser from '@/components/info-user/RoomUser';
import HeaderRoom from '@/components/info-user/HeaderRoom';
import ContentUser from '@/components/info-user/ContentUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InfoUserPage() {
  const [userId, setUserId] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id || '');
        setAvatar(parsedUser.avatar || '');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        router.push('/');
        return;
      }
    }
  }, [router]);

  return (
    <div className="max-w-md px-4 md:container mx-auto mt-8 md:mt-0 mb-10">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="xl:w-[30%] lg:w-[40%] p-4 rounded-lg shadow h-[580px] block lg:sticky lg:top-20 dark:bg-gray-800">
          <div className="flex flex-col gap-4">
            <AvatarUser avatar={avatar} />

            <ContentUser />
          </div>
        </div>

        <div className="xl:w-[60%] lg:w-[60%] p-4 rounded-lg shadow">
          <HeaderRoom />

          {userId && <RoomUser userId={userId} />}
        </div>
      </div>
    </div>
  );
}
