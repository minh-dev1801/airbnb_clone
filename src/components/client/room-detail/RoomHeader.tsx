import { Room } from "@/lib/client/types/types";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/client/store/store";
import { useTranslations } from "next-intl";

export default function RoomHeader({ room }: { room: Room }) {
  const positions = useSelector((state: RootState) => state.position);
  const positionDetail = positions.find((position) => position.id === room.id);
  const t = useTranslations("RoomDetail");

  return (
    <>
      <h2 className="font-bold text-xl sm:text-3xl pt-4 ">{room.tenPhong}</h2>

      <div className="grid grid-cols-1 gap-5 items-center justify-start md:flex">
        <div className="grid md:flex gap-x-6 gap-y-3">
          <div className="flex gap-x-5">
            <div className="flex gap-x-6">
              <span className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-[#FF5A5F]" />
                <span className="text-gray-600 dark:text-white">
                  {t("superhost")}
                </span>
              </span>
            </div>
            <span className="dark:text-white text-gray-600 hover:text-[#FF5A5F] duration-300">
              {positionDetail?.tinhThanh}, {positionDetail?.quocGia}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
