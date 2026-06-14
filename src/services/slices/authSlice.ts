import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }) => {
    const res = await registerUserApi(data);

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await logoutApi();

  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');

  return null;
});

export const getUserThunk = createAsyncThunk('auth/getUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<{ name: string; email: string }>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

type TAuthState = {
  user: TUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuth: Boolean(getCookie('accessToken')),
  isLoading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    getIsAuth: (state) => state.isAuth,
    getUser: (state) => state.user,
    getError: (state) => state.error,
    getUserName: (state) => state.user?.name
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'login error';
      })

      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.error.message || 'register error';
      })

      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'logout error';
      })

      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'getUser error';
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'updateUser error';
      });
  }
});

export default authSlice.reducer;

export const { getIsAuth, getUser, getError, getUserName } =
  authSlice.selectors;
