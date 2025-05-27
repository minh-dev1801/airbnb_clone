'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Table, message, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/app/lib/client/apiAdmin';
import SearchBar from '@/app/components/admin/searchbar/SearchBar';
import DeleteRoomModal from '@/app/components/admin/room/DeleteRoomModal/DeleteRoomModal';
import { getRoomTableColumns } from '@/app/components/admin/room/RoomTableColumns/RoomTableColumns';
import RoomFormModal from '@/app/components/admin/room/RoomFormModal/RoomFormModal';
import { Room } from '@/app/types/room/room';

const RoomPage = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms', page],
    queryFn: async () => {
      const response = await http.get<Room[]>(
        `/phong-thue?pageIndex=${page}&pageSize=50`
      );
      return response;
    },
    staleTime: 1000 * 60 * 10,
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, updatedRoom }: { id: number; updatedRoom: Room }) =>
      http.put(`/phong-thue/${id}`, updatedRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room updated successfully');
      setIsEditModalOpen(false);
      setCurrentRoom(null);
    },
    onError: (error: any) => {},
  });

  const addRoomMutation = useMutation({
    mutationFn: (newRoom: Omit<Room, 'id'>) =>
      http.post(`/phong-thue`, newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room created successfully');
      setIsAddModalOpen(false);
      setCurrentRoom(null);
    },
    onError: (error: any) => {},
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/phong-thue/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room deleted successfully');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    },
    onError: (error: any) => {
      console.log('Delete room error:', error.response?.data);
    },
  });

  const filteredRooms = useMemo(() => {
    if (!searchText) return rooms;
    const searchValue = searchText.trim().toLowerCase();
    return rooms.filter(
      (room) =>
        room.id.toString().includes(searchValue) ||
        room.tenPhong.toLowerCase().includes(searchValue)
    );
  }, [rooms, searchText]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleEdit = useCallback((room: Room) => {
    setCurrentRoom(room);
    setIsEditModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setCurrentRoom({
      id: 0,
      tenPhong: '',
      khach: 1,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      giaTien: 0,
      moTa: '',
      hinhAnh: '',
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
      maViTri: 0,
    });
    setIsAddModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (roomId: number) => {
      const room = rooms.find((r) => r.id === roomId) || null;
      setRoomToDelete(room);
      setIsDeleteModalOpen(true);
    },
    [rooms]
  );

  const handleConfirmDelete = useCallback(
    (roomId: number) => {
      deleteRoomMutation.mutate(roomId);
    },
    [deleteRoomMutation]
  );

  const handleFormSubmit = useCallback(
    (values: Room) => {
      if (currentRoom?.id) {
        updateRoomMutation.mutate({ id: currentRoom.id, updatedRoom: values });
      } else {
        const { id, ...newRoom } = values;
        addRoomMutation.mutate(newRoom);
      }
    },
    [currentRoom, updateRoomMutation, addRoomMutation]
  );

  const columns = useMemo(
    () => getRoomTableColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="flex justify-end items-center space-x-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center py-2 border-b border-gray-200"
              >
                <div className="w-[150px] h-[100px] bg-gray-200 rounded-lg mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
        <div className="flex justify-end items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAdd}
            style={{
              backgroundColor: '#fe6b6e',
              borderColor: '#fe6b6e',
              fontSize: '16px',
              padding: '20px',
            }}
          >
            Add Room
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
        rowClassName={() => 'hover:bg-gray-50'}
      />
      <RoomFormModal
        isOpen={isEditModalOpen || isAddModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsAddModalOpen(false);
          setCurrentRoom(null);
        }}
        currentRoom={currentRoom}
        onSubmit={handleFormSubmit}
        isSubmitting={updateRoomMutation.isPending || addRoomMutation.isPending}
      />
      <DeleteRoomModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoomToDelete(null);
        }}
        room={roomToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteRoomMutation.isPending}
      />
    </div>
  );
};

export default RoomPage;
