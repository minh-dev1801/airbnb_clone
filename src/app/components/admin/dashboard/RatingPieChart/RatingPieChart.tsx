"use client";

import React, { useMemo } from "react";
import { Dropdown } from "antd";
import { ResponsivePie } from "@nivo/pie";
import dayjs from "dayjs";

interface Comment {
  id: number;
  ngayBinhLuan: string;
  saoBinhLuan: number;
}

interface RatingPieChartProps {
  comments: Comment[];
  commentTimeRange: number;
  setCommentTimeRange: React.Dispatch<React.SetStateAction<number>>;
}

const RatingPieChart: React.FC<RatingPieChartProps> = ({
  comments,
  commentTimeRange,
  setCommentTimeRange,
}) => {
  const getCommentMenu = useMemo(
    () => ({
      items: [1, 2, 3].map((month) => ({
        key: month.toString(),
        label: `Last ${month} month${month > 1 ? "s" : ""}`,
        className:
          commentTimeRange === month
            ? "text-blue-600 font-semibold bg-blue-100"
            : "text-gray-700",
      })),
      onClick: ({ key }: { key: string }) => setCommentTimeRange(Number(key)),
    }),
    [commentTimeRange, setCommentTimeRange]
  );

  const getNivoPieData = useMemo(() => {
    const now = dayjs();
    const monthsAgo = now.subtract(commentTimeRange, "month").startOf("day");

    const filteredComments = comments.filter((c) => dayjs(c.ngayBinhLuan).isAfter(monthsAgo));

    const ratingCounts = [0, 0, 0, 0, 0];
    filteredComments.forEach((c) => {
      if (c.saoBinhLuan >= 1 && c.saoBinhLuan <= 5) {
        ratingCounts[c.saoBinhLuan - 1]++;
      }
    });

    const colors = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6"];

    return ratingCounts.map((count, index) => ({
      id: `${index + 1} Star`,
      label: `${index + 1} Star`,
      value: count,
      color: colors[index],
    }));
  }, [comments, commentTimeRange]);

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Rating Distribution</h2>
        <Dropdown menu={getCommentMenu} trigger={["click"]}>
          <div className="flex items-center gap-1 py-3 cursor-pointer">
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
          </div>
        </Dropdown>
      </div>
      {comments.length > 0 && getNivoPieData.some((d) => d.value > 0) ? (
        <div className="h-96">
          <div className="w-full h-full">
            <ResponsivePie
              data={getNivoPieData}
              margin={{ top: 40, right: 80, bottom: 80, left: 0 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ datum: "data.color" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            />
          </div>
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-500">No review data available</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(RatingPieChart);