import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GuestSSOState } from '../models/reducers/sso';

const initialState: GuestSSOState = {
  email: '',
  createLocally: false,
  isGuest: false,
  ssoEnable: false,
  isWelcome: false,
};

export const ssoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    ssoLogin: (state: GuestSSOState, action) => {
      const stateData = {
        ...initialState,
        email: action?.payload?.email,
        createLocally: true,
        ssoEnable: true,
        isWelcome: true,
      };
      return stateData;
    },
    ssoLogout: (state) => {
      return {
        ...state,
        email: '',
        createLocally: false,
        ssoEnable: false,
      };
    },
  },
});

export const { ssoLogout, ssoLogin } = ssoSlice.actions;
export default ssoSlice.reducer;
