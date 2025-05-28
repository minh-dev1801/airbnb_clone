'use client';

import { useCallback, useMemo } from 'react';

import useApi from '@/lib/client/services/useAPI';
import { fetchPosition, getRoomsById } from '@/lib/client/services/apiService';
import { mapPositionWithSlug } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Room } from '@/lib/client/types/types';

const Check = ({ slug }: { slug: string }) => {
  const isNumericSlug = useMemo(() => !isNaN(Number(slug)), [slug]);
  const t = useTranslations('InfoUser');

  const { data: positionData, error: positionsError } = useApi(
    '/api/vi-tri',
    () => fetchPosition()
  );

  const positions = useMemo(() => {
    return positionData ? mapPositionWithSlug(positionData) : [];
  }, [positionData]);

  const keyRoom = isNumericSlug ? `/api/rooms/${slug}` : '';

  const fnGetRoom = useCallback(() => {
    if (isNumericSlug) {
      return getRoomsById(slug);
    }
  }, [isNumericSlug, slug]);

  const { data: room, error: roomError } = useApi(
    keyRoom,
    fnGetRoom as () => Promise<Room>
  );

  const content = useMemo(() => {
    if (isNumericSlug) return room?.tenPhong;

    return (
      positions.find((p) => p.slug.includes(slug))?.tinhThanh || 'Hồ Chí Minh'
    );
  }, [positions, slug, room, isNumericSlug]);

  if (positionsError || roomError) {
    return t('no_data');
  }

  return <div>{content}</div>;
};

export default Check;
