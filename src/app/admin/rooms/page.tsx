'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Table, message, Button, Spin } from 'antd';
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
      console.log('Fetched rooms:', response);
      return response;
    },
    staleTime: 1000 * 60 * 10,
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, updatedRoom }: { id: number; updatedRoom: Room }) => {
      console.log('Calling PUT /phong-thue with:', { id, updatedRoom });
      return http.put<Room>(`/phong-thue/${id}`, updatedRoom);
    },
    onSuccess: (data) => {
      console.log('Update room success:', data);
      queryClient.invalidateQueries({ queryKey: ['rooms', page] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room updated successfully');
      setIsEditModalOpen(false);
      setCurrentRoom(null);
    },
    onError: (error: any) => {
      console.error('Update room error:', error?.response?.data || error);
      message.error(error?.response?.data?.message || 'Failed to update room');
    },
  });

  const addRoomMutation = useMutation({
    mutationFn: async (newRoom: Omit<Room, 'id'>) => {
      try {
        console.log('Calling POST /phong-thue with payload:', newRoom);
        const response = await http.post<Room>('/phong-thue', newRoom);
        console.log('POST /phong-thue response:', response);
        return response;
      } catch (error: any) {
        console.error('Raw error in POST /phong-thue:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Add room success:', data);
      queryClient.invalidateQueries({ queryKey: ['rooms', page] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room created successfully');
      setIsAddModalOpen(false);
      setCurrentRoom(null);
    },
    onError: (error: any) => {
      const errorDetails = {
        message:
          error?.response?.data?.message || error?.message || 'Unknown error',
        status: error?.response?.status,
        data: error?.response?.data,
        errorObject: error,
      };
      console.error('Add room error details:', errorDetails);
      message.error(errorDetails.message || 'Failed to create room');
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: number) => {
      console.log('Calling DELETE /phong-thue:', id);
      return http.delete(`/phong-thue/${id}`);
    },
    onSuccess: () => {
      console.log('Delete room success');
      queryClient.invalidateQueries({ queryKey: ['rooms', page] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room deleted successfully');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete room error:', error?.response?.data || error);
      message.error(error?.response?.data?.message || 'Failed to delete room');
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
      console.log('handleFormSubmit called with:', values);
      if (currentRoom?.id && currentRoom.id !== 0) {
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
      <div className="p-4 flex justify-center items-center h-[calc(100vh-200px)]">
        <Spin size="large" />
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
        pagination={{
          current: page,
          pageSize: 5,
          onChange: (newPage) => setPage(newPage),
        }}
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
