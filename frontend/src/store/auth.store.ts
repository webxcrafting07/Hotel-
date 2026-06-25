import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import api from '@/lib/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setToken: (token) => set({ accessToken: token }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.data.user, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken, isAuthenticated: true })
        } finally {
          set({ isLoading: false })
        }
      },

      googleLogin: async (credential) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/google', { credential })
          set({ user: data.data.user, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken, isAuthenticated: true })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch {}
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.data, isAuthenticated: true })
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        }
      },

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'hotel-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated }),
    }
  )
)
