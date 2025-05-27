import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Heart } from 'lucide-react';
import { Room, Position } from '@/lib/client/types/types';
import { convertUSDToVND, isValidUrl } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';

export default function RoomCard({ room, position, index }: { room: Room; position?: Position; index: number }) {
  const t = useTranslations('RoomCard');
  const locale = useLocale();

  const getDeviceList = () => {
    const list: string[] = [];
    if (room.mayGiat) list.push(t('washing_machine'));
    if (room.banLa) list.push(t('iron_board'));
    if (room.tivi) list.push(t('tv'));
    if (room.dieuHoa) list.push(t('air_conditioner'));
    if (room.wifi) list.push(t('wifi'));
    if (room.bep) list.push(t('kitchen'));
    if (room.doXe) list.push(t('parking'));
    if (room.banUi) list.push(t('ironing_board'));
    return list.join(' • ');
  };

  return (
    <Link href={`/room-detail/${room.id}`} data-aos="zoom-out" data-aos-duration="500" data-aos-delay={index * 30}>
      <Card className="rounded-3xl hover:shadow-lg transition duration-300 mb-5 dark:bg-gray-800 dark:hover:bg-gray-700">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-3">
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-48 rounded-lg"
              >
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={isValidUrl(room.hinhAnh) ? room.hinhAnh : "/placeholder.svg"}
                      alt={room.tenPhong}
                      fill
                      className="object-cover"
                      style={{ objectPosition: '8px center' }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-3 left-3 z-30">
                <div className="rounded-xl px-3 py-2 bg-white/90 dark:bg-gray-800/90">{t('guest_favorite')}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-30 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
              >
                <Heart className='text-white !h-6 !w-6 fill-gray-500 ' />
              </Button>
            </div>
            <div>
              <p className="text-gray-500 text-sm truncate dark:text-white">{t('entire_apartment', { location: position?.tinhThanh ?? "Không có tỉnh thành" })}</p>
              <p className="truncate md:text-xl dark:text-white text-lg">{room.tenPhong}</p>
              <div className="w-[15%] bg-gray-300 h-[3px] rounded-lg md:my-2 my-4" />
              <p className="text-gray-500 text-sm truncate dark:text-white">
                {t('room_details', { guests: room.khach, bedrooms: room.phongNgu, beds: room.giuong, bathrooms: room.phongTam })}
              </p>
              <p className="text-gray-500 text-sm truncate dark:text-white">
                {getDeviceList()}
              </p>
              <div className="text-right md:mt-12 mt-3 text-sm">
                <span className="font-bold">{locale === 'vi' ? t('price', { price: convertUSDToVND(room.giaTien) }) : `$${room.giaTien}`}</span> / {t('night')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}