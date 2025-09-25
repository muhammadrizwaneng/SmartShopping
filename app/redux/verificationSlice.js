import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showVerificationPopup: false,
};

export const stateSlice = createSlice({
  name: 'VerificationPopup',
  initialState,
  reducers: {
    enableVerificationPopup: (state) => {
      state.showVerificationPopup = true;
    },
    disableVerificationPopup: (state) => {
      state.showVerificationPopup = false;
    },
  },
});

export const { enableVerificationPopup, disableVerificationPopup } =
  stateSlice.actions;

export default stateSlice.reducer;
