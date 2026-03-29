import api from "@/lib/api"

// Interfaces (Se mantienen igual)
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
   * Crear nueva huerta - USANDO FORMDATA (Corrección para iOS)
   */
  create: async (orchardData: OrchardFormData) => {
    console.log('🔵 [orchardService.create] Iniciando con FormData...')
    
    try {
      const formData = new FormData()

      // Agregar campos de texto
      formData.append('name', orchardData.name)
      formData.append('agave_type_id', String(orchardData.agave_type_id))
      formData.append('farmer_id', String(orchardData.farmer_id))
      formData.append('year', String(orchardData.year))
      formData.append('plant_quantity', String(orchardData.plant_quantity))
      formData.append('status', orchardData.status || 'disponible')
      
      // Manejo de booleano para FormData
      formData.append('is_featured', orchardData.is_featured ? '1' : '0')

      if (orchardData.age) formData.append('age', String(orchardData.age))
      if (orchardData.state) formData.append('state', orchardData.state)
      if (orchardData.municipality) formData.append('municipality', orchardData.municipality)
      if (orchardData.latitude) formData.append('latitude', String(orchardData.latitude))
      if (orchardData.longitude) formData.append('longitude', String(orchardData.longitude))
      if (orchardData.description) formData.append('description', orchardData.description)
      if (orchardData.price) formData.append('price', String(orchardData.price))

      // 📸 Agregar archivos DIRECTAMENTE (Tu backend ya sabe leer esto)
      if (orchardData.photo_id instanceof File) {
        console.log('📸 Agregando photo_id al FormData:', orchardData.photo_id.name)
        formData.append('photo_id', orchardData.photo_id)
      }

      if (orchardData.cover_photo instanceof File) {
        console.log('📸 Agregando cover_photo al FormData:', orchardData.cover_photo.name)
        formData.append('cover_photo', orchardData.cover_photo)
      }

      // Enviar como multipart/form-data
      const { data } = await api.post('/orchards/create-orchards', formData)


      console.log('✅ [orchardService] Respuesta recibida:', data)
      return data.data as Orchard

    } catch (error: any) {
      console.error('❌ [orchardService] Error:', error)
      throw error
    }
  },

  /**
   * Actualizar huerta - USANDO METHOD SPOOFING (_method: PUT)
   */
  update: async (id: number | string, orchardData: Partial<OrchardFormData>) => {
    console.log('🔵 [orchardService.update] Iniciando con FormData...')
    
    try {
      const formData = new FormData()

      // ⚡ TRUCO DE LARAVEL: Enviar POST pero simular PUT
      formData.append('_method', 'PUT')

      // Agregar campos si existen
      if (orchardData.name) formData.append('name', orchardData.name)
      if (orchardData.agave_type_id) formData.append('agave_type_id', String(orchardData.agave_type_id))
      if (orchardData.farmer_id) formData.append('farmer_id', String(orchardData.farmer_id))
      if (orchardData.year) formData.append('year', String(orchardData.year))
      if (orchardData.plant_quantity) formData.append('plant_quantity', String(orchardData.plant_quantity))
      if (orchardData.status) formData.append('status', orchardData.status)
      if (orchardData.is_featured !== undefined) {
         formData.append('is_featured', orchardData.is_featured ? '1' : '0')
      }
      
      if (orchardData.age) formData.append('age', String(orchardData.age))
      if (orchardData.state) formData.append('state', orchardData.state)
      if (orchardData.municipality) formData.append('municipality', orchardData.municipality)
      if (orchardData.latitude) formData.append('latitude', String(orchardData.latitude))
      if (orchardData.longitude) formData.append('longitude', String(orchardData.longitude))

      // Archivos
      if (orchardData.photo_id instanceof File) {
        formData.append('photo_id', orchardData.photo_id)
      }
      if (orchardData.cover_photo instanceof File) {
        formData.append('cover_photo', orchardData.cover_photo)
      }

      // NOTA: Usamos POST a la misma URL de update, Laravel leerá _method: PUT
      const { data } = await api.post(`/orchards/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

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