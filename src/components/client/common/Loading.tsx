'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <div className="bg-transparent flex flex-col items-center justify-center w-full h-full">
      <DotLottieReact
        src="/lottie/loading.lottie"
        loop
        autoplay
        style={{ height: 200 }}
      />
    </div>
  );
}
  