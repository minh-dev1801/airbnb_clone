'use client';

import AvatarUser from '@/components/info-user/AvatarUser';
import RoomUser from '@/components/info-user/RoomUser';
import HeaderRoom from '@/components/info-user/HeaderRoom';
import ContentUser from '@/components/info-user/ContentUser';

export default function InfoUserPage() {
  return (
    <div className="max-w-md px-4 md:container mx-auto mt-8 md:mt-0 mb-10">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="xl:w-[30%] lg:w-[40%] p-4 rounded-lg shadow h-[580px] block lg:sticky lg:top-20 dark:bg-gray-800">
          <div className="flex flex-col gap-4">
            <AvatarUser />

            <ContentUser />
          </div>
        </div>

        <div className="xl:w-[60%] lg:w-[60%] p-4 rounded-lg shadow">
          <HeaderRoom />

          <RoomUser />
        </div>
      </div>
    </div>
  );
}
