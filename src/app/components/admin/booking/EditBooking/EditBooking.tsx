import React, { useEffect } from 'react';
import { Modal, InputNumber, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { http } from '@/app/lib/client/apiAdmin';
import { Booking, RoomInfo, UserInfo } from '@/app/admin/bookings/page';
import { AxiosError } from 'axios';

interface EditBookingModalProps {
  isEditModalOpen: boolean;
  selectedBooking: Booking | null;
  editForm: Booking | null;
  editing: boolean;
  mode: 'edit' | 'add';
  handleSave: (formData: Booking) => Promise<void>;
  closeModal: () => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  isEditModalOpen,
  selectedBooking,
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
      ngayDen: editForm?.ngayDen ? dayjs(editForm.ngayDen).toISOString() : '',
      ngayDi: editForm?.ngayDi ? dayjs(editForm.ngayDi).toISOString() : '',
      soLuongKhach: editForm?.soLuongKhach || 1,
      id: mode === 'edit' ? selectedBooking?.id || 0 : 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      maPhong: Yup.number()
        .min(1, 'Room ID must be a positive number.')
        .required('Please enter a room ID.')
        .test('room-exists', 'Room ID not recognized.', async function (value) {
          if (!value || value <= 0) {
            return true;
          }
          try {
            await http.get<RoomInfo>(`/phong-thue/${value}`);
            return true;
          } catch (error: any) {
            const axiosError = error as AxiosError;
            if (
              axiosError.response &&
              (axiosError.response.status === 404 ||
                axiosError.response.status === 400)
            ) {
              return this.createError({
                message: 'Room ID does not exist or is invalid.',
              });
            }
            return this.createError({
              message: 'Error checking room ID. Please try again.',
            });
          }
        }),
      maNguoiDung: Yup.number()
        .min(1, 'User ID must be a positive number.')
        .required('Please enter a user ID.')
        .test('user-exists', 'User ID not recognized.', async function (value) {
          if (!value || value <= 0) {
            return true;
          }
          try {
            await http.get<UserInfo>(`/users/${value}`);
            return true;
          } catch (error: any) {
            const axiosError = error as AxiosError;
            if (
              axiosError.response &&
              (axiosError.response.status === 404 ||
                axiosError.response.status === 400)
            ) {
              return this.createError({
                message: 'User ID does not exist or is invalid.',
              });
            }
            return this.createError({
              message: 'Error checking user ID. Please try again.',
            });
          }
        }),
      ngayDen: Yup.string().required('Please select a check-in date.'),
      ngayDi: Yup.string()
        .required('Please select a check-out date.')
        .test(
          'is-after-check-in',
          'Check-out date must be after check-in date.',
          function (value, context) {
            if (!value || !context.parent.ngayDen) return true;
            return dayjs(value).isAfter(dayjs(context.parent.ngayDen));
          }
        ),
      soLuongKhach: Yup.number()
        .min(1, 'Number of guests must be at least 1.')
        .required('Please enter the number of guests.'),
    }),
    onSubmit: async (values) => {
      const submissionData = {
        ...values,
        ngayDen: values.ngayDen
          ? dayjs(values.ngayDen).format('YYYY-MM-DD')
          : '',
        ngayDi: values.ngayDi ? dayjs(values.ngayDi).format('YYYY-MM-DD') : '',
        id: mode === 'edit' ? selectedBooking?.id || values.id : values.id,
      };
      console.log('Submission data:', submissionData); // Log dữ liệu gửi đi
      try {
        await handleSave(submissionData);
        message.success(
          mode === 'edit'
            ? 'Booking updated successfully!'
            : 'Booking added successfully!'
        );
        formik.resetForm();
        closeModal();
      } catch (error: any) {
        console.log('Error saving booking:', error.response?.data); // Log lỗi
        const apiError = error.response?.data;
        if (apiError && apiError.field && apiError.message) {
          formik.setFieldError(apiError.field, apiError.message);
        } else if (apiError && apiError.message) {
          message.error(apiError.message);
        } else {
          message.error(
            'An error occurred while saving the booking. Please try again.'
          );
        }
      }
    },
  });

  const debouncedSetFieldValue = debounce(
    (field: keyof Booking, value: any) => {
      formik.setFieldValue(field, value === null ? 0 : value);
    },
    300
  );

  const {
    data: roomInfo,
    isLoading: roomLoading,
    isError: roomQueryIsError,
    error: roomQueryError,
  } = useQuery({
    queryKey: ['roomInfoValidation', formik.values.maPhong],
    queryFn: async () => {
      if (!formik.values.maPhong || formik.values.maPhong <= 0) return null;
      return http.get<RoomInfo>(`/phong-thue/${formik.values.maPhong}`);
    },
    enabled: !!formik.values.maPhong && formik.values.maPhong > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: userInfo,
    isLoading: userLoading,
    isError: userQueryIsError,
    error: userQueryErrorObject,
  } = useQuery({
    queryKey: ['userInfoValidation', formik.values.maNguoiDung],
    queryFn: async () => {
      if (!formik.values.maNguoiDung || formik.values.maNguoiDung <= 0)
        return null;
      return http.get<UserInfo>(`/users/${formik.values.maNguoiDung}`);
    },
    enabled: !!formik.values.maNguoiDung && formik.values.maNguoiDung > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isEditModalOpen) {
      formik.resetForm();
    }
  }, [isEditModalOpen]);

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">
          {mode === 'edit' ? 'Edit Booking' : 'Add New Booking'}
        </span>
      }
      open={isEditModalOpen}
      onOk={() => formik.handleSubmit()}
      confirmLoading={formik.isSubmitting || editing}
      onCancel={() => {
        formik.resetForm();
        closeModal();
      }}
      okText={mode === 'edit' ? 'Save' : 'Add'}
      cancelText="Cancel"
      okButtonProps={{
        style: { backgroundColor: '#fe6b6e', borderColor: '#fe6b6e' },
        disabled:
          formik.isSubmitting || !formik.dirty || !formik.isValid || editing,
      }}
      destroyOnHidden
      width={500}
      style={{ top: 20 }}
    >
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label htmlFor="maPhong" className="block mb-2">
              Room ID
            </label>
            <InputNumber
              id="maPhong"
              name="maPhong"
              value={formik.values.maPhong}
              onChange={(value) => debouncedSetFieldValue('maPhong', value)}
              onBlur={() => formik.setFieldTouched('maPhong', true)}
              min={0}
              className="w-full"
              style={{ width: '100%' }}
              status={
                formik.touched.maPhong && formik.errors.maPhong ? 'error' : ''
              }
            />
            {formik.touched.maPhong && formik.errors.maPhong && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.maPhong}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="maNguoiDung" className="block mb-2">
              User ID
            </label>
            <InputNumber
              id="maNguoiDung"
              name="maNguoiDung"
              value={formik.values.maNguoiDung}
              onChange={(value) => debouncedSetFieldValue('maNguoiDung', value)}
              onBlur={() => formik.setFieldTouched('maNguoiDung', true)}
              min={0}
              className="w-full"
              style={{ width: '100%' }}
              status={
                formik.touched.maNguoiDung && formik.errors.maNguoiDung
                  ? 'error'
                  : ''
              }
            />
            {formik.touched.maNguoiDung && formik.errors.maNguoiDung && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.maNguoiDung}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="ngayDen" className="block mb-2">
              Check in
            </label>
            <DatePicker
              id="ngayDen"
              name="ngayDen"
              value={
                formik.values.ngayDen && dayjs(formik.values.ngayDen).isValid()
                  ? dayjs(formik.values.ngayDen)
                  : null
              }
              onChange={(date) =>
                formik.setFieldValue('ngayDen', date ? date.toISOString() : '')
              }
              onBlur={() => formik.setFieldTouched('ngayDen', true)}
              className="w-full"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
              status={
                formik.touched.ngayDen && formik.errors.ngayDen ? 'error' : ''
              }
            />

            {formik.touched.ngayDen && formik.errors.ngayDen && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.ngayDen}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="ngayDi" className="block mb-2">
              Check out
            </label>
            <DatePicker
              id="ngayDi"
              name="ngayDi"
              value={
                formik.values.ngayDi && dayjs(formik.values.ngayDi).isValid()
                  ? dayjs(formik.values.ngayDi)
                  : null
              }
              onChange={(date) =>
                formik.setFieldValue('ngayDi', date ? date.toISOString() : '')
              }
              onBlur={() => formik.setFieldTouched('ngayDi', true)}
              className="w-full"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) =>
                current &&
                ((formik.values.ngayDen &&
                  current <
                    dayjs(formik.values.ngayDen)
                      .add(1, 'day')
                      .startOf('day')) ||
                  current < dayjs().startOf('day'))
              }
              status={
                formik.touched.ngayDi && formik.errors.ngayDi ? 'error' : ''
              }
            />
            {formik.touched.ngayDi && formik.errors.ngayDi && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.ngayDi}
              </div>
            )}
          </div>

          <div className="">
            <label htmlFor="soLuongKhach" className="block mb-2">
              Number of Guests
            </label>
            <InputNumber
              id="soLuongKhach"
              name="soLuongKhach"
              value={formik.values.soLuongKhach}
              onChange={(value) =>
                formik.setFieldValue('soLuongKhach', value === null ? 0 : value)
              }
              onBlur={() => formik.setFieldTouched('soLuongKhach', true)}
              min={1}
              className="w-full"
              style={{ width: '100%' }}
              status={
                formik.touched.soLuongKhach && formik.errors.soLuongKhach
                  ? 'error'
                  : ''
              }
            />
            {formik.touched.soLuongKhach && formik.errors.soLuongKhach && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.soLuongKhach}
              </div>
            )}
          </div>
        </div>
        {(roomInfo ||
          userInfo ||
          formik.values.ngayDen ||
          formik.values.ngayDi ||
          formik.values.soLuongKhach) && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-base font-medium text-gray-800 mb-3">
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3">
              {roomLoading ? (
                <p className="text-xs text-gray-500">
                  Loading room information...
                </p>
              ) : roomInfo ? (
                <div>
                  <p className="font-medium text-gray-700 mb-2">
                    Room: {roomInfo.tenPhong}
                  </p>
                  <p className="font-medium text-gray-600">
                    Price per night: ${roomInfo.giaTien?.toLocaleString()}
                  </p>
                  <div className="md:col-span-2">
                    {formik.values.ngayDen && (
                      <p className=" font-medium text-gray-600">
                        Check in:{' '}
                        {dayjs(formik.values.ngayDen).format('DD/MM/YYYY')}
                      </p>
                    )}
                    {formik.values.ngayDi && (
                      <p className="font-medium text-gray-600">
                        Check out:{' '}
                        {dayjs(formik.values.ngayDi).format('DD/MM/YYYY')}
                      </p>
                    )}
                    {formik.values.soLuongKhach > 0 && (
                      <p className="font-medium text-gray-600">
                        Number of Guests: {formik.values.soLuongKhach}
                      </p>
                    )}
                    {roomInfo &&
                      formik.values.ngayDen &&
                      formik.values.ngayDi && (
                        <p className="font-medium text-gray-600">
                          Total:{' '}
                          {(
                            roomInfo.giaTien *
                            dayjs(formik.values.ngayDi).diff(
                              dayjs(formik.values.ngayDen),
                              'day'
                            )
                          ).toLocaleString()}
                          $
                        </p>
                      )}
                  </div>
                </div>
              ) : (
                formik.values.maPhong > 0 &&
                !formik.errors.maPhong && (
                  <p className="text-xs text-orange-500">
                    No information available for this room ID.
                  </p>
                )
              )}

              {userLoading ? (
                <p className="text-xs text-gray-500">
                  Loading user information...
                </p>
              ) : userInfo ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={userInfo.avatar || '/default-avatar.png'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                  <div className="">
                    <p className="text-sm font-semibold text-gray-700">
                      {userInfo.name}
                    </p>
                    <p className="font-medium text-gray-600 ">
                      Email:{' '}
                      <span className="whitespace-wrap">{userInfo.email}</span>
                    </p>
                    {userInfo.phone && (
                      <p className="font-medium text-gray-600 ">
                        Phone: {userInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                formik.values.maNguoiDung > 0 &&
                !formik.errors.maNguoiDung && (
                  <p className="text-xs text-orange-500">
                    No information available for this user ID.
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default EditBookingModal;
