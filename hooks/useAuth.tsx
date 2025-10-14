'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { authService, Admin, LoginData, LoginResponse } from '@/services/authService'

interface AuthContextType {
  user: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginData) => Promise<LoginResponse> // 👈 CAMBIA AQUÍ
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  async function initializeAuth() {
    if (typeof window === 'undefined') return
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getProfile()
        setUser(userData)
      } catch (error) {
        console.error('Auth error:', error)
        await authService.logout()
        setUser(null)
      }
    }
    setIsLoading(false)
  }

  const login = async (credentials: LoginData): Promise<LoginResponse> => {
  setIsLoading(true)
  try {
    const response = await authService.login(credentials)
    if (response?.success && response?.data?.admin) {
      setUser(response.data.admin)
      return response
    } else {
      throw new Error(response?.message || 'Login failed')
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  } finally {
    setIsLoading(false)
  }
}

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
