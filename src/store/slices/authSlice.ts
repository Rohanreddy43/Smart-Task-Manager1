import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../services/api'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface ApiErrorResponse {
  message?: string
}

const getErrorMessage = (error: unknown, fallback = 'Request failed'): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message || fallback
}

const initialToken = localStorage.getItem('token')

const initialState: AuthState = {
  user: null,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  isLoading: false,
  error: null,
}

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      username: string
      email: string
      password: string
      firstName: string
      lastName: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Registration failed'))
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: {
      usernameOrEmail: string
      password: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { accessToken } = response.data
      localStorage.setItem('token', accessToken)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Invalid username or password'))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user ?? null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.accessToken
        state.user = action.payload.user ?? null
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
