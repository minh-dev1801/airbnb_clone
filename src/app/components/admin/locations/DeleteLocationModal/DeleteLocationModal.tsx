import React from 'react';
import { Modal } from 'antd';
import { Location } from '@/app/types/location/location';

interface DeleteLocationModalProps {
  isOpen: boolean;
  location: Location | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteLocationModal: React.FC<DeleteLocationModalProps> = ({
  isOpen,
  location,
  onClose,
  onConfirmDelete,
}) => {
  return (
    <Modal
      open={isOpen}
      title={
        <span className="font-semibold text-xl text-[#fe6b6e]">
          Delete Location
        </span>
      }
      onOk={onConfirmDelete}
      onCancel={onClose}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p className=" mb-2">
        Are you sure you want to delete the following location?
      </p>
      {location ? (
        <div className="text-gray-700 grid grid-cols-2 gap-2 items-center">
          <div>
            <div className="mb-2">
              <span className="font-semibold">Location Name:</span>{' '}
              {location.tenViTri}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Province/City:</span>{' '}
              {location.tinhThanh}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Country:</span> {location.quocGia}
            </div>
          </div>
          {location.hinhAnh && (
            <img
              src={location.hinhAnh}
              alt={location.tenViTri}
              className="rounded mt-4 shadow-md border border-gray-200"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      ) : (
        <p className="text-red-500">Location information not available.</p>
      )}
    </Modal>
  );
};

export default DeleteLocationModal;
