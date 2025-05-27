'use client';

import React, { useEffect } from 'react';
import { Modal, Input, DatePicker, Select, Radio, FormInstance } from 'antd';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}

interface EditUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  selectedUser: User | null;
  avatarPreview: string | null;

  form: FormInstance<any>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedUser,
  avatarPreview,
}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      birthday: '',
      gender: true,
      role: 'USER',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{9,11}$/, 'Phone must be 9-11 digits')
        .nullable(),
      birthday: Yup.date().required('Birthday is required'),
      gender: Yup.boolean().required('Gender is required'),
      role: Yup.string().oneOf(['ADMIN', 'USER']).required('Role is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (selectedUser) {
      formik.setValues({
        name: selectedUser.name,
        email: selectedUser.email,
        password: '',
        phone: selectedUser.phone,
        birthday: selectedUser.birthday,
        gender: selectedUser.gender,
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">Edit User</span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={formik.submitForm}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: '#fe6b6e',
          borderColor: '#fe6b6e',
        },
      }}
      destroyOnHidden={true}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full border-2 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#fe6b6e] text-white flex items-center justify-center text-2xl font-semibold border-2 shadow-sm">
              {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-3">Name</label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label className="block mb-3">Email</label>
            <Input
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-3">Password</label>
            <Input.Password
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label className="block mb-3">Phone</label>
            <Input
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500">{formik.errors.phone}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-3">Birthday</label>
            <DatePicker
              value={
                formik.values.birthday ? dayjs(formik.values.birthday) : null
              }
              onChange={(date) =>
                formik.setFieldValue('birthday', date?.toISOString() || '')
              }
              className="w-full"
              format="YYYY-MM-DD"
            />
            {formik.touched.birthday && formik.errors.birthday && (
              <div className="text-red-500">{formik.errors.birthday}</div>
            )}
          </div>
          <div>
            <label className="block mb-3">Role</label>
            <Select
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue('role', value)}
              className="w-full"
            >
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500">{formik.errors.role}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-3">Gender</label>
          <Radio.Group
            value={formik.values.gender}
            onChange={(e) => formik.setFieldValue('gender', e.target.value)}
          >
            <Radio value={true}>Male</Radio>
            <Radio value={false}>Female</Radio>
          </Radio.Group>
          {formik.touched.gender && formik.errors.gender && (
            <div className="text-red-500">{formik.errors.gender}</div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
