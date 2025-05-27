'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Form, message, Modal, Avatar } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/app/lib/client/apiAdmin';
import SearchBar from '@/app/components/admin/searchbar/SearchBar';
import UserTable from '@/app/components/admin/users/UserTable/UserTable';
import AddUserModal from '@/app/components/admin/users/AddUserModal/AddUserModal';
import EditUserModal from '@/app/components/admin/users/EditUserModal/EditUserModal';
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

const UserPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await http.get<User[]>('/users');
      return [...data].reverse();
    },
    staleTime: 1000 * 60 * 10, // Tăng lên 10 phút
  });

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [users, searchText]);

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/users?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete user');
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (newUser: any) => http.post<User>('/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User added successfully');
      setIsAddModalOpen(false);
      addForm.resetFields();
    },
    onError: () => {
      message.error('Failed to add user');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, updatedUser }: { id: number; updatedUser: any }) =>
      http.put(`/users/${id}`, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User updated successfully');
      setIsEditModalOpen(false);
      editForm.resetFields();
      setSelectedUser(null);
      setAvatarPreview(null);
    },
    onError: () => {
      message.error('Failed to update user');
    },
  });

  const fetchUserById = useCallback(async (id: number) => {
    try {
      return await http.get<User>(`/users/${id}`);
    } catch {
      message.error('Failed to fetch user details');
      return null;
    }
  }, []);

  const handleDelete = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
    setDeleteModalVisible(false);
    setUserToDelete(null);
  }, [userToDelete, deleteUserMutation]);

  const handleEdit = useCallback(
    async (user: User) => {
      const userDetails = await fetchUserById(user.id);
      if (userDetails) {
        setSelectedUser(userDetails);
        const isValidDate =
          userDetails.birthday && dayjs(userDetails.birthday).isValid();
        editForm.setFieldsValue({
          name: userDetails.name || '',
          email: userDetails.email || '',
          password: userDetails.password || '',
          phone: userDetails.phone || '',
          birthday: isValidDate ? dayjs(userDetails.birthday) : null,
          gender: userDetails.gender,
          role: userDetails.role || 'USER',
        });
        setAvatarPreview(userDetails.avatar || null);

        setIsEditModalOpen(true);
      }
    },
    [editForm, fetchUserById]
  );

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleAddUser = useCallback(
    (values: any) => {
      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password || '',
        phone: values.phone || null,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
        avatar: null,
        gender: values.gender,
        role: values.role,
      };
      addUserMutation.mutate(newUser);
    },
    [addUserMutation]
  );

  const handleUpdateUser = useCallback(
    async (values: any) => {
      if (!selectedUser) return;

      const updatedUser = {
        id: selectedUser.id,
        name: values.name,
        email: values.email,
        password: values.password || selectedUser.password,
        phone: values.phone || null,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
        gender: values.gender,
        role: values.role,
      };

      updateUserMutation.mutate({ id: selectedUser.id, updatedUser });
    },
    [selectedUser, updateUserMutation]
  );

  useEffect(() => {
    if (!isAddModalOpen) addForm.resetFields();
    if (!isEditModalOpen) {
      editForm.resetFields();
      setSelectedUser(null);
      setAvatarPreview(null);
    }
  }, [isAddModalOpen, isEditModalOpen, addForm, editForm]);

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="grid grid-cols-2 justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="flex justify-end items-center space-x-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center py-2 border-b border-gray-200"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="grid grid-cols-2 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex justify-end items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsAddModalOpen(true)}
            style={{
              backgroundColor: '#fe6b6e',
              borderColor: '#fe6b6e',
              fontSize: '16px',
              padding: '20px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#e55e61')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#fe6b6e')
            }
          >
            Add User
          </Button>
        </div>
      </div>

      <UserTable
        users={filteredUsers}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isAddModalOpen && (
        <AddUserModal
          visible={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={handleAddUser}
          form={addForm}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          visible={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateUser}
          form={editForm}
          selectedUser={selectedUser}
          avatarPreview={avatarPreview}
        />
      )}

      <Modal
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setUserToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        title={
          <span className="text-xl font-semibold text-[#fe6b6e]">
            Delete User
          </span>
        }
        okButtonProps={{
          danger: true,
          style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' },
        }}
      >
        <p>Are you sure you want to delete this user?</p>
        {userToDelete && (
          <div>
            <div>
              {' '}
              <p>
                <strong>ID:</strong> {userToDelete.id}
              </p>
              <p>
                <strong>Name:</strong> {userToDelete.name}
              </p>
              <p>
                <strong>Email:</strong> {userToDelete.email}
              </p>
              <p>
                <strong>Role:</strong> {userToDelete.role}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
