import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../services/api'

export interface Project {
  id: number
  name: string
  description: string
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL'
  userId: number
  username: string
  createdAt: string
  updatedAt: string
  startDate?: string
  endDate?: string
  taskCount?: number
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
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

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
}

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/projects')
    return response.data.projects
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch projects'))
  }
})

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}`)
      return response.data.project
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch project'))
    }
  },
)

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'username' | 'taskCount'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/projects', projectData)
      return response.data.project
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create project'))
    }
  },
)

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, ...projectData }: { id: number } & Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData)
      return response.data.project
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update project'))
    }
  },
)

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}`)
      return projectId
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete project'))
    }
  },
)

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((project) => project.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project.id !== action.payload)
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null
        }
      })
  },
})

export const { clearError, clearCurrentProject } = projectSlice.actions
export default projectSlice.reducer
