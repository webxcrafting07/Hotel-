import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

import { useAuthStore } from '@/store/auth.store'

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const rToken = useAuthStore.getState().refreshToken
        const resp = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken: rToken }, { withCredentials: true })
        
        if (resp.data?.data?.accessToken) {
          useAuthStore.getState().setToken(resp.data.data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${resp.data.data.accessToken}`
        }

        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        if (typeof window !== 'undefined' && !['/login', '/signup'].includes(window.location.pathname)) {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const message = (error.response?.data as { message?: string })?.message || 'An error occurred'
    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
