import { configureStore } from '@reduxjs/toolkit'
import searchSlice from "./slices/searchSlice"
import positionSlice from './slices/positionSlice'
import userSlice from './slices/userSlice'
import roomSlice from './slices/roomSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      search: searchSlice,
      position: positionSlice,
      user: userSlice,
      room: roomSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
