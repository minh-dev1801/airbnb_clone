import { amenities, AmenityItem } from "@/lib/client/types/dataTypes";
import { useTranslations } from "next-intl";

export default function RoomAmenities() {
  const t = useTranslations("RoomDetail");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">{t("amenities.title")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {amenities.map((amenity, index) => (
          <Amenity
            key={index}
            Icon={amenity.Icon}
            label={t(`amenities.items.${amenity.label}`)}
          />
        ))}
      </div>
      <button className="w-56 text-black bg-white border-2 border-black rounded-lg p-3 hover:bg-rose-100 duration-300 hover:text-rose-600 hover:border-transparent cursor-pointer dark:bg-rose-600  dark:hover:bg-rose-700 dark:text-white dark:border-none">
        {t("amenities.hideButton")}
      </button>
    </div>
  );
}

function Amenity({ Icon, label }: AmenityItem) {
  return (
    <div className="space-x-3">
      <Icon className="w-5 h-5 inline" />
      <span>{label}</span>
    </div>
  );
}
