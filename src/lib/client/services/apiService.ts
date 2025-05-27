import axiosInstance from './axiosInstance';
import {
  Comment,
  defaultRoom,
  Position,
  PostComment,
  Room,
  SignIn,
  SignUp,
  User,
  Booking,
  Coordinates,
  UpdateUser,
} from '../types/types';
import axios from 'axios';
import { DEFAULT_COORDINATES } from '../types/dataTypes';

export async function fetchPosition(): Promise<Position[]> {
  try {
    const response = await axiosInstance.get('/api/vi-tri');
    return Array.isArray(response.data.content) ? response.data.content : [];
  } catch (error) {
    throw error;
  }
}

export async function getPositionByPagination(
  pageIndex: string = '1',
  pageSize: string = '8',
  keyword: string = ''
): Promise<Position[]> {
  try {
    const response = await axiosInstance.get(
      `/api/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    );
    return Array.isArray(response.data.content.data)
      ? response.data.content.data
      : [];
  } catch (error) {
    throw error;
  }
}

export async function getRoomsByPosition(maViTri: string): Promise<Room[]> {
  try {
    if (!maViTri || maViTri.length === 0)
      throw new Error('Mã vị trí không hợp lệ');
    const response = await axiosInstance.get(
      `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${maViTri}`
    );
    return Array.isArray(response.data.content) ? response.data.content : [];
  } catch (error) {
    throw error;
  }
}

export async function getRoomsById(id: string): Promise<Room> {
  try {
    if (!id || id.length === 0) throw new Error('Mã phòng không hợp lệ');
    const response = await axiosInstance.get(`/api/phong-thue/${id}`);
    return response.data.content instanceof Object
      ? response.data.content
      : defaultRoom;
  } catch (error) {
    throw error;
  }
}

export async function getRoomsByUserId(id: string): Promise<Room[]> {
  try {
    if (!id || id.length === 0) throw new Error('Mã người dùng không hợp lệ');
    const response = await axiosInstance.get(
      `/api/dat-phong/lay-theo-nguoi-dung/${id}`
    );
    return response.data.content instanceof Array
      ? response.data.content
      : defaultRoom;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    if (!id || id.length === 0) throw new Error('Mã người dùng không hợp lệ');
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data.content;
  } catch (error) {
    throw error;
  }
}

export async function getCommentsById(id: string): Promise<Comment[]> {
  try {
    if (!id || id.length === 0) throw new Error('Mã phòng không hợp lệ');
    const response = await axiosInstance.get(
      `/api/binh-luan/lay-binh-luan-theo-phong/${id}`
    );
    return response.data.content instanceof Array ? response.data.content : [];
  } catch (error) {
    throw error;
  }
}

export async function getCoordinatesByCity(city: string): Promise<Coordinates> {
  try {
    if (!city || city.trim().length === 0)
      throw new Error('Tên thành phố không được để trống');

    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: city,
          format: 'json',
          limit: 1,
          countrycodes: 'vn',
        },
      }
    );

    const result =
      Array.isArray(response.data) && response.data.length > 0
        ? response.data[0]
        : null;

    if (!result || !result.lat || !result.lon) {
      return {
        ...DEFAULT_COORDINATES,
        messageKey: 'coordinates_success',
      };
    }

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  } catch (error) {
    throw error;
  }
}

export async function createComment(data: PostComment): Promise<PostComment> {
  try {
    if (!data) throw new Error('Dữ liệu bình luận không hợp lệ');
    const response = await axiosInstance.post(`/api/binh-luan`, data);

    return response.data.content;
  } catch (error) {
    throw error;
  }
}

export async function updateAvatar(data: File): Promise<User> {
  try {
    if (!data) throw new Error('Dữ liệu không hợp lệ');

    const formData = new FormData();
    formData.append('formFile', data);

    const response = await axiosInstance.post(
      `/api/users/upload-avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.content;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}

export async function updateUserProfile(
  data: UpdateUser,
  id: string
): Promise<UpdateUser> {
  try {
    const response = await axiosInstance.put(`/api/users/${id}`, data);
    return response.data.content;
  } catch (error) {
    throw error;
  }
}
export async function createBooking(data: Booking): Promise<void> {
  try {
    if (!data) throw new Error('Dữ liệu đặt phòng không được để trống');

    const response = await axiosInstance.post(`/api/dat-phong`, data);

    if (response.data.statusCode !== 201) {
      throw new Error(response.data.message || 'Không thể đặt phòng');
    }
  } catch (error) {
    throw error;
  }
}

export async function signIn(
  data: SignIn
): Promise<{ token: string; user: User }> {
  try {
    const response = await axiosInstance.post(`/api/auth/signin`, data);

    if (response.statusText === 'OK') {
      const token = response.data.content.token;
      const user = response.data.content.user;

      return { token, user };
    } else {
      throw new Error(response.data.message || 'Không thể đăng nhập');
    }
  } catch (error) {
    throw error;
  }
}

export async function signUp(data: SignUp): Promise<{ user: User }> {
  try {
    const response = await axiosInstance.post('/api/auth/signup', data);

    if (response.statusText === 'OK') {
      const user = response.data.content;

      return { user };
    } else {
      throw new Error(response.data.message || 'Không thể đăng ký');
    }
  } catch (error) {
    throw error;
  }
}
