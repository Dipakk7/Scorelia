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
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for HttpOnly cookie authentication in FastAPI
})

// Request Interceptor: Inject JWT token and log structured request metadata
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      payload: config.data,
      headers: config.headers,
    })
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
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

// Response Interceptor: Handle 401 errors, token refresh, transient retries, and unified logging
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, {
      data: response.data,
    })
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config

    console.error(`[API Response Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
      status: error.response?.status,
      message: error.message,
      code: error.code,
      data: error.response?.data,
    })

    if (!originalRequest) {
      return Promise.reject(formatAxiosError(error))
    }

    // Network Retry Logic for Safe (GET) requests on transient errors (network down, 502/503/504)
    const isSafeToRetry = originalRequest.method?.toUpperCase() === 'GET'
    const isTransientError = !error.response || [502, 503, 504].includes(error.response.status)
    const hasAlreadyRetriedNetwork = (originalRequest as any)._networkRetry

    if (isSafeToRetry && isTransientError && !hasAlreadyRetriedNetwork) {
      ;(originalRequest as any)._networkRetry = true
      console.warn(`[API Retry] Safe request encountered transient error. Retrying once: ${originalRequest.url}`)
      try {
        return await api(originalRequest)
      } catch (retryErr) {
        return Promise.reject(formatAxiosError(retryErr as AxiosError))
      }
    }

    // If request has already been retried, reject it
    if ((originalRequest as any)._retry) {
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
    const detailStr = typeof data?.detail === 'string' ? data.detail : JSON.stringify(data?.detail || '')
    const msgStr = (data?.message || error.message || '').toLowerCase()
    const detailLower = detailStr.toLowerCase()

    let friendlyMessage = data?.message || error.message || 'An error occurred on the server'

    if (error.response.status === 401) {
      friendlyMessage = 'AI provider authentication failed. Please check credentials.'
    } else if (error.response.status === 403) {
      friendlyMessage = 'Access denied. You do not have permission to access this resource.'
    } else if ([502, 503, 504].includes(error.response.status)) {
      friendlyMessage = 'Backend server is unavailable.'
    } else if (error.response.status === 422) {
      friendlyMessage = 'Invalid API configuration.'
    } else if (error.response.status === 500) {
      if (detailLower.includes('ollama') || detailLower.includes('provider') || msgStr.includes('ollama') || msgStr.includes('provider')) {
        friendlyMessage = 'Backend server is unavailable.'
      } else if (detailLower.includes('model') || msgStr.includes('model')) {
        friendlyMessage = 'Invalid API configuration.'
      } else if (detailLower.includes('timeout') || msgStr.includes('timeout')) {
        friendlyMessage = 'Request timed out.'
      } else if (detailLower.includes('interview') || msgStr.includes('interview')) {
        friendlyMessage = 'Interview service failed to initialize.'
      } else {
        friendlyMessage = 'Internal server error.'
      }
    }

    return {
      error: true,
      status_code: error.response.status,
      message: friendlyMessage,
      detail: data?.detail || null,
    }
  } else if (error.request) {
    const isTimeout = error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
    
    let friendlyMessage = 'No response received from the server. Please check your connection.'
    if (isTimeout) {
      friendlyMessage = 'Request timed out.'
    } else if (isOffline) {
      friendlyMessage = 'Network connection lost.'
    } else if (error.code === 'ERR_NETWORK' || error.message.toLowerCase().includes('network error') || error.message.toLowerCase().includes('refused')) {
      friendlyMessage = 'Backend server is unavailable.'
    }

    return {
      error: true,
      status_code: 0,
      message: friendlyMessage,
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
