'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/client/store/store';
import useApi from '@/lib/client/services/useAPI';
import {
  getRoomsByUserId,
  getRoomsById,
} from '@/lib/client/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '../client/common/EmptyState';
import RoomCard from '../client/rooms/RoomCard';
import { Room, Booking } from '@/lib/client/types/types';
import useSWR from 'swr';

interface RoomWithBooking extends Room {
  booking: Booking;
}

function useRoomDetails(bookings: Booking[] | undefined) {
  const roomIds = bookings?.map((b) => b.maPhong) ?? [];

  const {
    data: rooms,
    error,
    isLoading,
  } = useSWR<Room[]>(
    roomIds.length > 0 ? ['/api/phong-thue', roomIds] : null,
    async () => {
      const roomPromises = roomIds.map((id) => getRoomsById(id.toString()));
      return Promise.all(roomPromises);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const roomMap =
    rooms?.reduce((acc, room, index) => {
      acc[roomIds[index]] = room;
      return acc;
    }, {} as Record<number, Room>) ?? {};

  return {
    roomDetails: roomMap,
    error,
    isLoading,
  };
}

export default function RoomUser() {
  const user = useSelector((state: RootState) => state.user);

  const {
    data: bookings,
    error: errorBookings,
    isLoading: isLoadingBookings,
  } = useApi<Booking[]>(
    `/api/dat-phong/lay-theo-nguoi-dung/${user?.id}`,
    async () => {
      const response = await getRoomsByUserId(user?.id?.toString() ?? '');
      return response as unknown as Booking[];
    }
  );

  const {
    roomDetails,
    error: errorRooms,
    isLoading: isLoadingRooms,
  } = useRoomDetails(bookings);

  const isLoading = isLoadingBookings || isLoadingRooms;
  const hasError = errorBookings || errorRooms;

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;
  if (hasError)
    return (
      <EmptyState title="Không có phòng đã thuê hoặc lỗi khi tải dữ liệu" />
    );
  if (!bookings?.length) return <EmptyState title="Không có phòng đã thuê" />;

  return (
    <div className="space-y-6">
      {bookings.map((booking, index) => {
        const room = roomDetails[booking.maPhong];
        if (!room) return null;
        const roomWithBooking: RoomWithBooking = { ...room, booking };
        return (
          <RoomCard key={booking.id} room={roomWithBooking} index={index} />
        );
      })}
    </div>
  );
}
