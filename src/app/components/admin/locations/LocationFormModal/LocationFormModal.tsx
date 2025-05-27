import React from 'react';
import { Modal, Form, Input, message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Location } from '@/app/types/location/location';
import { useMutation } from '@tanstack/react-query';
import { http } from '@/app/lib/client/apiAdmin';

interface LocationFormModalProps {
  isOpen: boolean;
  currentLocation: Location | null;
  onSubmit: (formData: Location) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  currentLocation,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const mode = currentLocation?.id ? 'edit' : 'add';

  const formik = useFormik<Location>({
    initialValues: {
      id: currentLocation?.id || 0,
      tenViTri: currentLocation?.tenViTri || '',
      tinhThanh: currentLocation?.tinhThanh || '',
      quocGia: currentLocation?.quocGia || '',
      hinhAnh: currentLocation?.hinhAnh || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      tenViTri: Yup.string().required('Location name is required'),
      tinhThanh: Yup.string().required('Province/City is required'),
      quocGia: Yup.string().required('Country is required'),
      hinhAnh: Yup.string()
        .matches(/^https?:\/\//, 'URL must start with http:// or https://')
        .url('Must be a valid URL')
        .required('Image URL is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ maViTri, file }: { maViTri: number; file: File }) => {
      const formData = new FormData();
      formData.append('formFile', file);
      return http.post<Location>(
        `vi-tri/upload-hinh-vitri?maViTri=${maViTri}`,
        formData
      );
    },
    onSuccess: (data) => {
      if (data?.hinhAnh) {
        formik.setFieldValue('hinhAnh', data.hinhAnh);
        message.success('Image uploaded successfully!');
      } else {
        message.error('Upload succeeded but no image URL returned.');
      }
    },
    onError: () => {
      message.error('Failed to upload image.');
    },
  });

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">
          {mode === 'edit' ? 'Edit Location Details' : 'Add New Location'}
        </span>
      }
      open={isOpen}
      onOk={() => formik.handleSubmit()}
      confirmLoading={isSubmitting}
      onCancel={onClose}
      okText={mode === 'edit' ? 'Save' : 'Add'}
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: '#fe6b6e',
          borderColor: '#fe6b6e',
        },
      }}
      cancelButtonProps={{
        className: 'border-gray-300 hover:border-gray-400 text-gray-700',
      }}
      width={500}
      style={{ top: 20 }}
    >
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        <div className="grid grid-cols-1">
          <Form.Item
            label="Location Name"
            validateStatus={
              formik.touched.tenViTri && formik.errors.tenViTri ? 'error' : ''
            }
            help={formik.touched.tenViTri && formik.errors.tenViTri}
          >
            <Input
              name="tenViTri"
              value={formik.values.tenViTri}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter location name"
            />
          </Form.Item>

          <Form.Item
            label="Province/City"
            validateStatus={
              formik.touched.tinhThanh && formik.errors.tinhThanh ? 'error' : ''
            }
            help={formik.touched.tinhThanh && formik.errors.tinhThanh}
          >
            <Input
              name="tinhThanh"
              value={formik.values.tinhThanh}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter province/city"
            />
          </Form.Item>

          <Form.Item
            label="Country"
            validateStatus={
              formik.touched.quocGia && formik.errors.quocGia ? 'error' : ''
            }
            help={formik.touched.quocGia && formik.errors.quocGia}
          >
            <Input
              name="quocGia"
              value={formik.values.quocGia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter country"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            {mode === 'edit' && (
              <Form.Item label="Upload Image">
                <div className="flex items-center gap-2 w-full">
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      if (!formik.values.id) {
                        message.error('Missing location ID.');
                        return false;
                      }
                      uploadImageMutation.mutate({
                        maViTri: formik.values.id,
                        file,
                      });
                      return false;
                    }}
                    disabled={uploadImageMutation.isPending}
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </div>
                {uploadImageMutation.isPending && (
                  <p className="text-blue-500 text-sm mt-1">
                    Uploading image...
                  </p>
                )}
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
                name="hinhAnh"
                value={formik.values.hinhAnh}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://example.jpg"
              />
            </Form.Item>
          </div>

          <div className="w-full h-auto mb-4">
            {formik.values.hinhAnh && !formik.errors.hinhAnh ? (
              <img
                src={formik.values.hinhAnh}
                alt="Preview image"
                className="rounded"
                style={{
                  height: '150px',
                  maxHeight: '200px',
                  width: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                  formik.setFieldError(
                    'hinhAnh',
                    'Unable to load image from this URL'
                  );
                }}
              />
            ) : (
              <div
                className="bg-gray-200 flex items-center justify-center rounded"
                style={{ width: '100%', height: '150px' }}
              >
                <span className="text-gray-500">
                  {formik.errors.hinhAnh
                    ? formik.errors.hinhAnh
                    : 'No image preview'}
                </span>
              </div>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default LocationFormModal;
