'use client';

import React from 'react';
import { Modal, Input, DatePicker, Select, Radio, FormInstance } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

interface AddUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  form: FormInstance<any>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      birthday: null,
      gender: true,
      role: 'USER',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
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

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">
          Add New User
        </span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={formik.submitForm}
      okText="Add"
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: '#fe6b6e',
          borderColor: '#fe6b6e',
        },
      }}
      destroyOnHidden
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <Input
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Password</label>
            <Input.Password
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500">{formik.errors.password}</div>
            )}
          </div>
          <div>
            <label className="block mb-2">Phone</label>
            <Input
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter phone"
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500">{formik.errors.phone}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Birthday</label>
            <DatePicker
              value={
                formik.values.birthday ? dayjs(formik.values.birthday) : null
              }
              onChange={(date) =>
                formik.setFieldValue('birthday', date?.toISOString() || null)
              }
              className="w-full"
              format="YYYY-MM-DD"
            />
            {formik.touched.birthday && formik.errors.birthday && (
              <div className="text-red-500">{formik.errors.birthday}</div>
            )}
          </div>
          <div>
            <label className="block mb-2">Role</label>
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
          <label className="block mb-2">Gender</label>
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

export default AddUserModal;
