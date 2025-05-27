'use client';

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
      <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
        <DotLottieReact
          src="/lottie/loading.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};