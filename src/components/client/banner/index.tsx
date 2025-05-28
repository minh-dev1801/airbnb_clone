'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useRef, RefObject, useCallback, useEffect } from 'react';
import { useDebounce, useIntersection } from 'react-use';

export default function Banner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isMountedRef = useRef(true);
  const intersection = useIntersection(
    videoRef as RefObject<HTMLVideoElement>,
    {
      threshold: 0.5,
    }
  );
  const { theme } = useTheme();
  const t = useTranslations('Banner');

  const handleVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isMountedRef.current) return;

    try {
      if (intersection?.isIntersecting && video.paused) {
        if (!isMountedRef.current) return;

        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }

        if (!isMountedRef.current) return;

        playPromiseRef.current = video.play();
        await playPromiseRef.current;
        playPromiseRef.current = null;
      } else if (!intersection?.isIntersecting && !video.paused) {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }

        if (isMountedRef.current && video) {
          video.pause();
        }
      }
    } catch (error) {
      console.error('Error in handleVideo:', error);
      playPromiseRef.current = null;
    }
  }, [intersection?.isIntersecting]);

  useDebounce(handleVideo, 200, [
    intersection?.isIntersecting,
    videoRef.current,
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    const video = videoRef.current;

    return () => {
      isMountedRef.current = false;

      if (video && !video.paused) {
        video.pause();
      }

      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[80vh]">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        poster="/bannerVideo.png"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/df8p9vvyu/video/upload/q_auto/v1747502548/u0ge9u9hwvrkczsezqg1.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 w-full h-full bg-black/70" />

      <div className="absolute inset-x-0 px-4 md:bottom-10 xl:bottom-20 max-w-screen-xl mx-auto h-full flex flex-col justify-center">
        <div className="flex items-center gap-2" data-aos="fade-up">
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14">
            <Image
              src="/airbnb-1.svg"
              alt="Airbnb logo"
              fill
              sizes="32px"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-custom-rose font-bold cursor-default">
            airbnb
          </h2>
        </div>
        <p
          className="text-white text-md md:text-2xl lg:text-3xl cursor-default"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {t('Belong anywhere')}
        </p>
      </div>

      <div className="absolute left-0 xl:left-[calc(50%-1920px/2)] bottom-0">
        <Image
          src={
            theme === 'dark'
              ? '/swoosh-hero-dark.png'
              : '/swoosh-hero-light.png'
          }
          alt="Decorative swoosh pattern for Vietnam travel experience"
          width={1920}
          height={600}
          className="object-cover"
        />
      </div>
    </div>
  );
}
