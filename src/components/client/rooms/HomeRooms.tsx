import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { listHomeRooms } from "@/lib/client/types/dataTypes";
import { useTranslations } from "next-intl";
import { getTranslatedItems } from "@/lib/utils";

export default function HomeRooms() {
  const t = useTranslations("HomeRooms");
  const translatedRooms = getTranslatedItems(listHomeRooms, t, "title");

  const sectionTitle = t("title");
  const discoverText = t("discover");

  return (
    <div
      className="max-w-md md:container mx-auto space-y-6 pt-8 pb-20"
      role="region"
      aria-labelledby="home-rooms-title"
    >
      <h1
        id="home-rooms-title"
        className="font-bold text-3xl text-gray-800 dark:text-gray-100"
      >
        {sectionTitle}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {translatedRooms.map((room) => (
          <Link
            key={room.href}
            href={room.href}
            className="group transition-transform duration-300 hover:scale-[1.02]"
            data-aos="flip-left"
            aria-label={`${room.title} – ${discoverText}`}
          >
            <Card className="w-full h-full overflow-hidden border bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200">
              <CardHeader className="p-0 relative">
                <div className="aspect-video overflow-hidden">
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={room.image}
                      alt={room.title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardHeader>

              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {room.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {discoverText}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
