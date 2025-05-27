import { AxiosError } from "axios";
import { SWRConfiguration } from "swr";

export interface Position {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface PositionWithSlug extends Position {
  slug: string;
}

export interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
};

export const defaultRoom: Room = {
  id: 0,
  tenPhong: '',
  khach: 0,
  phongNgu: 0,
  giuong: 0,
  phongTam: 0,
  moTa: '',
  giaTien: 0,
  mayGiat: false,
  banLa: false,
  tivi: false,
  dieuHoa: false,
  wifi: false,
  bep: false,
  doXe: false,
  hoBoi: false,
  banUi: false,
  maViTri: 0,
  hinhAnh: '',
};

export interface Comment {
  id: number;
  ngayBinhLuan: Date;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiBinhLuan: string;
  avatar: string;
}

export interface PostComment {
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface SignUp {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  birthday?: string;
  gender?: boolean;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}

export interface UpdateUser {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
}

export interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  messageKey?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export type ApiError = AxiosError | Error;

export interface UseApiOptions<T, E extends ApiError> extends SWRConfiguration<T, E> {
  translate?: (key: string) => string;
}

export type SearchType = {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
} 

export interface BookingType {
  id: number;
  maPhong: number;
  ngayDen: Date;
  ngayDi: Date;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface CommentType {
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: Date;
  noiDung: string;
  saoBinhLuan: number;
}

export interface AvatarForm {
  avatar: FileList;
}


