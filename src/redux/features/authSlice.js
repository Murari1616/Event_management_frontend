// redux/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from "@/appConstants";

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  users: [],
  isLoading: false,
  error: null,
  status: null,
};


export const login = createAsyncThunk('user/login', async (user, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      const owner=data.data.user.owner? data.data.user.owner : 0;
      localStorage.setItem('owner', owner==1?'100':'');
      localStorage.setItem('isLoggedIn', 'true');
      return data.data;
    }
    return rejectWithValue(data.message);
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

export const registerUser = createAsyncThunk('auth/register', async (user, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (data.success) return data.data;
    return rejectWithValue(data.message);
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

export const getAllUsers = createAsyncThunk('users/getAll', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}user/getAllUsers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    if (data.success) return data.data;
    return rejectWithValue(data.message);
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

export const getUserById = createAsyncThunk('users/getById', async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}user/getUserById/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    if (data.success) return data.data;
    return rejectWithValue(data.message);
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.clear();
    },
    emptyError: (state) => { state.error = null; },
    emptyStatus: (state) => { state.status = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.status = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'fail';
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.status = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.status = 'success';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'fail';
        state.error = action.payload;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, emptyError, emptyStatus } = authSlice.actions;
export default authSlice.reducer;
