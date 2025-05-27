import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { isValidUrl } from "@/lib/utils";
import Image from "next/image";
import "@/lib/client/assests/swiper-custom.css";
import { useTranslations } from "next-intl";

export default function RoomImage({ roomImage }: { roomImage: string }) {
  const t = useTranslations("RoomDetail");
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        navigation
        className="rounded-xl w-full md:h-[70vh] h-[50vh]"
      >
        {[1, 2, 3, 4, 5].map((_, index: number) => (
          <SwiperSlide key={index}>
            <Image
              src={isValidUrl(roomImage) ? roomImage : "/placeholder.svg"}
              alt={t("roomImageAlt", { index: index + 1 })}
              className="object-cover"
              fill
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
