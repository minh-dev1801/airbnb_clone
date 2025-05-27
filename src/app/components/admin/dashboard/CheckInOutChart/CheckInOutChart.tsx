"use client";

import React, { useMemo } from "react";
import { Dropdown } from "antd";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts").then((mod) => mod.default), {
  ssr: false,
});

interface CheckInOutChartProps {
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  getCheckInOutData: () => {
    series: { name: string; data: number[] }[];
    categories: string[];
  };
  getAvailableYears: () => number[];
}

const CheckInOutChart: React.FC<CheckInOutChartProps> = ({
  selectedYear,
  setSelectedYear,
  getCheckInOutData,
  getAvailableYears,
}) => {
  const chartData = useMemo(() => getCheckInOutData(), [getCheckInOutData]);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: { type: "area", height: 350, zoom: { enabled: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      colors: ["#3b82f6", "#f97316"],
      xaxis: { categories: chartData.categories, title: { text: "Month" } },
      yaxis: { title: { text: "Count" }, min: 0 },
      tooltip: { x: { format: "MMM" } },
      legend: { position: "top", horizontalAlign: "center" },
    }),
    [chartData.categories]
  );

  const yearMenu = useMemo(
    () => ({
      items: getAvailableYears().map((year) => ({
        key: year.toString(),
        label: year.toString(),
        className:
          selectedYear === year ? "text-blue-600 font-semibold bg-blue-100" : "text-gray-700",
      })),
      onClick: ({ key }: { key: string }) => setSelectedYear(Number(key)),
    }),
    [getAvailableYears, selectedYear, setSelectedYear]
  );

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Check In & Check Out</h2>
        <Dropdown menu={yearMenu} trigger={["click"]}>
          <div className="flex items-center gap-1 py-3 cursor-pointer">
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
          </div>
        </Dropdown>
      </div>
      <div className="h-96 flex justify-center">
        <div className="w-full h-full">
          <Chart options={chartOptions} series={chartData.series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CheckInOutChart);