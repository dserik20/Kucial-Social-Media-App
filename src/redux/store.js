import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    // other reducers go here
  },
});

export default store;
