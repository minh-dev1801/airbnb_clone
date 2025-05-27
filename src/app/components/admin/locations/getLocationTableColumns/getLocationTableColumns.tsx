import { ColumnsType } from "antd/es/table";
import { Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageCell from "../../ImageCell/ImageCell";
import { Location } from "@/app/types/location/location";

export const getLocationTableColumns = (
  handleEdit: (location: Location) => void,
  handleDelete: (locationId: number) => void
): ColumnsType<Location> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    align: "center",
    sorter: (a: Location, b: Location) => a.id - b.id,
  },
  {
    title: "Location Image",
    dataIndex: "hinhAnh",
    key: "hinhAnh",
    width: 150,
  
    render: (url: string) => <ImageCell url={url} />,
  },
  {
    title: "Location Name",
    dataIndex: "tenViTri",
    key: "tenViTri",
    render: (text: string) => (
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 200,
        }}
      >
        {text}
      </div>
    ),
    sorter: (a: Location, b: Location) => a.tenViTri.localeCompare(b.tenViTri),
  },
  {
    title: "Province/City",
    dataIndex: "tinhThanh",
    key: "tinhThanh",
    render: (text: string) => (
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 200,
        }}
      >
        {text}
      </div>
    ),
    sorter: (a: Location, b: Location) => a.tinhThanh.localeCompare(b.tinhThanh),
  },
  {
    title: "Country",
    dataIndex: "quocGia",
    key: "quocGia",
    render: (text: string) => (
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 200,
        }}
      >
        {text}
      </div>
    ),
    sorter: (a: Location, b: Location) => a.quocGia.localeCompare(b.quocGia),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record: Location) => (
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
          onClick={() => handleDelete(record.id)}
          danger
          style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff" }}
        >
          Delete
        </Button>
      </Space>
    ),
  },
];