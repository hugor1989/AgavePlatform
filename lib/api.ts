import axios from 'axios'

// Crear instancia de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
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

    // -------------------------------
    // 🚀 DETECCIÓN REAL DE FORMDATA (iOS SAFE)
    // -------------------------------
    const isFormData =
      typeof FormData !== 'undefined' &&
      config.data &&
      (config.data instanceof FormData ||
        Object.prototype.toString.call(config.data) === '[object FormData]')

    if (isFormData) {
      // ❌ NO establecer content-type, Safari iOS lo revienta
      if (config.headers && config.headers['Content-Type']) {
        delete config.headers['Content-Type']
      }
    } else {
      // JSON normal
      if (config.data && typeof config.data === 'object') {
        config.headers['Content-Type'] = 'application/json'
      }
    }

    console.log('🚀 Axios Request Config:', {
      url: config.url,
      method: config.method,
      isFormData,
      headers: config.headers
    })

    return config
  },
  (error) => Promise.reject(error)
)

// ----------------------------
// RESPUESTA
// ----------------------------
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
      data: error.response?.data
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
