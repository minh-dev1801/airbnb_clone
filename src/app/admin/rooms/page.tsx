// File: RoomPage.tsx
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
      console.log('Fetched rooms:', response)
      return response;
    },
    staleTime: 1000 * 60 * 10,
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, updatedRoom }: { id: number; updatedRoom: Room }) => {
      // console.log('Updating room:', { id, updatedRoom }); // Bỏ comment nếu muốn debug
      return http.put(`/phong-thue/${id}`, updatedRoom);
    },
    onSuccess: (data) => {
      // console.log('Update success:', data); // Bỏ comment nếu muốn debug
      queryClient.invalidateQueries({ queryKey: ['rooms', page] }); // Invalidate page specific rooms
      queryClient.invalidateQueries({ queryKey: ['rooms'] }); // Invalidate general rooms query if any
      message.success('Room updated successfully');
      setIsEditModalOpen(false);
      setCurrentRoom(null);
    },
    onError: (error: any) => {
      // console.error('Update error:', error); // Bỏ comment nếu muốn debug
      message.error(error?.response?.data?.message || 'Failed to update room');
    },
  });

  const addRoomMutation = useMutation({
    mutationFn: (newRoom: Omit<Room, 'id'>) => {
      console.log('Adding room (payload to API):', newRoom); // Bỏ comment nếu muốn debug payload
      return http.post<Room>(`/phong-thue`, newRoom);
    },
    onSuccess: (data) => {
      console.log('Add success:', data);
      queryClient.invalidateQueries({ queryKey: ['rooms', page] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room created successfully');
      setIsAddModalOpen(false);
      setCurrentRoom(null); // Reset currentRoom after adding
    },
    onError: (error: any) => {
      console.error('Add error:', error); // Bỏ comment nếu muốn debug
      message.error(error?.response?.data?.message || 'Failed to create room');
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: number) => {
      // console.log('Deleting room:', id); // Bỏ comment nếu muốn debug
      return http.delete(`/phong-thue/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', page] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      message.success('Room deleted successfully');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    },
    onError: (error: any) => {
      // console.error('Delete error:', error); // Bỏ comment nếu muốn debug
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
      id: 0, // Sẽ được loại bỏ trước khi gửi POST, dùng để Formik nhận biết là thêm mới
      tenPhong: '', // Người dùng sẽ nhập
      khach: 0, // Đổi từ 1 thành 0 (theo ví dụ payload)
      phongNgu: 0, // Đổi từ 1 thành 0 (theo ví dụ payload)
      giuong: 0, // Đổi từ 1 thành 0 (theo ví dụ payload)
      phongTam: 0, // Đổi từ 1 thành 0 (theo ví dụ payload)
      moTa: '', // Người dùng sẽ nhập
      giaTien: 0, // Giữ nguyên (theo ví dụ payload)
      mayGiat: true, // Đổi từ false thành true (theo ví dụ payload)
      banLa: true, // Đổi từ false thành true (theo ví dụ payload)
      tivi: true, // Đổi từ false thành true (theo ví dụ payload)
      dieuHoa: true, // Đổi từ false thành true (theo ví dụ payload)
      wifi: true, // Đổi từ false thành true (theo ví dụ payload)
      bep: true, // Đổi từ false thành true (theo ví dụ payload)
      doXe: true, // Đổi từ false thành true (theo ví dụ payload)
      hoBoi: true, // Đổi từ false thành true (theo ví dụ payload)
      banUi: true, // Đổi từ false thành true (theo ví dụ payload)
      maViTri: 0, // Người dùng sẽ nhập, mặc định là 0 (theo ví dụ payload)
      hinhAnh: '', // Người dùng sẽ nhập hoặc upload
    });
    setIsAddModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (roomId: number) => {
      const room = rooms.find((r) => r.id === roomId) || null;
      setRoomToDelete(room);
      setIsDeleteModalOpen(true);
    },
    [rooms] // rooms là dependency ở đây để find hoạt động đúng khi rooms thay đổi
  );

  const handleConfirmDelete = useCallback(
    (roomId: number) => {
      deleteRoomMutation.mutate(roomId);
    },
    [deleteRoomMutation]
  );

  const handleFormSubmit = useCallback(
    (values: Room) => {
      // `values` ở đây là dữ liệu từ RoomFormModal đã bao gồm các tiện ích boolean
      // console.log('Form submitted with values from modal:', values); // Bỏ comment nếu muốn debug
      if (currentRoom && currentRoom.id !== 0) {
        // Sửa điều kiện để chắc chắn hơn khi edit
        updateRoomMutation.mutate({ id: currentRoom.id, updatedRoom: values });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...newRoom } = values; // Loại bỏ id (dù là 0) trước khi gửi POST
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
        <Spin size="large" tip="Loading rooms..." />
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
        loading={
          isLoading /* || updateRoomMutation.isPending || addRoomMutation.isPending */
        } // Có thể thêm các trạng thái loading của mutation
        pagination={{
          current: page,
          pageSize: 5,
          onChange: (newPage) => setPage(newPage),
        }} // Ví dụ thêm onChange cho pagination
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
