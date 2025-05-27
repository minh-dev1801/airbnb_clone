'use client';

import L from 'leaflet';
import { PositionWithSlug } from '@/lib/client/types/types';
import { getCoordinatesByCity } from '@/lib/client/services/apiService';
import useApi from '@/lib/client/services/useAPI';
import { useRef, useEffect } from 'react';
import { SkeletonCard } from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';
import { useTranslations } from 'next-intl';

const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

export default function Map({ position }: { position?: PositionWithSlug }) {
  const key = position?.id ? `/map/${position.id}` : "";
  const tInfo = useTranslations('Info');

  const { data, isLoading, error } = useApi(key, () => getCoordinatesByCity(position?.tinhThanh ?? ""), {
    translate: tInfo,
  });

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current && containerRef.current && data) {
      mapRef.current = L.map(containerRef.current, {
        center: [data.latitude, data.longitude],
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      L.marker([data.latitude, data.longitude], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`${position?.tinhThanh ?? "Không có tỉnh thành"}, ${position?.quocGia ?? "Không có quốc gia"}`);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data, position]);

  if (isLoading) {
    return (
      <SkeletonCard
        height="h-[80vh]"
      />
    );
  }

  if (error) {
    return <EmptyState title={tInfo('no_map')} />
  }

  return (
    <div
      ref={containerRef}
      className="h-[80vh] rounded-2xl z-10"
      data-aos="flip-up"
      data-aos-duration="500"
    />
  );
}
