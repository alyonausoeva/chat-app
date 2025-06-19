import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registerInfo: {
    name: '',
    email: '',
    password: '',
  },
  registerError: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegisterInfo(state, action) {
      state.registerInfo = {
        ...state.registerInfo,
        ...action.payload,
      };
    },
    setRegisterError(state, action) {
      state.registerError = action.payload;
    },
  },
});

export const { setRegisterInfo, setRegisterError } = authSlice.actions;
export const authReducer = authSlice.reducer;
