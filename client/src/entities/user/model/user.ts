import { createSlice } from '@reduxjs/toolkit';

const initialState = null;
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, action) => action.payload,
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
