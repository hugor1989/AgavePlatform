import api from "@/lib/api"

// Interfaces (sin cambios)
export interface Orchard {
  id: number
  name: string
  agave_type_id: number
  farmer_id: number
  year: number
  age: number
  plant_quantity: number
  photo_id: string | null
  cover_photo: string | null
  state: string | null
  municipality: string | null
  latitude: number | null
  longitude: number | null
  status: string
  is_featured: boolean
  photos_count: number
  description: string | null
  price: number | null
  created_at: string
  updated_at: string
  farmer?: {
    id: number
    full_name: string
    unique_identifier: string
  }
  agave_type?: {
    id: number
    name: string
  }
  location?: string
  age_formatted?: string
}

export interface OrchardFormData {
  name: string
  agave_type_id: number
  farmer_id: number
  year: number
  age?: number
  plant_quantity: number
  photo_id?: File | null
  cover_photo?: File | null
  state?: string
  municipality?: string
  latitude?: number
  longitude?: number
  status?: string
  is_featured?: boolean
  description?: string
  price?: number
}

export interface OrchardFilters {
  search?: string
  year?: number
  state?: string
  status?: string
  featured?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: any[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// 🆕 Función helper para convertir File a Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remover el prefijo "data:image/jpeg;base64," para enviar solo el base64
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

export const orchardService = {
  /**
   * Obtener todas las huertas con filtros
   */
  getAll: async (filters?: OrchardFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.year) params.append('year', String(filters.year))
    if (filters?.state) params.append('state', filters.state)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured))
    if (filters?.sort_by) params.append('sort_by', filters.sort_by)
    if (filters?.sort_order) params.append('sort_order', filters.sort_order)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.per_page) params.append('per_page', String(filters.per_page))

    const { data } = await api.get(`/orchards/get-all?${params.toString()}`)
    return data.data as PaginatedResponse<Orchard>
  },

  /**
   * Obtener una huerta por ID
   */
  getById: async (id: number | string) => {
    const { data } = await api.get(`/orchards/${id}`)
    return data.data as Orchard
  },

  /**
   * Crear nueva huerta - USANDO BASE64 EN LUGAR DE FORMDATA
   */
  create: async (orchardData: OrchardFormData) => {
    console.log('🔵 [orchardService.create] Iniciando...')
    
    try {
      // Preparar datos base (sin archivos)
      const payload: any = {
        name: orchardData.name,
        agave_type_id: orchardData.agave_type_id,
        farmer_id: orchardData.farmer_id,
        year: orchardData.year,
        plant_quantity: orchardData.plant_quantity,
        status: orchardData.status || 'disponible',
        is_featured: 1,
      }

      // Agregar campos opcionales
      if (orchardData.age !== undefined) payload.age = orchardData.age
      if (orchardData.state) payload.state = orchardData.state
      if (orchardData.municipality) payload.municipality = orchardData.municipality
      if (orchardData.latitude) payload.latitude = orchardData.latitude
      if (orchardData.longitude) payload.longitude = orchardData.longitude
      if (orchardData.description) payload.description = orchardData.description
      if (orchardData.price) payload.price = orchardData.price

      // 🆕 Convertir photo_id a Base64
      if (orchardData.photo_id) {
        console.log('📸 [orchardService] Convirtiendo photo_id a Base64...')
        const base64 = await fileToBase64(orchardData.photo_id)
        payload.photo_id_base64 = base64
        payload.photo_id_name = orchardData.photo_id.name
        payload.photo_id_type = orchardData.photo_id.type
        console.log('✅ [orchardService] photo_id convertido')
      }

      // 🆕 Convertir cover_photo a Base64
      if (orchardData.cover_photo) {
        console.log('📸 [orchardService] Convirtiendo cover_photo a Base64...')
        const base64 = await fileToBase64(orchardData.cover_photo)
        payload.cover_photo_base64 = base64
        payload.cover_photo_name = orchardData.cover_photo.name
        payload.cover_photo_type = orchardData.cover_photo.type
        console.log('✅ [orchardService] cover_photo convertido')
      }

      console.log('📦 [orchardService] Enviando payload como JSON:', {
        ...payload,
        photo_id_base64: payload.photo_id_base64 ? `[Base64 string ${payload.photo_id_base64.length} chars]` : undefined,
        cover_photo_base64: payload.cover_photo_base64 ? `[Base64 string ${payload.cover_photo_base64.length} chars]` : undefined,
      })

      // 🆕 Enviar como JSON en lugar de FormData
      const { data } = await api.post('/orchards/create-orchards', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('✅ [orchardService] Respuesta recibida:', data)
      return data.data as Orchard

    } catch (error: any) {
      console.error('❌ [orchardService] Error:', error)
      console.error('❌ [orchardService] Response:', error.response?.data)
      throw error
    }
  },

  /**
   * Actualizar huerta - USANDO BASE64
   */
  update: async (id: number | string, orchardData: Partial<OrchardFormData>) => {
    console.log('🔵 [orchardService.update] Iniciando...')
    
    try {
      const payload: any = { ...orchardData }

      // Convertir is_featured a string
      if (payload.is_featured !== undefined) {
        payload.is_featured = payload.is_featured ? '1' : '0'
      }

      // 🆕 Convertir photo_id a Base64 si es un File
      if (orchardData.photo_id && orchardData.photo_id instanceof File) {
        console.log('📸 [orchardService] Convirtiendo photo_id a Base64...')
        const base64 = await fileToBase64(orchardData.photo_id)
        payload.photo_id_base64 = base64
        payload.photo_id_name = orchardData.photo_id.name
        payload.photo_id_type = orchardData.photo_id.type
        delete payload.photo_id
        console.log('✅ [orchardService] photo_id convertido')
      }

      // 🆕 Convertir cover_photo a Base64 si es un File
      if (orchardData.cover_photo && orchardData.cover_photo instanceof File) {
        console.log('📸 [orchardService] Convirtiendo cover_photo a Base64...')
        const base64 = await fileToBase64(orchardData.cover_photo)
        payload.cover_photo_base64 = base64
        payload.cover_photo_name = orchardData.cover_photo.name
        payload.cover_photo_type = orchardData.cover_photo.type
        delete payload.cover_photo
        console.log('✅ [orchardService] cover_photo convertido')
      }

      console.log('📦 [orchardService] Enviando payload de actualización')

      // 🆕 Enviar como JSON
      const { data } = await api.put(`/orchards/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('✅ [orchardService] Actualización exitosa')
      return data.data as Orchard

    } catch (error: any) {
      console.error('❌ [orchardService] Error en update:', error)
      throw error
    }
  },

  /**
   * Eliminar huerta
   */
  delete: async (id: number | string) => {
    const { data } = await api.delete(`/orchards/${id}`)
    return data
  },

  /**
   * Alternar estado destacado
   */
  toggleFeatured: async (id: number | string) => {
    const { data } = await api.post(`/orchards/${id}/toggle-featured`)
    return data.data as Orchard
  },

  /**
   * Obtener estadísticas
   */
  getStatistics: async () => {
    const { data } = await api.get('/orchards/statistics')
    return data.data
  },

  /**
   * Obtener huertas públicas
   */
  getPublic: async (filters?: OrchardFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.year) params.append('year', String(filters.year))
    if (filters?.state) params.append('state', filters.state)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.per_page) params.append('per_page', String(filters.per_page))

    const { data } = await api.get(`/public/orchards?${params.toString()}`)
    return data.data as PaginatedResponse<Orchard>
  },

  /**
   * Obtener URL de foto
   */
  getPhotoUrl: (photoPath: string | null) => {
    if (!photoPath) return null
    const baseURL = api.defaults.baseURL?.replace('/api', '') || ''
    return `${baseURL}/storage/${photoPath}`
  },
}