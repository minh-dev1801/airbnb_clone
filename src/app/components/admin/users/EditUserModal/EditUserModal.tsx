'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  DatePicker,
  Select,
  Radio,
  Form,
  Upload,
  Button,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { User } from '@/app/types/user/user';
import type { FormInstance } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

interface EditUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  selectedUser: User | null;
  avatarPreview: string | null;
  form: FormInstance;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedUser,
  avatarPreview,
  form,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (selectedUser && visible) {
      form.setFieldsValue({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || null,
        birthday: selectedUser.birthday ? dayjs(selectedUser.birthday) : null,
        gender: selectedUser.gender,
        role: selectedUser.role || 'USER',
        password: undefined, // Không điền sẵn password
      });
      setFileList(
        avatarPreview
          ? [{ uid: '-1', name: 'avatar', status: 'done', url: avatarPreview }]
          : []
      );
    }
  }, [selectedUser, avatarPreview, visible, form]);

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList.slice(-1)); // Chỉ giữ file mới nhất
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  if (!selectedUser) {
    return null; // Ngăn hiển thị modal nếu selectedUser là null
  }

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-[#fe6b6e]">Edit User</span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onSubmit)}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{
        style: { backgroundColor: '#fe6b6e', borderColor: '#fe6b6e' },
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="flex items-center space-x-4 mb-4">
          {fileList.length > 0 && fileList[0].url ? (
            <img
              src={fileList[0].url}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full border-2 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#fe6b6e] text-white flex items-center justify-center text-2xl font-semibold border-2 shadow-sm">
              {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <Form.Item
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload
              beforeUpload={() => false} // Ngăn upload tự động, xử lý ở backend
              fileList={fileList}
              onChange={handleUploadChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email' },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                pattern: /^[0-9]{9,11}$/,
                message: 'Phone must be 9-11 digits',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="birthday"
            label="Birthday"
            rules={[{ required: true, message: 'Birthday is required' }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <Select>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Gender is required' }]}
        >
          <Radio.Group>
            <Radio value={true}>Male</Radio>
            <Radio value={false}>Female</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
