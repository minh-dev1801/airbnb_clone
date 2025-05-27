'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { message, Button, Space, TableColumnsType } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/app/lib/client/apiAdmin';
import BookingTable from '@/app/components/admin/booking/BookingTable/BookingTable';
import EditBookingModal from '@/app/components/admin/booking/EditBooking/EditBooking';
import DeleteBookingModal from '@/app/components/admin/booking/DeleteBooking/DeleteBooking';

export interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface RoomInfo {
  tenPhong: string;
  giaTien: number;
}

const BookingPage = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<Booking | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');
  const queryClient = useQueryClient();

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', page],
    queryFn: async () => {
      const response = await http.get<Booking[]>(
        `/dat-phong?page=${page}&limit=20&fields=id,maPhong,ngayDen,ngayDi,soLuongKhach,maNguoiDung`
      );
      return [...response].reverse();
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: userInfo } = useQuery({
    queryKey: ['user', selectedBooking?.maNguoiDung],
    queryFn: async () => {
      if (!selectedBooking) return null;
      return await http.get<UserInfo>(`/users/${selectedBooking.maNguoiDung}`);
    },
    enabled: !!selectedBooking,
  });

  const { data: roomInfo } = useQuery({
    queryKey: ['room', selectedBooking?.maPhong],
    queryFn: async () => {
      if (!selectedBooking) return null;
      return await http.get<RoomInfo>(`/phong-thue/${selectedBooking.maPhong}`);
    },
    enabled: !!selectedBooking,
  });

  const filteredBookings = useMemo(() => {
    if (!bookingsData) return [];
    const searchValue = searchText.trim().toLowerCase();
    return bookingsData.filter((booking) =>
      [booking.id, booking.maPhong, booking.maNguoiDung]
        .map(String)
        .some((field) => field.includes(searchValue))
    );
  }, [bookingsData, searchText]);

  const addBookingMutation = useMutation({
    mutationFn: (newBooking: Omit<Booking, 'id'>) =>
      http.post(`/dat-phong`, newBooking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      message.success('Booking created successfully!');
      setIsEditModalOpen(false);
      setEditForm(null);
    },
    onError: (error: any) => {
      message.error(
        `Failed to create booking: ${error?.message || 'Unknown error'}`
      );
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({
      id,
      updatedBooking,
    }: {
      id: number;
      updatedBooking: Booking;
    }) => http.put(`/dat-phong/${id}`, updatedBooking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      message.success('Booking updated successfully!');
      setIsEditModalOpen(false);
      setEditForm(null);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      message.error(
        `Failed to update booking: ${error?.message || 'Unknown error'}`
      );
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/dat-phong/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      message.success('Booking deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      message.error(
        `Failed to delete booking: ${error?.message || 'Unknown error'}`
      );
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleEdit = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({ ...booking });
    setModalMode('edit');
    setIsEditModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedBooking(null);
    setEditForm({
      id: 0,
      maPhong: 0,
      ngayDen: '',
      ngayDi: '',
      soLuongKhach: 0,
      maNguoiDung: 0,
    });
    setModalMode('add');
    setIsEditModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (formData: Booking) => {
      if (modalMode === 'edit' && selectedBooking) {
        updateBookingMutation.mutate({
          id: selectedBooking.id,
          updatedBooking: formData,
        });
      } else {
        const { id, ...newBooking } = formData;
        addBookingMutation.mutate(newBooking);
      }
    },
    [modalMode, selectedBooking, addBookingMutation, updateBookingMutation]
  );

  const handleDelete = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedBooking) {
      deleteBookingMutation.mutate(selectedBooking.id);
    }
  }, [selectedBooking, deleteBookingMutation]);

  const columns: TableColumnsType<Booking> = useMemo(
    () => [
      {
        title: 'Booking ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: 'Room ID',
        dataIndex: 'maPhong',
        key: 'maPhong',
        sorter: (a, b) => a.maPhong - b.maPhong,
      },
      {
        title: 'Check In',
        dataIndex: 'ngayDen',
        key: 'ngayDen',
        render: (text: string) => new Date(text).toLocaleDateString('vi'),
        sorter: (a, b) =>
          new Date(a.ngayDen).getTime() - new Date(b.ngayDen).getTime(),
      },
      {
        title: 'Check Out',
        dataIndex: 'ngayDi',
        key: 'ngayDi',
        render: (text: string) => new Date(text).toLocaleDateString('vi'),
        sorter: (a, b) =>
          new Date(a.ngayDi).getTime() - new Date(b.ngayDi).getTime(),
      },
      {
        title: 'Guests',
        dataIndex: 'soLuongKhach',
        key: 'soLuongKhach',
        sorter: (a, b) => a.soLuongKhach - b.soLuongKhach,
      },
      {
        title: 'User ID',
        dataIndex: 'maNguoiDung',
        key: 'maNguoiDung',
        sorter: (a, b) => a.maNguoiDung - b.maNguoiDung,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <BookingTable
        filteredBookings={filteredBookings}
        loading={isLoading}
        columns={columns}
        handleSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
      <EditBookingModal
        isEditModalOpen={isEditModalOpen}
        selectedBooking={selectedBooking}
        editForm={editForm}
        editing={
          addBookingMutation.isPending || updateBookingMutation.isPending
        }
        mode={modalMode}
        setEditForm={setEditForm}
        handleSave={handleSave}
        closeModal={() => {
          setIsEditModalOpen(false);
          setSelectedBooking(null);
          setEditForm(null);
        }}
      />
      <DeleteBookingModal
        isDeleteModalOpen={isDeleteModalOpen}
        selectedBooking={selectedBooking}
        deleting={deleteBookingMutation.isPending}
        roomInfo={roomInfo ?? null}
        userInfo={userInfo ?? null}
        confirmDelete={confirmDelete}
        closeModal={() => {
          setIsDeleteModalOpen(false);
          setSelectedBooking(null);
        }}
      />
    </>
  );
};

export default BookingPage;
