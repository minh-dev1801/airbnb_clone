'use client';

import React, { memo } from 'react';
import { Table, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import SearchBar from '@/app/components/admin/searchbar/SearchBar';
import { TableColumnsType } from 'antd';
import { Booking } from '@/app/[locale]/admin/bookings/page';

interface BookingTableProps {
  filteredBookings: Booking[];
  loading: boolean;
  columns: TableColumnsType<Booking>;
  handleSearch: (value: string) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onAdd: () => void;
}

const BookingTable: React.FC<BookingTableProps> = memo(
  ({ filteredBookings, loading, columns, handleSearch, onAdd }) => {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Booking Management
          </h1>
          <div className="flex justify-end items-center space-x-4">
            <SearchBar onSearch={handleSearch} />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={onAdd}
              style={{
                backgroundColor: '#fe6b6e',
                borderColor: '#fe6b6e',
                fontSize: '16px',
                padding: '20px',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#e55e61')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#fe6b6e')
              }
            >
              Add Booking
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowClassName={() => 'hover:bg-gray-50'}
        />
      </div>
    );
  }
);

export default BookingTable;
