import React from 'react';
import { Modal, Descriptions, Button } from 'antd';
import { Room } from '@/app/types/room/room';

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onConfirm: (roomId: number) => void;
  isDeleting: boolean;
}

const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({
  isOpen,
  onClose,
  room,
  onConfirm,
  isDeleting,
}) => {
  if (!room) return null;

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">
          Delete Room
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={() => onConfirm(room.id)}
          loading={isDeleting}
        >
          Delete
        </Button>,
      ]}
      width={600}
    >
      <p className="mb-4">
        Are you sure you want to delete this room? This action cannot be undone.
      </p>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{room.id}</Descriptions.Item>
        <Descriptions.Item label="Room Name">{room.tenPhong}</Descriptions.Item>
        <Descriptions.Item label="Guests">{room.khach}</Descriptions.Item>
        <Descriptions.Item label="Bedrooms">{room.phongNgu}</Descriptions.Item>
        <Descriptions.Item label="Beds">{room.giuong}</Descriptions.Item>
        <Descriptions.Item label="Bathrooms">{room.phongTam}</Descriptions.Item>
        <Descriptions.Item label="Price">
          {room.giaTien.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Description">{room.moTa}</Descriptions.Item>
        <Descriptions.Item label="Image URL">{room.hinhAnh}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DeleteRoomModal;
