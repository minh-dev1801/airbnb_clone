// file: components/ListRoom.tsx
"use client";

import dynamic from "next/dynamic";
import { formatISOToDDMMYYYY } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/client/store/store";
import "@/lib/client/assests/swiper-custom.css";
import RoomCard from "./RoomCard";
import { useTranslations } from "next-intl";
import useApi from "@/lib/client/services/useAPI";
import { getRoomsByPosition } from "@/lib/client/services/apiService";
import { SkeletonCard } from "../common/SkeletonCard";
import { useEffect } from "react";
import { setRooms } from "@/lib/client/store/slices/roomSlice";
import EmptyState from "../common/EmptyState";

const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function ListRoom({ location }: { location: string }) {
  const t = useTranslations("ListRoom");
  const tInfo = useTranslations("Info");
  const dispatch = useDispatch();

  const searchData = useSelector((state: RootState) => state.search);
  const positions = useSelector((state: RootState) => state.position);
  const position = positions.find((pos) => pos.slug === location);

  const key = position?.id
    ? `/api/phong-thue/lay-phong-theo-vi-tri/${position.id}`
    : "";

  const fetcher = () => getRoomsByPosition(position?.id.toString() ?? "");

  const { data, error, isLoading } = useApi(key.toString(), fetcher);

  const rooms = useSelector((state: RootState) => state.room.rooms);

  useEffect(() => {
    if (data) {
      dispatch(setRooms(data));
    }
  }, [data, dispatch]);

  if (error) {
    return <EmptyState title={tInfo("no_room")} />;
  }

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 md:gap-3 relative"
      role="main"
    >
      {isLoading ? (
        <div className="space-y-4" aria-busy="true" aria-live="polite">
          <SkeletonCard
            height="h-10"
            shape="rounded-lg"
            layout="vertical"
            count={2}
          />
          <SkeletonCard layout="vertical" count={5} />
        </div>
      ) : (
        <div
          className="md:py-12 space-y-3"
          aria-label={t("accommodation_list")}
          role="region"
        >
          <p aria-live="polite">
            {t("found_accommodations", {
              count: rooms.length,
              location: position?.tinhThanh ?? "",
            })}{" "}
            • {formatISOToDDMMYYYY(searchData.checkIn)} –{" "}
            {formatISOToDDMMYYYY(searchData.checkOut)}
          </p>
          <h1 className="font-bold text-xl md:text-3xl text-black dark:text-white">
            {t("stays_in_selected_map_area")}
          </h1>
          <div className="space-y-6">
            {rooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                position={position}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
      <div
        className="mb-8 lg:mb-0 lg:h-screen lg:w-[470px] xl:w-xl w-[444px] md:w-[730px] lg:sticky lg:top-0 lg:right-0 lg:mt-32"
        role="complementary"
        aria-label={t("map_area")}
      >
        <DynamicMap position={position} />
      </div>
    </div>
  );
}
