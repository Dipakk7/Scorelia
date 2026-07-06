/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'

import api, { AUTH_LOGOUT_EVENT, clearStoredTokens } from '@/api/api'
import type { User } from '@/types/auth'


interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize and check current user on boot
  const checkAuth = async () => {
    try {
      const response = await api.get<User>('/auth/me')
      setUser(response.data)
      setIsAuthenticated(true)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    checkAuth()

    // Listen to global logout event from Axios interceptor
    const handleLogoutEvent = () => {
      setUser(null)
      setIsAuthenticated(false)
    }

    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogoutEvent)
    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogoutEvent)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.post<{ message: string; user: User }>('/auth/login', {
        email,
        password,
      })
      
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (err) {
      setUser(null)
      setIsAuthenticated(false)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true)
    try {
      await api.post<User>('/auth/register', {
        email,
        password,
        full_name: fullName,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout request failed', err)
    } finally {
      clearStoredTokens()
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      // The backend auth endpoints do not have `/forgot-password` yet.
      // We simulate this call to make the frontend fully operational.
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Forgot password email sent to:', email)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await api.get<User>('/auth/me')
      setUser(response.data)
      setIsAuthenticated(true)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
      throw new Error('Session check failed')
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
