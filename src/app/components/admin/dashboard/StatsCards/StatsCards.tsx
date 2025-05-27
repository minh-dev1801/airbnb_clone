import React, { useMemo, useCallback } from "react";
import { Dropdown } from "antd";

interface Stats {
  recentBookings: number;
  roomsBooked: number;
  recentCheckIns: number;
  recentCheckOuts: number;
}

interface TimeRanges {
  bookings: number;
  rooms: number;
  checkIns: number;
  checkOuts: number;
}

interface StatsCardsProps {
  stats: Stats;
  timeRanges: TimeRanges;
  setTimeRanges: React.Dispatch<React.SetStateAction<TimeRanges>>;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  timeRanges,
  setTimeRanges,
}) => {
  const getMenu = useCallback(
    (key: keyof TimeRanges) => ({
      items: [1, 2, 3].map((month) => ({
        key: month.toString(),
        label: `Last ${month} month${month > 1 ? "s" : ""}`,
        className:
          timeRanges[key] === month
            ? "text-blue-600 font-semibold bg-blue-100"
            : "text-gray-700",
      })),
      onClick: ({ key }: { key: string }) => {
        setTimeRanges((prev) => ({
          ...prev,
          [key]: Number(key),
        }));
      },
    }),
    [setTimeRanges, timeRanges]
  );

  const cardItems = useMemo(
    () => [
      {
        title: "New Bookings",
        key: "bookings",
        color: "text-blue-600",
        value: stats.recentBookings,
      },
      {
        title: "Rooms Booked",
        key: "rooms",
        color: "text-green-600",
        value: stats.roomsBooked,
      },
      {
        title: "Check In",
        key: "checkIns",
        color: "text-purple-600",
        value: stats.recentCheckIns,
      },
      {
        title: "Check Out",
        key: "checkOuts",
        color: "text-orange-600",
        value: stats.recentCheckOuts,
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cardItems.map((item) => (
        <div key={item.key} className="bg-white p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">{item.title}</h2>
            <Dropdown menu={getMenu(item.key as keyof TimeRanges)} trigger={["click"]}>
              <div className="flex items-center gap-1 py-3 cursor-pointer">
                <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              </div>
            </Dropdown>
          </div>
          <p className={`text-3xl font-bold ${item.color}`}>{item.value.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            Last {timeRanges[item.key as keyof TimeRanges]} month
            {timeRanges[item.key as keyof TimeRanges] > 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default React.memo(StatsCards);