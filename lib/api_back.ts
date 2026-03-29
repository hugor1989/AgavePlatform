import axios from 'axios'

// Crear instancia de Axios
const api = axios.create({
  baseURL: "https://backend.productoresageve.com.mx/api",
  headers: {
    'Accept': 'application/json',
    // ❌ NO establezcas Content-Type por defecto
    // 'Content-Type': 'application/json',
  },
})

// --- Manejo del token ---
let authToken: string | null = null

export const setAuthToken = (token: string) => {
  authToken = token
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearAuthToken = () => {
  authToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
  delete api.defaults.headers.common['Authorization']
}

// --- Cargar token almacenado al iniciar ---
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('auth_token')
  if (storedToken) {
    authToken = storedToken
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }
}

// --- Interceptores ---
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    
    // 🔥 CRÍTICO: Si es FormData, NO establecer Content-Type manualmente
    // El navegador lo pondrá automáticamente con el boundary correcto
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else if (config.data && typeof config.data === 'object') {
      // Para JSON, establecer Content-Type
      config.headers['Content-Type'] = 'application/json'
    }
    
    console.log('🚀 Axios Request Config:', {
      url: config.url,
      method: config.method,
      hasFormData: config.data instanceof FormData,
      headers: config.headers
    })
    
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', {
      status: response.status,
      url: response.config.url
    })
    return response
  },
  (error) => {
    console.error('❌ Axios Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.config?.headers
    })
    
    if (error.response) {
      const { status, data, config } = error.response

      if (status === 401 && !config.url.includes('/login')) {
        clearAuthToken()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }

      const customError = {
        success: false,
        status,
        message:
          data?.message ||
          (status === 403
            ? 'No tienes permisos para realizar esta acción.'
            : status === 404
            ? 'Recurso no encontrado.'
            : status === 422
            ? 'Error de validación en los datos.'
            : 'Ocurrió un error inesperado.'),
        errors: data?.errors || null,
      }

      return Promise.reject(customError)
    }

    return Promise.reject({
      success: false,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
    })
  }
)

export default api