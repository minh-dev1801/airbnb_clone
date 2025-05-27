import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../types/types';

interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms(state, action: PayloadAction<Room[]>) {
      state.rooms = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setRooms, setLoading, setError } = roomSlice.actions;
export default roomSlice.reducer;