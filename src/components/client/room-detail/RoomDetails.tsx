import { Star, Wifi, Tv, ParkingSquare } from 'lucide-react';
import { MdIron } from 'react-icons/md';
import { FaLanguage } from 'react-icons/fa';
import Image from 'next/image';
import { IconComponent } from '@/lib/client/types/dataTypes';
import { useTranslations } from 'next-intl';
import { showSuccessToast } from '@/lib/client/services/notificationService';
import { Button } from '@/components/ui/button';

type FeatureProps = {
  Icon: IconComponent;
  title: string;
  description?: string;
  hasMoreButton?: boolean;
};

export default function RoomDetails() {
  const t = useTranslations('RoomDetail');
  const tValidation = useTranslations('ValidationErrors');

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold">
            {t('entireApartment')}{' '}
            <span className="underline uppercase">nnhatsang</span>
          </h3>
          <p className="text-md sm:text-base">
            {t('roomSummary', { guests: 3 })}
          </p>
        </div>
        <div className="relative">
          <Image
            className="w-12 h-12 rounded-full object-cover"
            alt={t('hostProfileAlt')}
            width={48}
            height={48}
            src="https://avatars.githubusercontent.com/u/93591100?v=4"
          />
          <div className="absolute top-7 left-7">
            <Star className="w-6 h-6 block fill-current text-rose-600" />
          </div>
        </div>
      </div>

      <div className="mb-5 w-full h-px bg-gray-300"></div>

      <div className="space-y-5">
        <Feature
          Icon={Wifi}
          title={t('features.entirePlace.title')}
          description={t('features.entirePlace.description')}
        />
        <Feature
          Icon={Tv}
          title={t('features.enhancedCleaning.title')}
          description={t('features.enhancedCleaning.description')}
          hasMoreButton={true}
        />
        <Feature
          Icon={ParkingSquare}
          title={t('features.superhost.title')}
          description={t('features.superhost.description')}
        />
        <Feature Icon={MdIron} title={t('features.freeCancellation.title')} />
      </div>

      <div className="mb-5 w-full h-px bg-gray-300"></div>

      <div className="w-full">
        <Button
          variant="ghost"
          className="w-full h-14 text-black text-md bg-white border-2 border-black rounded-lg hover:bg-rose-100 hover:text-rose-600 duration-300 flex justify-between items-center cursor-pointer hover:border-transparent dark:bg-rose-600  dark:hover:bg-rose-700 dark:text-white dark:border-none"
          onClick={() => {
            showSuccessToast(tValidation('notSupported'));
          }}
        
        >
          <span>{t('translateToEnglish')}</span>
          <FaLanguage className="!w-12 !h-12" />
        </Button>
        <p className="text-justify py-3 text-md sm:text-base">
          {t('selfCheckIn')}
          <br />
          {t('selfCheckInDetails')}
          <br />
          {t('superhostName', { name: 'Dinh Long' })}
          <br />
          {t('superhostDescription')}
        </p>
        <span className="font-bold underline cursor-pointer">
          {t('showMore')}
        </span>
      </div>

      <div className="mb-5 w-full h-px bg-gray-300"></div>
    </>
  );
}

function Feature({
  Icon,
  title,
  description,
  hasMoreButton = false,
}: FeatureProps) {
  const t = useTranslations('RoomDetail');

  return (
    <div className="flex gap-5">
      <Icon className="w-6 h-6" />
      <div className="space-y-2">
        <h4 className="text-sm font-bold">{title}</h4>
        {description && (
          <p className="text-sm text-gray-600 text-justify dark:text-white">
            {description}
            {hasMoreButton && (
              <span className="underline font-bold cursor-pointer">
                {' '}
                {t('showMore')}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
