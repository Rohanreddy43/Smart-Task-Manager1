import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import taskSlice from './slices/taskSlice'
import projectSlice from './slices/projectSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    projects: projectSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch