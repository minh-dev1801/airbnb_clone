"use client";

import React, { useState, useMemo } from "react";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/app/lib/client/apiAdmin";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const StatsCards = dynamic(() => import("@/app/components/admin/dashboard/StatsCards/StatsCards"), {
  ssr: false,
});
const RatingPieChart = dynamic(
  () => import("@/app/components/admin/dashboard/RatingPieChart/RatingPieChart"),
  { ssr: false }
);
const CheckInOutChart = dynamic(
  () => import("@/app/components/admin/dashboard/CheckInOutChart/CheckInOutChart"),
  { ssr: false }
);

type Booking = {
  ngayDen: string;
  ngayDi: string;
  maPhong: number;
};

type UserComment = {
  id: number;
  ngayBinhLuan: string;
  saoBinhLuan: number;
};

type TimeRanges = {
  bookings: number;
  rooms: number;
  checkIns: number;
  checkOuts: number;
};

type MockDataType = {
  [year: string]: {
    checkIns: number[];
    checkOuts: number[];
  };
};

const Dashboard: React.FC = () => {
  const [timeRanges, setTimeRanges] = useState<TimeRanges>({
    bookings: 2,
    rooms: 2,
    checkIns: 2,
    checkOuts: 2,
  });

  const [commentTimeRange, setCommentTimeRange] = useState<number>(2);
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());

  const { data: bookings = [], isLoading: loadingBookings } = useQuery<Booking[]>({
    queryKey: ["bookings", 1],
    queryFn: () => http.get("/dat-phong?page=1&limit=50"),
    staleTime: 1000 * 60 * 10, // 10 phút
  });

  const { data: comments = [], isLoading: loadingComments } = useQuery<UserComment[]>({
    queryKey: ["comments", 1],
    queryFn: () => http.get("/binh-luan?page=1&limit=50"),
    staleTime: 1000 * 60 * 10, // 10 phút
  });

  const loading = loadingBookings || loadingComments;

  const calculateStat = useMemo(() => {
    return (months: number, key: keyof TimeRanges, bookings: Booking[]): number => {
      const now = dayjs();
      const monthsAgo = now.subtract(months, "month").startOf("day");

      if (key === "bookings") {
        return bookings.filter(
          (b) => dayjs(b.ngayDen).isAfter(monthsAgo) || dayjs(b.ngayDi).isAfter(monthsAgo)
        ).length;
      }

      if (key === "rooms") {
        const rooms = bookings
          .filter((b) => dayjs(b.ngayDen).isAfter(monthsAgo) || dayjs(b.ngayDi).isAfter(monthsAgo))
          .map((b) => b.maPhong);
        return new Set(rooms).size;
      }

      if (key === "checkIns") {
        return bookings.filter((b) => dayjs(b.ngayDen).isAfter(monthsAgo)).length;
      }

      if (key === "checkOuts") {
        return bookings.filter((b) => dayjs(b.ngayDi).isAfter(monthsAgo)).length;
      }

      return 0;
    };
  }, []);

  const stats = useMemo(
    () => ({
      recentBookings: calculateStat(timeRanges.bookings, "bookings", bookings),
      roomsBooked: calculateStat(timeRanges.rooms, "rooms", bookings),
      recentCheckIns: calculateStat(timeRanges.checkIns, "checkIns", bookings),
      recentCheckOuts: calculateStat(timeRanges.checkOuts, "checkOuts", bookings),
    }),
    [timeRanges, bookings, calculateStat]
  );

  const mockData: MockDataType = {
    "2023": {
      checkIns: [50, 60, 70, 80, 90, 120, 150, 140, 100, 90, 80, 110],
      checkOuts: [45, 55, 65, 75, 85, 115, 145, 135, 95, 85, 75, 105],
    },
    "2024": {
      checkIns: [60, 70, 80, 90, 100, 130, 160, 150, 110, 100, 90, 120],
      checkOuts: [55, 65, 75, 85, 95, 125, 155, 145, 105, 95, 85, 115],
    },
    "2025": {
      checkIns: [70, 80, 90, 100, 110, 140, 170, 160, 120, 110, 100, 130],
      checkOuts: [65, 75, 85, 95, 105, 135, 165, 155, 115, 105, 95, 125],
    },
  };

  const getAvailableYears = useMemo(
    () => () => Object.keys(mockData).map(Number).sort((a, b) => b - a),
    []
  );

  const getCheckInOutData = useMemo(
    () => () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const data = mockData[selectedYear.toString()] || {
        checkIns: Array(12).fill(0),
        checkOuts: Array(12).fill(0),
      };

      return {
        series: [
          { name: "Check-ins", data: data.checkIns },
          { name: "Check-outs", data: data.checkOuts },
        ],
        categories: months,
      };
    },
    [selectedYear]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spin />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen ">
      <StatsCards stats={stats} timeRanges={timeRanges} setTimeRanges={setTimeRanges} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RatingPieChart
          comments={comments}
          commentTimeRange={commentTimeRange}
          setCommentTimeRange={setCommentTimeRange}
        />
        <CheckInOutChart
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          getCheckInOutData={getCheckInOutData}
          getAvailableYears={getAvailableYears}
        />
      </div>

    </div>
  );
};

export default Dashboard;