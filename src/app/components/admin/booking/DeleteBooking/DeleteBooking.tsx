'use client';

import React, { memo } from 'react';
import { Modal } from 'antd';
import { Booking, RoomInfo, UserInfo } from '@/app/admin/bookings/page';

interface DeleteBookingModalProps {
  isDeleteModalOpen: boolean;
  selectedBooking: Booking | null;
  deleting: boolean;
  roomInfo: RoomInfo | null;
  userInfo: UserInfo | null;
  confirmDelete: () => void;
  closeModal: () => void;
}

const DeleteBookingModal: React.FC<DeleteBookingModalProps> = memo(
  ({
    isDeleteModalOpen,
    selectedBooking,
    deleting,
    roomInfo,
    userInfo,
    confirmDelete,
    closeModal,
  }) => {
    return (
      <Modal
        title={
          <span className="text-lg font-semibold text-[#fe6b6e]">
            Confirm Booking Deletion
          </span>
        }
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        confirmLoading={deleting}
        onCancel={closeModal}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        width={600}
        style={{ top: 20 }}
        destroyOnHidden={true}
      >
        <div className="p-4 bg-gray-50 rounded-lg">
          {roomInfo ? (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-base font-medium text-gray-800">
                  {roomInfo.tenPhong}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> ${roomInfo.giaTien.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <strong>Booking ID:</strong> {selectedBooking?.id || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Check-in:</strong>{' '}
                    {selectedBooking?.ngayDen
                      ? new Date(selectedBooking.ngayDen).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Check-out:</strong>{' '}
                    {selectedBooking?.ngayDi
                      ? new Date(selectedBooking.ngayDi).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Guests:</strong>{' '}
                    {selectedBooking?.soLuongKhach || 'N/A'}
                  </p>
                </div>
                {userInfo && (
                  <div className="flex-1 flex items-center space-x-3">
                    <img
                      src={userInfo.avatar || '/default-avatar.png'}
                      alt="User Avatar"
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>User ID:</strong> {selectedBooking?.maNguoiDung}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Name:</strong> {userInfo.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {userInfo.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {userInfo.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete booking ID:{' '}
                <strong>{selectedBooking?.id}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                <strong>Check-in:</strong>{' '}
                {selectedBooking?.ngayDen
                  ? new Date(selectedBooking.ngayDen).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Check-out:</strong>{' '}
                {selectedBooking?.ngayDi
                  ? new Date(selectedBooking.ngayDi).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          )}
        </div>
      </Modal>
    );
  }
);

export default DeleteBookingModal;
