import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    // other reducers can be added here
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
