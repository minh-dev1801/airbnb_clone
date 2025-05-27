'use client';

import useApi from '@/lib/client/services/useAPI';
import { getRoomsByUserId } from '@/lib/client/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '../client/common/EmptyState';
import RoomCard from '../client/rooms/RoomCard';
import { Booking, RoomWithBooking } from '@/lib/client/types/types';
import useRoomDetails from '../client/hooks/useRoomDetails';

export default function RoomUser({ userId }: { userId: string }) {
  const {
    data: bookings,
    error: errorBookings,
    isLoading: isLoadingBookings,
  } = useApi<Booking[]>(
    `/api/dat-phong/lay-theo-nguoi-dung/${userId}`,
    async () => {
      const response = await getRoomsByUserId(userId);
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
