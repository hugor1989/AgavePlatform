'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { authService, User, LoginData, LoginResponse } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginData) => Promise<LoginResponse>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Restaurar sesión desde localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  // ✅ Login (guarda usuario y token)
  const login = async (credentials: LoginData): Promise<LoginResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      if (response.success && response.data) {
        setUser(response.data)
        localStorage.setItem('auth_user', JSON.stringify(response.data))
      }
      return response
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Logout (limpia localStorage)
  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      localStorage.removeItem('auth_user')
      setUser(null)
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
