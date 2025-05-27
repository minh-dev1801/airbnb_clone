import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PositionWithSlug } from '../../types/types';

const initialState: PositionWithSlug[] = [];

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    setPositions: (state, action: PayloadAction<PositionWithSlug[]>) => {
      return action.payload;
    },
  },
});

export const { setPositions } = positionSlice.actions;

export default positionSlice.reducer;
