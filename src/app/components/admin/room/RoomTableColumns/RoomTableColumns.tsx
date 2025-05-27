import { ColumnsType } from 'antd/es/table';
import { Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ImageCell from '../../ImageCell/ImageCell';
import { Room } from '@/app/types/room/room';

export const getRoomTableColumns = (
  handleEdit: (room: Room) => void,
  handleDelete: (roomId: number) => void
): ColumnsType<Room> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 70,
    align: 'center',
    sorter: (a: Room, b: Room) => a.id - b.id,
  },
  {
    title: 'Image',
    dataIndex: 'hinhAnh',
    key: 'hinhAnh',
    width: 150,
    render: (url: string) => <ImageCell url={url} />,
  },
  {
    title: 'Room Name',
    dataIndex: 'tenPhong',
    key: 'tenPhong',
    render: (text: string) => (
      <Tooltip title={text}>
        <div
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 200,
            cursor: 'pointer',
          }}
        >
          {text}
        </div>
      </Tooltip>
    ),
  },

  {
    title: 'Details',
    key: 'details',
    width: 140,
    render: (_, record: Room) => {
      const amenities: { label: string; value: boolean }[] = [
        { label: 'Washing Machine', value: record.mayGiat },
        { label: 'Iron', value: record.banLa },
        { label: 'TV', value: record.tivi },
        { label: 'Air Conditioner', value: record.dieuHoa },
        { label: 'WiFi', value: record.wifi },
        { label: 'Kitchen', value: record.bep },
        { label: 'Parking', value: record.doXe },
        { label: 'Swimming Pool', value: record.hoBoi },
        { label: 'Ironing Board', value: record.banUi },
      ];

      const tooltipContent = (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {amenities.map((item) =>
            item.value ? <li key={item.label}>✅ {item.label}</li> : null
          )}
        </ul>
      );

      return (
        <Tooltip title={tooltipContent} placement="right">
          <div className="leading-6 cursor-pointer">
            <div>👥 {record.khach} guests</div>
            <div>🛏 {record.phongNgu} bedrooms</div>
            <div>🛌 {record.giuong} beds</div>
            <div>🚿 {record.phongTam} bathrooms</div>
          </div>
        </Tooltip>
      );
    },
    filters: [
      { text: '1 Guest', value: 'khach_1' },
      { text: '2 Guests', value: 'khach_2' },
      { text: '3+ Guests', value: 'khach_3+' },
      { text: '1 Bedroom', value: 'phongNgu_1' },
      { text: '2 Bedrooms', value: 'phongNgu_2' },
      { text: '3+ Bedrooms', value: 'phongNgu_3+' },
      { text: '1 Bed', value: 'giuong_1' },
      { text: '2 Beds', value: 'giuong_2' },
      { text: '3+ Beds', value: 'giuong_3+' },
      { text: '1 Bathroom', value: 'phongTam_1' },
      { text: '2 Bathrooms', value: 'phongTam_2' },
      { text: '3+ Bathrooms', value: 'phongTam_3+' },
    ],
    onFilter: (value: any, record: Room) => {
      const [field, val] = String(value).split('_');
      if (field === 'khach') {
        return val === '3+'
          ? record.khach >= 3
          : record.khach === parseInt(val);
      }
      if (field === 'phongNgu') {
        return val === '3+'
          ? record.phongNgu >= 3
          : record.phongNgu === parseInt(val);
      }
      if (field === 'giuong') {
        return val === '3+'
          ? record.giuong >= 3
          : record.giuong === parseInt(val);
      }
      if (field === 'phongTam') {
        return val === '3+'
          ? record.phongTam >= 3
          : record.phongTam === parseInt(val);
      }
      return true;
    },
  },
  {
    title: 'Price',
    dataIndex: 'giaTien',
    key: 'giaTien',
    width: 100,
    sorter: (a: Room, b: Room) => a.giaTien - b.giaTien,
    render: (value: number) =>
      value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
  },
  {
    title: 'Description',
    dataIndex: 'moTa',
    key: 'moTa',
    render: (text: string) => (
      <Tooltip title={text}>
        <div
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 250,
            cursor: 'pointer',
          }}
        >
          {text}
        </div>
      </Tooltip>
    ),
  },

  {
    title: 'Actions',
    key: 'actions',
    render: (_, record: Room) => (
      <Space size="middle">
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          type="primary"
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
        >
          Edit
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
          danger
          style={{
            backgroundColor: '#ff4d4f',
            borderColor: '#ff4d4f',
            color: '#fff',
          }}
        >
          Delete
        </Button>
      </Space>
    ),
  },
];
