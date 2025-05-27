import React from 'react';
import { Modal, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/app/lib/client/apiAdmin';
import { Booking, RoomInfo, UserInfo } from '@/app/admin/bookings/page';

interface EditBookingModalProps {
  isEditModalOpen: boolean;
  selectedBooking: Booking | null;
  editForm: Booking | null;
  editing: boolean;
  mode: 'edit' | 'add';
  setEditForm: (form: Booking | null) => void;
  handleSave: (formData: Booking) => void;
  closeModal: () => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  isEditModalOpen,
  editForm,
  editing,
  mode,
  handleSave,
  closeModal,
}) => {
  const formik = useFormik<Booking>({
    initialValues: {
      maPhong: editForm?.maPhong || 0,
      maNguoiDung: editForm?.maNguoiDung || 0,
      ngayDen: editForm?.ngayDen || '',
      ngayDi: editForm?.ngayDi || '',
      soLuongKhach: editForm?.soLuongKhach || 1,
      id: editForm?.id || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      maPhong: Yup.number().min(1, 'Invalid Room ID').required('Required'),
      maNguoiDung: Yup.number()
        .min(1, 'Invalid User ID')
        .required('Required')
        .test('user-exists', 'User ID does not exist', async (value) => {
          if (!value || value <= 0) return false;
          try {
            const response = await http.get<UserInfo>(`/users/${value}`);
            return !!response;
          } catch (error) {
            return false;
          }
        }),
      ngayDen: Yup.string().required('Check-in date is required'),
      ngayDi: Yup.string().required('Check-out date is required'),
      soLuongKhach: Yup.number()
        .min(1, 'At least 1 guest')
        .required('Required'),
    }),
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const {
    data: roomInfo,
    isLoading: roomLoading,
    isError,
  } = useQuery({
    queryKey: ['room', formik.values.maPhong],
    queryFn: async () => {
      const res = await http.get<RoomInfo>(
        `/phong-thue/${formik.values.maPhong}`
      );
      return res;
    },
    enabled: !!formik.values.maPhong && formik.values.maPhong > 0,
    staleTime: 1000 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: userInfo,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ['user', formik.values.maNguoiDung],
    queryFn: async () => {
      const res = await http.get<UserInfo>(
        `/users/${formik.values.maNguoiDung}`
      );
      return res;
    },
    enabled: !!formik.values.maNguoiDung && formik.values.maNguoiDung > 0,
    staleTime: 1000 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">
          {mode === 'edit' ? 'Edit Booking Details' : 'Add New Booking'}
        </span>
      }
      open={isEditModalOpen}
      onOk={() => formik.handleSubmit()}
      confirmLoading={editing}
      onCancel={closeModal}
      okText={mode === 'edit' ? 'Save' : 'Add'}
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: '#fe6b6e',
          borderColor: '#fe6b6e',
        },
        disabled:
          editing ||
          formik.isSubmitting ||
          (formik.values.maNguoiDung > 0 &&
            !userLoading &&
            (!userInfo || isError)),
      }}
      cancelButtonProps={{
        className: 'border-gray-300 hover:border-gray-400 text-gray-700',
      }}
      width={700}
      style={{ top: 20 }}
    >
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-3">Room ID</label>
            <InputNumber
              value={formik.values.maPhong}
              onChange={(value) => {
                formik.setFieldValue('maPhong', value || 0);
              }}
              onBlur={formik.handleBlur}
              min={0}
              className="w-full"
              style={{ minWidth: '100%' }}
            />
            {formik.touched.maPhong && formik.errors.maPhong && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.maPhong}
              </div>
            )}
            {formik.values.maPhong > 0 &&
              !roomLoading &&
              (!roomInfo || isError) && (
                <div className="text-red-500 text-sm mt-1">
                  Room ID does not exist
                </div>
              )}
          </div>

          <div>
            <label className="block mb-3">User ID</label>
            <InputNumber
              value={formik.values.maNguoiDung}
              onChange={(value) => {
                formik.setFieldValue('maNguoiDung', value || 0);
              }}
              onBlur={formik.handleBlur}
              min={0}
              className="w-full"
              style={{ minWidth: '100%' }}
            />
            {formik.touched.maNguoiDung && formik.errors.maNguoiDung && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.maNguoiDung}
              </div>
            )}
            {formik.values.maNguoiDung > 0 &&
              !userLoading &&
              (!userInfo || isError) && (
                <div className="text-red-500 text-sm mt-1">
                  User ID does not exist
                </div>
              )}
          </div>

          <div>
            <label className="block mb-3">Check-in Date</label>
            <DatePicker
              value={
                formik.values.ngayDen ? dayjs(formik.values.ngayDen) : null
              }
              onChange={(date) =>
                formik.setFieldValue('ngayDen', date ? date.toISOString() : '')
              }
              onBlur={formik.handleBlur}
              className="w-full"
              style={{ minWidth: '100%' }}
              format="YYYY-MM-DD"
            />
            {formik.touched.ngayDen && formik.errors.ngayDen && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.ngayDen}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-3">Check-out Date</label>
            <DatePicker
              value={formik.values.ngayDi ? dayjs(formik.values.ngayDi) : null}
              onChange={(date) =>
                formik.setFieldValue('ngayDi', date ? date.toISOString() : '')
              }
              onBlur={formik.handleBlur}
              className="w-full"
              style={{ minWidth: '100%' }}
              format="YYYY-MM-DD"
            />
            {formik.touched.ngayDi && formik.errors.ngayDi && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.ngayDi}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-3">Number of Guests</label>
            <InputNumber
              value={formik.values.soLuongKhach}
              onChange={(value) =>
                formik.setFieldValue('soLuongKhach', value || 0)
              }
              onBlur={formik.handleBlur}
              min={0}
              className="w-full"
              style={{ minWidth: '100%' }}
            />
            {formik.touched.soLuongKhach && formik.errors.soLuongKhach && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.soLuongKhach}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Booking Summary
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {roomLoading ? (
                <p className="text-sm text-gray-500">
                  Loading room information...
                </p>
              ) : roomInfo ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Room: {roomInfo.tenPhong}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${roomInfo.giaTien.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No room information available
                </p>
              )}
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-600">
                  Check-in:{' '}
                  {formik.values.ngayDen
                    ? new Date(formik.values.ngayDen).toLocaleDateString(
                        'en-GB'
                      )
                    : '-'}
                </p>
                <p className="text-sm text-gray-600">
                  Check-out:{' '}
                  {formik.values.ngayDi
                    ? new Date(formik.values.ngayDi).toLocaleDateString('en-GB')
                    : '-'}
                </p>
                <p className="text-sm text-gray-600">
                  Guests: {formik.values.soLuongKhach || '-'}
                </p>
              </div>
            </div>

            <div>
              {userLoading ? (
                <p className="text-sm text-gray-500">
                  Loading user information...
                </p>
              ) : userInfo ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={userInfo.avatar || '/default-avatar.png'}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {userInfo.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {userInfo.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {userInfo.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No user information available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditBookingModal;
