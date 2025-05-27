import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/types';

const initialState: User = {
  id: undefined,
  name: '',
  email: '',
  password: '',
  phone: '',
  birthday: '',
  avatar: '',
  gender: false,
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>): User => {
      return action.payload;
    },
    clearUser: (): User => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
