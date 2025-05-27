import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const today = new Date();
const checkOutDate = new Date(today);
checkOutDate.setDate(today.getDate() + 7);

interface SearchState {
  location: string;
  guests: number;
  checkIn: string;
  checkOut: string;
}

const initialState: SearchState = {
  location: "",
  guests: 1,
  checkIn: today.toISOString(),
  checkOut: checkOutDate.toISOString(),
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<SearchState>) => {
      state.location = action.payload.location;
      state.guests = action.payload.guests;
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
    },
    clearSearch: (state) => {
      state.location = "";
      state.guests = 1;
      state.checkIn = today.toISOString();
      state.checkOut = checkOutDate.toISOString();
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
