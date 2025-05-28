/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import {
  Modal,
  Form,
  Input,
  InputNumber,
  TreeSelect,
  Upload,
  Button,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Room } from '@/app/types/room/room';
import { http } from '@/app/lib/client/apiAdmin';
import { useEffect, useMemo, useState, useCallback } from 'react';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoom: Room | null;
  onSubmit: (values: Room) => void;
  isSubmitting: boolean;
}

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh?: string;
}

const RoomFormModal: React.FC<RoomFormModalProps> = ({
  isOpen,
  onClose,
  currentRoom,
  onSubmit,
  isSubmitting: isFormSubmitting,
}) => {
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const [isImagePreviewable, setIsImagePreviewable] = useState(false);

  const formik = useFormik<
    Room & { tenViTri?: string; tinhThanh?: string; tienNghi?: string[] }
  >({
    initialValues: {
      id: currentRoom?.id || 0,
      tenPhong: currentRoom?.tenPhong || '',
      khach: currentRoom?.khach || 1,
      phongNgu: currentRoom?.phongNgu || 1,
      giuong: currentRoom?.giuong || 1,
      phongTam: currentRoom?.phongTam || 1,
      giaTien: currentRoom?.giaTien || 0,
      moTa: currentRoom?.moTa || '',
      hinhAnh: currentRoom?.hinhAnh || '',
      mayGiat: currentRoom?.mayGiat || false,
      banLa: currentRoom?.banLa || false,
      tivi: currentRoom?.tivi || false,
      dieuHoa: currentRoom?.dieuHoa || false,
      wifi: currentRoom?.wifi || false,
      bep: currentRoom?.bep || false,
      doXe: currentRoom?.doXe || false,
      hoBoi: currentRoom?.hoBoi || false,
      banUi: currentRoom?.banUi || false,
      maViTri: currentRoom?.maViTri || 0,
      tenViTri: '',
      tinhThanh: '',
      tienNghi: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      tenPhong: Yup.string().required('Room name is required'),
      khach: Yup.number().min(1, 'Minimum 1 guest').required('Required'),
      phongNgu: Yup.number().min(1, 'Minimum 1 bedroom').required('Required'),
      giuong: Yup.number().min(1, 'Minimum 1 bed').required('Required'),
      phongTam: Yup.number().min(1, 'Minimum 1 bathroom').required('Required'),
      giaTien: Yup.number()
        .min(0, 'Price cannot be negative')
        .required('Required'),
      moTa: Yup.string().required('Description is required'),
      hinhAnh: Yup.string().test(
        'image-url-or-file',
        'Image URL is required unless uploading a file',
        function (value) {
          const { selectedFile } = this.parent;
          if (selectedFile) return true; // Skip URL validation if file is uploaded
          if (!value) return false;
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        }
      ),
      maViTri: Yup.number()
        .min(1, 'Please enter a valid location ID (greater than 0)')
        .required('Location ID is required'),
      tinhThanh: Yup.string().when('maViTri', {
        is: (maViTri: number) => maViTri && maViTri > 0,
        then: (schema) =>
          schema.required(
            'City/Province could not be loaded or does not exist'
          ),
        otherwise: (schema) => schema.optional(),
      }),
      tenViTri: Yup.string().when('maViTri', {
        is: (maViTri: number) => maViTri && maViTri > 0,
        then: (schema) =>
          schema.required('Location could not be loaded or does not exist'),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    onSubmit: (values) => {
      console.log('Submitting values:', values);
      const { tenViTri, tinhThanh, tienNghi, ...submitValues } = values;
      onSubmit(submitValues as Room);
      formik.resetForm();
      setSelectedFile(null);
    },
  });

  const {
    data: locationData,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useQuery<Location | null, Error>({
    queryKey: ['location', formik.values.maViTri],
    queryFn: async () => {
      if (!formik.values.maViTri || formik.values.maViTri <= 0) {
        return null;
      }
      const res = await http.get<Location | null>(
        `/vi-tri/${formik.values.maViTri}`
      );
      return res || null;
    },
    enabled: !!formik.values.maViTri && formik.values.maViTri > 0 && isOpen,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const updateLocationFields = useCallback(() => {
    if (!isOpen) {
      setIsImagePreviewable(false);
      return;
    }

    if (formik.values.maViTri > 0 && isLocationLoading) {
      formik.setFieldValue('tenViTri', 'Loading...', false);
      formik.setFieldValue('tinhThanh', 'Loading...', false);
      setIsImagePreviewable(false);
    } else if (locationData && formik.values.maViTri > 0) {
      formik.setFieldValue('tenViTri', locationData.tenViTri, false);
      formik.setFieldValue('tinhThanh', locationData.tinhThanh, false);
      setIsImagePreviewable(true);
      if (
        currentRoom &&
        currentRoom.maViTri === formik.values.maViTri &&
        formik.values.hinhAnh === currentRoom.hinhAnh
      ) {
        formik.validateField('hinhAnh');
      }
    } else if (formik.values.maViTri > 0) {
      formik.setFieldValue('tenViTri', '', false);
      formik.setFieldValue('tinhThanh', '', false);
      formik.setFieldError(
        'maViTri',
        'Location ID does not exist or data could not be found.'
      );
      formik.setFieldError(
        'tenViTri',
        'Location does not exist (due to invalid/unfound location ID)'
      );
      formik.setFieldError(
        'tinhThanh',
        'City/Province does not exist (due to invalid/unfound location ID)'
      );
      setIsImagePreviewable(false);
    } else {
      formik.setFieldValue('tenViTri', '', false);
      formik.setFieldValue('tinhThanh', '', false);
      setIsImagePreviewable(true);
    }
  }, [
    isOpen,
    locationData,
    isLocationLoading,
    isLocationError,
    formik.values.maViTri,
    currentRoom,
  ]);

  useEffect(() => {
    updateLocationFields();
  }, [updateLocationFields]);

  const amenityToFieldMap = useMemo<{ [key: string]: keyof Room }>(
    () => ({
      Wifi: 'wifi',
      TV: 'tivi',
      'Air conditioning': 'dieuHoa',
      'Washing machine': 'mayGiat',
      Iron: 'banLa',
      Kitchen: 'bep',
      Parking: 'doXe',
      Pool: 'hoBoi',
      Ironing: 'banUi',
    }),
    []
  );

  const amenitiesTree = useMemo(
    () => [
      {
        title: 'Room amenities',
        value: 'room-amenities',
        selectable: false,
        children: [
          { title: 'Wifi', value: 'Wifi' },
          { title: 'TV', value: 'TV' },
          { title: 'Air conditioning', value: 'Air conditioning' },
          { title: 'Washing machine', value: 'Washing machine' },
          { title: 'Iron', value: 'Iron' },
          { title: 'Kitchen', value: 'Kitchen' },
          { title: 'Parking', value: 'Parking' },
          { title: 'Pool', value: 'Pool' },
          { title: 'Ironing', value: 'Ironing' },
          { title: 'Balcony', value: 'Balcony' },
          { title: 'Refrigerator', value: 'Refrigerator' },
          { title: 'Bathtub', value: 'Bathtub' },
        ],
      },
      {
        title: 'Personal equipment',
        value: 'personal-equipment',
        selectable: false,
        children: [
          { title: 'Personal hygiene items', value: 'Personal hygiene items' },
          { title: 'Towel', value: 'Towel' },
          { title: 'Hair dryer', value: 'Hair dryer' },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (currentRoom && isOpen) {
      const selectedAmenities = Object.entries(amenityToFieldMap)
        .filter(([, field]) => currentRoom[field] === true)
        .map(([amenity]) => amenity);
      formik.setFieldValue('tienNghi', selectedAmenities, false);
    }
  }, [currentRoom, isOpen, amenityToFieldMap]);

  const handleAmenitiesChange = useCallback(
    (selectedAmenities: string[]) => {
      formik.setFieldValue('tienNghi', selectedAmenities, false);
      Object.values(amenityToFieldMap).forEach((field) => {
        formik.setFieldValue(field, false, false);
      });
      selectedAmenities.forEach((amenity) => {
        const field = amenityToFieldMap[amenity];
        if (field) {
          formik.setFieldValue(field, true, false);
        }
      });
    },
    [amenityToFieldMap]
  );

  const uploadImageMutation = useMutation({
    mutationFn: async ({ maPhong, file }: { maPhong: number; file: File }) => {
      const formData = new FormData();
      formData.append('formFile', file);
      const response = await http.post<Room>(
        `/phong-thue/upload-hinh-phong?maPhong=${maPhong}`,
        formData
      );
      return response;
    },
    onSuccess: (data: Room) => {
      if (data && data.hinhAnh) {
        formik.setFieldValue('hinhAnh', data.hinhAnh, false);
        message.success('Image uploaded successfully!');
      } else {
        message.error('Image uploaded, but failed to get new image URL.');
      }
      setSelectedFile(null);
    },
    onError: (error: any) => {
      console.error('Image upload error:', error);
      message.error(
        `Image upload failed: ${error.response?.data?.message || error.message}`
      );
      setSelectedFile(null);
    },
  });

  const uploadProps: UploadProps = {
    onRemove: () => {
      setSelectedFile(null);
    },
    beforeUpload: (file) => {
      setSelectedFile(file);
      if (currentRoom?.id) {
        uploadImageMutation.mutate({ maPhong: currentRoom.id, file });
      } else {
        message.error('Cannot upload image: Room ID is missing.');
      }
      return false;
    },
    fileList: selectedFile ? [selectedFile] : [],
    maxCount: 1,
  };

  const handleModalClose = useCallback(() => {
    formik.resetForm();
    setSelectedFile(null);
    setIsImagePreviewable(false);
    onClose();
  }, [formik, onClose]);

  const validationErrors = Object.values(formik.errors).filter(Boolean);

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">
          {currentRoom?.id ? 'Edit Room' : 'Add Room'}
        </span>
      }
      open={isOpen}
      onOk={() => formik.handleSubmit()}
      onCancel={handleModalClose}
      okText={currentRoom?.id ? 'Save' : 'Add'}
      okButtonProps={{
        style: {
          backgroundColor: '#fe6b6e',
          borderColor: '#fe6b6e',
        },
        disabled: validationErrors.length > 0 || uploadImageMutation.isPending,
      }}
      cancelText="Cancel"
      confirmLoading={isFormSubmitting || uploadImageMutation.isPending}
      destroyOnClose
      width={700}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          {validationErrors.length > 0 && (
            <p className="text-red-500 mb-2">
              Please fix the following errors: {validationErrors.join(', ')}
            </p>
          )}
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Room Name"
            validateStatus={
              formik.touched.tenPhong && formik.errors.tenPhong ? 'error' : ''
            }
            help={formik.touched.tenPhong && formik.errors.tenPhong}
          >
            <Input
              name="tenPhong"
              value={formik.values.tenPhong}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter room name"
            />
          </Form.Item>

          <Form.Item
            label="Location ID"
            validateStatus={
              formik.touched.maViTri && formik.errors.maViTri ? 'error' : ''
            }
            help={formik.touched.maViTri && formik.errors.maViTri}
          >
            <InputNumber
              name="maViTri"
              style={{ width: '100%' }}
              value={formik.values.maViTri}
              onChange={(value) => {
                formik.setFieldValue('maViTri', Number(value) || 0);
              }}
              onBlur={() => formik.setFieldTouched('maViTri', true)}
              min={0}
              placeholder="Enter location ID"
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Location Name"
            validateStatus={
              formik.touched.tenViTri && formik.errors.tenViTri ? 'error' : ''
            }
            help={formik.touched.tenViTri && formik.errors.tenViTri}
          >
            <Input
              name="tenViTri"
              style={{ pointerEvents: 'none' }}
              value={formik.values.tenViTri}
              readOnly
              placeholder={
                isLocationLoading
                  ? 'Loading...'
                  : 'Auto-filled after entering location ID'
              }
            />
          </Form.Item>

          <Form.Item
            label="City/Province"
            validateStatus={
              formik.touched.tinhThanh && formik.errors.tinhThanh ? 'error' : ''
            }
            help={formik.touched.tinhThanh && formik.errors.tinhThanh}
          >
            <Input
              name="tinhThanh"
              value={formik.values.tinhThanh}
              style={{ pointerEvents: 'none' }}
              readOnly
              placeholder={
                isLocationLoading
                  ? 'Loading...'
                  : 'Auto-filled after entering location ID'
              }
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between gap-4">
            <Form.Item
              label="Guests"
              validateStatus={
                formik.touched.khach && formik.errors.khach ? 'error' : ''
              }
              help={formik.touched.khach && formik.errors.khach}
            >
              <InputNumber
                name="khach"
                style={{ width: '100%' }}
                value={formik.values.khach}
                onChange={(value) => formik.setFieldValue('khach', value || 1)}
                onBlur={formik.handleBlur}
                min={1}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              label="Bedrooms"
              validateStatus={
                formik.touched.phongNgu && formik.errors.phongNgu ? 'error' : ''
              }
              help={formik.touched.phongNgu && formik.errors.phongNgu}
            >
              <InputNumber
                name="phongNgu"
                style={{ width: '100%' }}
                value={formik.values.phongNgu}
                onChange={(value) =>
                  formik.setFieldValue('phongNgu', value || 1)
                }
                onBlur={formik.handleBlur}
                min={1}
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="flex justify-between gap-4">
            <Form.Item
              label="Beds"
              validateStatus={
                formik.touched.giuong && formik.errors.giuong ? 'error' : ''
              }
              help={formik.touched.giuong && formik.errors.giuong}
            >
              <InputNumber
                name="giuong"
                style={{ width: '100%' }}
                value={formik.values.giuong}
                onChange={(value) => formik.setFieldValue('giuong', value || 1)}
                onBlur={formik.handleBlur}
                min={1}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              label="Bathrooms"
              validateStatus={
                formik.touched.phongTam && formik.errors.phongTam ? 'error' : ''
              }
              help={formik.touched.phongTam && formik.errors.phongTam}
            >
              <InputNumber
                name="phongTam"
                style={{ width: '100%' }}
                value={formik.values.phongTam}
                onChange={(value) =>
                  formik.setFieldValue('phongTam', value || 1)
                }
                onBlur={formik.handleBlur}
                min={1}
                className="w-full"
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Amenities"
            validateStatus={
              formik.touched.tienNghi && formik.errors.tienNghi ? 'error' : ''
            }
            help={formik.touched.tienNghi && formik.errors.tienNghi}
          >
            <TreeSelect
              treeData={amenitiesTree}
              value={formik.values.tienNghi}
              onChange={handleAmenitiesChange}
              onBlur={() => formik.setFieldTouched('tienNghi', true)}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="Select amenities"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Price (VND)"
            validateStatus={
              formik.touched.giaTien && formik.errors.giaTien ? 'error' : ''
            }
            help={formik.touched.giaTien && formik.errors.giaTien}
          >
            <InputNumber
              style={{ width: '100%' }}
              name="giaTien"
              value={formik.values.giaTien}
              onChange={(value) => formik.setFieldValue('giaTien', value || 0)}
              onBlur={formik.handleBlur}
              min={0}
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) =>
                value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0
              }
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            {formik.values.maViTri > 0 && currentRoom?.id && (
              <Form.Item label="Upload Image">
                <div className="flex items-center gap-2 w-full">
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </div>
                {uploadImageMutation.isPending && <p>Uploading image...</p>}
              </Form.Item>
            )}
            <Form.Item
              label="Image URL"
              validateStatus={
                formik.touched.hinhAnh && formik.errors.hinhAnh ? 'error' : ''
              }
              help={formik.touched.hinhAnh && formik.errors.hinhAnh}
            >
              <Input
                value={formik.values.hinhAnh}
                onChange={formik.handleChange}
                name="hinhAnh"
                onBlur={formik.handleBlur}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Item>
          </div>

          <div className="w-full h-auto mb-4">
            {isImagePreviewable &&
            formik.values.hinhAnh &&
            !formik.errors.hinhAnh ? (
              <img
                src={formik.values.hinhAnh}
                alt="Preview image"
                className="rounded"
                style={{
                  maxHeight: '250px',
                  width: '100%',
                  objectFit: 'contain',
                }}
                onError={() => {
                  if (isImagePreviewable) {
                    formik.setFieldError(
                      'hinhAnh',
                      'Unable to load image from this URL'
                    );
                  }
                }}
              />
            ) : (
              <div
                className="bg-gray-200 flex items-center justify-center rounded"
                style={{ width: '100%', height: '150px' }}
              >
                <span className="text-gray-500">
                  {isLocationLoading && formik.values.maViTri > 0
                    ? 'Loading location data...'
                    : formik.errors.hinhAnh
                    ? formik.errors.hinhAnh
                    : 'No image preview'}
                </span>
              </div>
            )}
          </div>
        </div>
        <Form.Item
          label="Description"
          validateStatus={
            formik.touched.moTa && formik.errors.moTa ? 'error' : ''
          }
          help={formik.touched.moTa && formik.errors.moTa}
        >
          <Input.TextArea
            value={formik.values.moTa}
            onChange={formik.handleChange}
            name="moTa"
            onBlur={formik.handleBlur}
            rows={4}
            placeholder="Enter room description"
            style={{ resize: 'none' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomFormModal;
