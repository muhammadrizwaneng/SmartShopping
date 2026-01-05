import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiConfig from '../config/api-config';
import { CallServiceFor } from '../services/call_services_for';

interface AuthState {
  loading: boolean;
  userInfo: any;
  error: string | null;
  isLoggedIn: boolean;
  token: any
}

const initialState: AuthState = {
  loading: false,
  userInfo: null,
  error: null,
  isLoggedIn: false,
  token: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: any,) => {
    console.log('Login payload:', email, password);
    try {
      const urlFor = ApiConfig.BASE_URL + ApiConfig.LOGIN;
      const keyFor = {
        email,
        password,
      };
      console.log('urlFor:', urlFor);

      const response = await CallServiceFor(urlFor, 'post', keyFor);
      console.log('response:', response?.status);
      console.log('response:access_token', response?.data?.access_token);

      if (response.status == 200) {
        const accessToken = response?.data?.access_token;
        AsyncStorage.setItem('token', accessToken);
        return response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return error.response.data;
    }
  }
);

// Async thunk for guest login
export const guestLogin = createAsyncThunk(
  'auth/guestLogin',
  async (_, { dispatch }) => {
    const randomId = Math.floor(Math.random() * 10000);
    const guestData = {
      name: `Guest User ${randomId}`,
      email: `guest_${randomId}@smartshopping.com`,
      password: 'GuestPassword123',
      confirmPassword: 'GuestPassword123',
      phoneNumber: '0000000000',
      role: 'user',
    };

    try {
      const response = await CallServiceFor(ApiConfig.SIGNUP, 'post', guestData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Guest signup failed');
      }
    } catch (error: any) {
      console.error('Guest login error:', error);
      throw error;
    }
  }
);

export const logoutUser: any = createAsyncThunk('SeeBiz/Logout', async () => {
  return true;
  //return {email, password};
});




const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    setSignupSuccess: (state, action) => {
      console.log('action.payload:', action);
      const { user, token } = action.payload;

      state.userInfo = user;
      state.token = token;
      state.isLoggedIn = true;

      // store data in AsyncStorage
      AsyncStorage.setItem(
        'userData',
        JSON.stringify({ user, token, isLoggedIn: true })
      );
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action: any) => {
      console.log('Login Success:', action.payload);
      console.log('action.payload.access_token Success:', action.payload.access_token);

      // Store user data and token in AsyncStorage
      const userData = {
        user: action.payload.user,
        token: action.payload.access_token,
        isLoggedIn: true,
      };

      AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Update state
      state.loading = false;
      state.isLoggedIn = true;
      state.userInfo = action.payload.user || {};
      state.token = action.payload.access_token;
    });

    builder.addCase(loginUser.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    });

    // GUEST LOGIN
    builder.addCase(guestLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(guestLogin.fulfilled, (state, action: any) => {
      console.log('Guest Login Success:', action.payload);

      const userData = {
        user: action.payload.user || action.payload,
        token: action.payload.access_token,
        isLoggedIn: true,
      };

      AsyncStorage.setItem('userData', JSON.stringify(userData));

      state.loading = false;
      state.isLoggedIn = true;
      state.userInfo = action.payload.user || action.payload;
      state.token = action.payload.access_token;
    });

    builder.addCase(guestLogin.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Guest login failed';
      state.isLoggedIn = false;
    });

    // LOGOUT
    builder.addCase(logoutUser.fulfilled, (state) => {
      // Reset all state to initial values
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        token: null,
        loading: false,
        error: null,
      };
    });
  },
});

export default authSlice.reducer;
export const { setUserInfo, setSignupSuccess } = authSlice.actions;
