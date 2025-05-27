import { getRoomsById } from '@/lib/client/services/apiService';
import { Booking, Room } from '@/lib/client/types/types';
import useSWR from 'swr';

export default function useRoomDetails(bookings: Booking[] | undefined) {
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
