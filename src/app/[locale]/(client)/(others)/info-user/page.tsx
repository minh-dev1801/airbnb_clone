'use client';

import AvatarUser from '@/components/info-user/AvatarUser';
import RoomUser from '@/components/info-user/RoomUser';
import HeaderRoom from '@/components/info-user/HeaderRoom';
import ContentUser from '@/components/info-user/ContentUser';

export default function InfoUserPage() {
  return (
    <div className="max-w-md px-4 md:container mx-auto mt-8 md:mt-0 mb-2 lg:mb-10">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="xl:w-[30%] lg:w-[40%] p-4 rounded-lg shadow-lg h-[540px] lg:h-[580px] block lg:sticky lg:top-20 dark:bg-gray-800">
          <div className="flex flex-col gap-4">
            <AvatarUser />

            <ContentUser />
          </div>
        </div>

        <div className="lg:w-[60%] mt-10 px-0 lg:p-4 rounded-lg">
          <HeaderRoom />

          <RoomUser />
        </div>
      </div>
    </div>
  );
}
