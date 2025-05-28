export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  birthday: string | null; // Changed from string to string | null
  avatar: string;
  gender: boolean;
  role: string;
}
