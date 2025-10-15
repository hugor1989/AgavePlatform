import axios from 'axios'

// Crear instancia de Axios
const api = axios.create({
  baseURL: "https://backend.productoresageve.com.mx/api",
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// --- Manejo del token ---
let authToken: string | null = null

export const setAuthToken = (token: string) => {
  authToken = token

  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }

  // ✅ Actualiza inmediatamente el header de axios
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearAuthToken = () => {
  authToken = null

  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }

  // ✅ Limpia el header global
  delete api.defaults.headers.common['Authorization']
}

// Cargar token almacenado al iniciar
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('auth_token')
  if (storedToken) {
    authToken = storedToken
    // ✅ Cargarlo también al header si existe
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }
}

// --- Interceptores ---
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
