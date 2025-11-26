    import api from "@/lib/api"

// Interfaces
export interface Orchard {
  id: number
  name: string
  agave_type_id: number
  farmer_id: number
  year: number
  age: number
  plant_quantity: number
  photo_id: string | null
  cover_photo: string | null       // ← NUEVO: Foto de portada
  state: string | null
  municipality: string | null
  latitude: number | null
  longitude: number | null
  status: 'disponible' | 'vendida' | 'reservada'
  is_featured: boolean
  photos_count: number
  description: string | null
  price: number | null
  created_at: string
  updated_at: string
  // Relaciones
  farmer?: {
    id: number
    full_name: string
    unique_identifier: string
    email: string
  }
  agave_type?: {
    id: number
    name: string
  }
  // Accessors
  location?: string
  age_formatted?: string
}

export interface OrchardFilters {
  search?: string
  year?: string | number
  state?: string
  status?: 'available' | 'sold' | 'reserved' | 'all'
  featured?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
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
  status?: 'disponible' | 'vendida' | 'reservada'
  is_featured?: boolean
  description?: string
  price?: number
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

export interface OrchardStats {
  total: number
  available: number
  sold: number
  reserved: number
  featured: number
  total_plants: number
  by_year: Array<{ year: number; count: number }>
  by_state: Array<{ state: string; count: number }>
}

export const orchardService = {
  /**
   * Obtener todas las huertas con filtros y paginación
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

    const { data } = await api.get(`/orchards/get-all/?${params.toString()}`)
    return data.data as PaginatedResponse<Orchard>
  },

  /**
   * Obtener años únicos de las huertas
   */
  getYears: async () => {
    const { data } = await api.get('/orchards/years')
    return data.data as number[]
  },
  /**
   * Obtener una huerta por ID
   */
  getById: async (id: number | string) => {
    const { data } = await api.get(`/orchards/get-by-id/${id}`)
    return data.data as Orchard
  },

  /**
   * Crear una nueva huerta
   */
  create: async (orchardData: OrchardFormData) => {
    const formData = new FormData()
    
    // Agregar campos básicos
    formData.append('name', orchardData.name)
    formData.append('agave_type_id', String(orchardData.agave_type_id))
    formData.append('farmer_id', String(orchardData.farmer_id))
    formData.append('year', String(orchardData.year))
    formData.append('plant_quantity', String(orchardData.plant_quantity))
    
    // Agregar campos opcionales
    if (orchardData.age !== undefined) formData.append('age', String(orchardData.age))
    if (orchardData.state) formData.append('state', orchardData.state)
    if (orchardData.municipality) formData.append('municipality', orchardData.municipality)
    if (orchardData.latitude !== undefined) formData.append('latitude', String(orchardData.latitude))
    if (orchardData.longitude !== undefined) formData.append('longitude', String(orchardData.longitude))
    if (orchardData.status) formData.append('status', orchardData.status)
    if (orchardData.is_featured !== undefined) formData.append('is_featured', orchardData.is_featured ? '1' : '0')
    if (orchardData.description) formData.append('description', orchardData.description)
    if (orchardData.price !== undefined) formData.append('price', String(orchardData.price))
    
    // Agregar imagen si existe
    if (orchardData.photo_id) {
      formData.append('photo_id', orchardData.photo_id)
    }

    if (orchardData.cover_photo) {
      formData.append('cover_photo', orchardData.cover_photo)
    }

    const { data } = await api.post('/orchards/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data as Orchard
  },

  /**
   * Actualizar una huerta
   */
  update: async (id: number | string, orchardData: Partial<OrchardFormData>) => {
    const formData = new FormData()
    
    // Laravel method spoofing
    formData.append('_method', 'PUT')
    
    // Agregar solo los campos que se están actualizando
    if (orchardData.name) formData.append('name', orchardData.name)
    if (orchardData.agave_type_id) formData.append('agave_type_id', String(orchardData.agave_type_id))
    if (orchardData.farmer_id) formData.append('farmer_id', String(orchardData.farmer_id))
    if (orchardData.year) formData.append('year', String(orchardData.year))
    if (orchardData.plant_quantity) formData.append('plant_quantity', String(orchardData.plant_quantity))
    if (orchardData.age !== undefined) formData.append('age', String(orchardData.age))
    if (orchardData.state) formData.append('state', orchardData.state)
    if (orchardData.municipality) formData.append('municipality', orchardData.municipality)
    if (orchardData.latitude !== undefined) formData.append('latitude', String(orchardData.latitude))
    if (orchardData.longitude !== undefined) formData.append('longitude', String(orchardData.longitude))
    if (orchardData.status) formData.append('status', orchardData.status)
    if (orchardData.is_featured !== undefined) formData.append('is_featured', orchardData.is_featured ? '1' : '0')
    if (orchardData.description) formData.append('description', orchardData.description)
    if (orchardData.price !== undefined) formData.append('price', String(orchardData.price))
    
    // Agregar imagen si existe
    if (orchardData.photo_id) {
      formData.append('photo_id', orchardData.photo_id)
    }

    if (orchardData.cover_photo) {
      formData.append('cover_photo', orchardData.cover_photo)
    }

    const { data } = await api.post(`/orchards/updare-data/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data as Orchard
  },

  /**
   * Eliminar una huerta
   */
  delete: async (id: number | string) => {
    const { data } = await api.delete(`/orchards/delete/${id}`)
    return data
  },

  /**
   * Marcar/desmarcar huerta como destacada
   */
  toggleFeatured: async (id: number | string) => {
    const { data } = await api.post(`/orchards/status/${id}/toggle-featured`)
    return data.data as Orchard
  },

  /**
   * Obtener estadísticas de huertas
   */
  getStatistics: async () => {
    const { data } = await api.get('/orchards/statistics')
    return data.data as OrchardStats
  },

  /**
   * Obtener huertas públicas (sin autenticación)
   */
  getPublic: async (filters?: OrchardFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.year) params.append('year', String(filters.year))
    if (filters?.state) params.append('state', filters.state)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.per_page) params.append('per_page', String(filters.per_page))

    const { data } = await api.get(`/public/orchards/get-all?${params.toString()}`)
    return data.data as PaginatedResponse<Orchard>
  },

  /**
   * Obtener URL completa de la imagen
   */
  getPhotoUrl: (photoPath: string | null) => {
    if (!photoPath) return null
    // Si ya es una URL completa, retornarla
    if (photoPath.startsWith('http')) return photoPath
    // Construir URL completa
    const baseUrl = api.defaults.baseURL?.replace('/api', '') || ''
    return `${baseUrl}/storage/${photoPath}`
  },
}