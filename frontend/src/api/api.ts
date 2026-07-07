import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'


// Define the API Error response structure
export interface ApiErrorDetail {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorResponse {
  error: boolean
  status_code: number
  message: string
  detail?: ApiErrorDetail[] | string | null
}

// Create custom event to handle logging out from outside components
export const AUTH_LOGOUT_EVENT = 'scorelia-auth-logout'

// Access token and refresh token storage key (for header-based token system if used)
const ACCESS_TOKEN_KEY = 'scorelia_access_token'
const REFRESH_TOKEN_KEY = 'scorelia_refresh_token'

export const getStoredAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setStoredAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const clearStoredTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for HttpOnly cookie authentication in FastAPI
})

// Request Interceptor: Inject JWT token if using header-based auth
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Store the active refresh promise to prevent multiple refresh calls simultaneously
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// Response Interceptor: Handle 401 errors, token refresh, and unified error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config

    // If request has already been retried, reject it
    if (!originalRequest || (originalRequest as any)._retry) {
      return Promise.reject(formatAxiosError(error))
    }

    const statusCode = error.response?.status

    // Handle 401 Unauthorized (Token expired or missing)
    if (statusCode === 401) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

      // If we are using header-based JWT with a refresh token
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true
          ;(originalRequest as any)._retry = true

          try {
            // Note: If backend implements refresh token rotation in the future
            const response = await axios.post(
              `${api.defaults.baseURL}/auth/refresh`,
              { refresh_token: refreshToken },
              { withCredentials: true }
            )

            const { access_token, new_refresh_token } = response.data
            setStoredAccessToken(access_token)
            if (new_refresh_token) {
              localStorage.setItem(REFRESH_TOKEN_KEY, new_refresh_token)
            }

            isRefreshing = false
            onRefreshed(access_token)

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`
            }
            return api(originalRequest)
          } catch (refreshErr) {
            isRefreshing = false
            clearStoredTokens()
            window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
            return Promise.reject(formatAxiosError(refreshErr as AxiosError))
          }
        }

        // If another request is currently refreshing the token, wait for it
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      } else {
        // If cookie-based auth is used and `/me` returns 401, or no refresh token is present, logout
        clearStoredTokens()
        window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
      }
    }

    return Promise.reject(formatAxiosError(error))
  }
)

/**
 * Standardize error responses to fit ApiErrorResponse interface
 */
export function formatAxiosError(error: AxiosError): ApiErrorResponse {
  if (error.response) {
    const data = error.response.data as any
    return {
      error: true,
      status_code: error.response.status,
      message: data?.message || error.message || 'An error occurred on the server',
      detail: data?.detail || null,
    }
  } else if (error.request) {
    return {
      error: true,
      status_code: 0,
      message: 'No response received from the server. Please check your connection.',
      detail: null,
    }
  } else {
    return {
      error: true,
      status_code: 0,
      message: error.message || 'Error occurred while setting up the request.',
      detail: null,
    }
  }
}

export default api
