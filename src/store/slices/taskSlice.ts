import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../services/api'

export interface Task {
  id: number
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL'
  complexity: 'SIMPLE' | 'MEDIUM' | 'COMPLEX' | 'EXPERT'
  userId: number
  username: string
  projectId?: number
  projectName?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  aiInsights?: string
  attachments?: unknown[]
  comments?: unknown[]
}

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  isLoading: boolean
  error: string | null
  statistics: {
    totalTasks: number
    inProgressTasks: number
    completedTasks: number
    averageEstimatedHours: number
  }
}

interface ApiErrorResponse {
  message?: string
}

const getErrorMessage = (error: unknown, fallback = 'Request failed'): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message || fallback
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  statistics: {
    totalTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    averageEstimatedHours: 0,
  },
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tasks')
    return response.data.tasks
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch tasks'))
  }
})

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/${taskId}`)
      return response.data.task
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch task'))
    }
  },
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'username'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/tasks', taskData)
      return response.data.task
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create task'))
    }
  },
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData }: { id: number } & Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData)
      return response.data.task
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update task'))
    }
  },
)

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async ({ id, actualHours }: { id: number; actualHours?: number }, { rejectWithValue }) => {
    try {
      const payload = actualHours !== undefined ? { actualHours } : {}
      const response = await api.put(`/tasks/${id}/complete`, payload)
      return response.data.task
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to complete task'))
    }
  },
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      return taskId
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete task'))
    }
  },
)

export const fetchTaskStatistics = createAsyncThunk(
  'tasks/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks/statistics')
      return response.data.statistics
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch task statistics'))
    }
  },
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentTask: (state) => {
      state.currentTask = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload)
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null
        }
      })
      .addCase(fetchTaskStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload
      })
  },
})

export const { clearError, clearCurrentTask } = taskSlice.actions
export default taskSlice.reducer
