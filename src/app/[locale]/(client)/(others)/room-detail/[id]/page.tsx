'use client';

import {
  getCommentsById,
  getRoomsById,
} from '@/lib/client/services/apiService';
import { sortCommentsByIdDescending } from '@/lib/utils';
import CommentsSection from '@/components/client/rooms/CommentsSection';
import RoomHeader from '@/components/client/room-detail/RoomHeader';
import RoomDetails from '@/components/client/room-detail/RoomDetails';
import BookingForm from '@/components/client/room-detail/BookingForm';
import RoomAmenities from '@/components/client/room-detail/RoomAmenities';
import CommentForm from '@/components/client/room-detail/CommentForm';
import RoomImage from '@/components/client/room-detail/RoomImage';
import useApi from '@/lib/client/services/useAPI';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/client/common/EmptyState';
import { useMemo } from 'react';

const LoadingSkeleton = () => (
  <div className="max-w-md md:container mx-auto py-5 space-y-5">
    <Skeleton className="sm:h-[120px] h-[80px] w-full" />
    <Skeleton className="sm:h-[400px] h-[250px] w-full" />
    <div className="grid grid-cols-1 lg:flex lg:gap-0 justify-between gap-5">
      <Skeleton className="sm:h-[300px] h-[200px] basis-7/12" />
      <Skeleton className="sm:h-[400px] h-[300px] basis-4/12" />
    </div>
    <Skeleton className="sm:h-[200px] h-[150px] w-full" />
    <Skeleton className="sm:h-[150px] h-[100px] w-full" />
    <Skeleton className="sm:h-[400px] h-[300px] w-full" />
  </div>
);

export default function RoomDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const keyRoom = id ? `/room/${id}` : '';
  const keyComments = id ? `comments/${id}` : '';

  const {
    data: room,
    error: roomError,
    isLoading: roomLoading,
  } = useApi(keyRoom, () => getRoomsById(id));

  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
  } = useApi(keyComments, () => getCommentsById(id));

  const sortedComments = useMemo(
    () => sortCommentsByIdDescending(comments || []),
    [comments]
  );

  if (roomLoading || commentsLoading) {
    return <LoadingSkeleton />;
  }

  if (roomError || !room) {
    return <EmptyState title="Không tìm thấy phòng" />;
  }

  return (
    <div className="max-w-md md:container mx-auto py-5 space-y-5">
      <RoomHeader room={room} />

      <RoomImage roomImage={room.hinhAnh} />

      <div className="grid grid-cols-1 lg:flex lg:gap-0 justify-between gap-5">
        <div className="basis-7/12 space-y-5">
          <RoomDetails />
        </div>

        <div className="basis-4/12">
          <BookingForm room={room} comments={sortedComments} />
        </div>
      </div>

      <RoomAmenities />

      <div className="pb-[30px]"></div>
      <div className="mb-5 w-full h-px bg-gray-300"></div>

      <CommentForm id={room.id} />

      <div className="mb-5 w-full h-px bg-gray-300"></div>

      {commentsError || !comments ? (
        <EmptyState title="Không tìm thấy bình luận" />
      ) : (
        <CommentsSection comments={sortedComments} />
      )}
    </div>
  );
}
