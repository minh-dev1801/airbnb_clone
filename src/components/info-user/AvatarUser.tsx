'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToggle } from 'react-use';
import AvatarDialog from './dialogs/AvatarDialog';
import { useTranslations } from 'next-intl';
import { Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/client/store/store';
import { useEffect, useState } from 'react';

const AvatarUser = ({ avatar }: { avatar: string | null }) => {
  const userStore = useSelector((state: RootState) => state.user);
  const [currentAvatar, setCurrentAvatar] = useState(
    avatar || '/placeholder.svg'
  );
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showUpdateAvatarDialog, setShowUpdateAvatarDialog] = useToggle(false);
  const t = useTranslations('InfoUser');

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      const newAvatar = userStore.avatar || avatar || '/placeholder.svg';
      setCurrentAvatar(newAvatar === '' ? '/placeholder.svg' : newAvatar);
    }
  }, [userStore.avatar, avatar, isFirstRender]);

  const handleOpenDialog = () => {
    setShowUpdateAvatarDialog();
  };

  return (
    <div className="space-y-3">
      <div className="relative w-36 h-36 mx-auto">
        <Image
          className="object-cover rounded-full"
          alt={t('avatar')}
          src={currentAvatar}
          fill
          sizes="9rem"
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleOpenDialog}
          variant="link"
          className="underline font-bold text-sm text-gray-700 dark:text-white cursor-pointer hover:scale-105 transition-all duration-300 hover:text-rose-500 dark:hover:text-rose-500"
        >
          <Pencil />
          {t('updateAvatar')}
        </Button>
      </div>

      <AvatarDialog
        open={showUpdateAvatarDialog}
        onOpenChange={setShowUpdateAvatarDialog}
      />
    </div>
  );
};

export default AvatarUser;
