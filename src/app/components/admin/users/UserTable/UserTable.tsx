"use client";

import React, { useMemo, useCallback } from "react";
import { Table, Button, Space } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";

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

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = React.memo(({ users, loading, onEdit, onDelete }) => {
  const handleEdit = useCallback((user: User) => {
    onEdit(user);
  }, [onEdit]);

  const handleDelete = useCallback((user: User) => {
    onDelete(user);
  }, [onDelete]);

  const columns: TableColumnsType<User> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => a.id - b.id,
        sortDirections: ["ascend", "descend"],
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (_, record) => (
          <div className="flex items-center space-x-2">
            {record.avatar ? (
              <img
                src={record.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#fe6b6e] text-white flex items-center justify-center text-lg font-semibold">
                {record.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="ml-2">{record.name}</span>
          </div>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Birthday",
        dataIndex: "birthday",
        key: "birthday",
        render: (text: string) => (text ? new Date(text).toLocaleDateString() : "-"),
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        filters: [
          { text: "ADMIN", value: "ADMIN" },
          { text: "USER", value: "USER" },
        ],
        onFilter: (value, record) => record.role === value,
        filterIcon: <FilterOutlined />,
        render: (role: string) => (
          <span
            className={
              role === "ADMIN" ? "text-blue-600 font-semibold" : "text-yellow-600 font-semibold"
            }
          >
            {role}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="middle">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              danger
              style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff" }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 5 }}
      rowClassName={() => "hover:bg-gray-50"}
    />
  );
});

export default UserTable;