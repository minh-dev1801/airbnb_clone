"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Error() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-transparent">
      <DotLottieReact
        src="/lottie/error.lottie"
        loop
        autoplay
        style={{ height: 400, width: 400 }}
        onError={(error) => console.error("Lottie error:", error)}
      />
      <h1 className="text-2xl font-bold text-red-500 mt-4">Lỗi!</h1>
      <p className="text-lg text-gray-700 mb-4 dark:text-gray-300">Có lỗi xảy ra khi tải dữ liệu</p>
      <button
        className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
        onClick={() => window.location.reload()}
      >
        Thử lại
      </button>
    </div>
  );
};
