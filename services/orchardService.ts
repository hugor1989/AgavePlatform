import api from "@/lib/api"

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
  extra_photo: string | null
  state: string | null
  municipality: string | null
  latitude: number | null
  longitude: number | null
  status: string
  is_featured: boolean
  photos_count: number
  description: string | null
  price: number | null
  location_url: string | null
  created_at: string
  updated_at: string
  farmer?: {
    id: number
    full_name: string
    unique_identifier: string
    email?: string
    phone?: string
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
  extra_photo?: File | null
  state?: string
  municipality?: string
  latitude?: number
  longitude?: number
  status?: string
  is_featured?: boolean
  description?: string
  price?: number,
  location_url?: string
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

export const orchardService = {

  getAll: async (filters?: OrchardFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.year != null) params.append('year', String(filters.year))
    if (filters?.state) params.append('state', filters.state)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.featured != null) params.append('featured', String(filters.featured))
    if (filters?.sort_by) params.append('sort_by', filters.sort_by)
    if (filters?.sort_order) params.append('sort_order', filters.sort_order)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.per_page) params.append('per_page', String(filters.per_page))

    const { data } = await api.get(`/orchards/get-all?${params.toString()}`)

    console.log('📦 [orchardService] getAll response data:', data)
    return data.data
  },

  catalog: async () => {
    const { data } = await api.get('/orchards/catalog')
    return data.data
  },
  getById: async (id: number | string) => {
    const { data } = await api.get(`/orchards/get-by-id/${id}`)
    return data.data
  },

  // --------------------------
  // CREAR HUERTA (iOS FIXED)
  // --------------------------
  create: async (orchardData: OrchardFormData) => {
    const formData = new FormData()

    formData.append('name', orchardData.name)
    formData.append('agave_type_id', String(orchardData.agave_type_id))
    formData.append('farmer_id', String(orchardData.farmer_id))
    formData.append('year', String(orchardData.year))
    formData.append('plant_quantity', String(orchardData.plant_quantity))
    formData.append('status', orchardData.status || 'disponible')

    if (orchardData.is_featured != null)
      formData.append('is_featured', orchardData.is_featured ? '1' : '0')

    if (orchardData.age != null) formData.append('age', String(orchardData.age))
    if (orchardData.state) formData.append('state', orchardData.state)
    if (orchardData.municipality) formData.append('municipality', orchardData.municipality)
    if (orchardData.latitude != null) formData.append('latitude', String(orchardData.latitude))
    if (orchardData.longitude != null) formData.append('longitude', String(orchardData.longitude))
    if (orchardData.description) formData.append('description', orchardData.description)
    if (orchardData.price != null) formData.append('price', String(orchardData.price))
    if (orchardData.location_url) formData.append('location_url', orchardData.location_url)

    if (orchardData.photo_id instanceof File)
      formData.append('photo_id', orchardData.photo_id)

    if (orchardData.cover_photo instanceof File)
      formData.append('cover_photo', orchardData.cover_photo)

    if (orchardData.extra_photo instanceof File)
      formData.append('extra_photo', orchardData.extra_photo)

    const { data } = await api.post('/orchards/create-orchards', formData)
    return data.data
  },

  // -------------------------
  // ACTUALIZAR HUERTA (iOS FIXED)
  // -------------------------
  update: async (id: number | string, orchardData: Partial<OrchardFormData>) => {
    const formData = new FormData()
    formData.append('_method', 'PUT')

    if (orchardData.name) formData.append('name', orchardData.name)
    if (orchardData.agave_type_id != null)
      formData.append('agave_type_id', String(orchardData.agave_type_id))

    if (orchardData.farmer_id != null)
      formData.append('farmer_id', String(orchardData.farmer_id))

    if (orchardData.year != null)
      formData.append('year', String(orchardData.year))

    if (orchardData.plant_quantity != null)
      formData.append('plant_quantity', String(orchardData.plant_quantity))

    if (orchardData.status)
      formData.append('status', orchardData.status)

    if (orchardData.is_featured != null)
      formData.append('is_featured', orchardData.is_featured ? '1' : '0')

    if (orchardData.age != null)
      formData.append('age', String(orchardData.age))

    if (orchardData.state)
      formData.append('state', orchardData.state)

    if (orchardData.municipality)
      formData.append('municipality', orchardData.municipality)

    if (orchardData.latitude != null)
      formData.append('latitude', String(orchardData.latitude))

    if (orchardData.longitude != null)
      formData.append('longitude', String(orchardData.longitude))

    if (orchardData.location_url != null)
      formData.append('location_url', String(orchardData.location_url))


    if (orchardData.photo_id instanceof File)
      formData.append('photo_id', orchardData.photo_id)

    if (orchardData.cover_photo instanceof File)
      formData.append('cover_photo', orchardData.cover_photo)

    if (orchardData.extra_photo instanceof File)
      formData.append('extra_photo', orchardData.extra_photo)

    // ❌ NO headers → iOS-friendly
    const { data } = await api.post(`/orchards/updare-data/${id}`, formData)
    return data.data
  },

  delete: async (id: number | string) => {
    const { data } = await api.delete(`/orchards/delete/${id}`)
    return data
  },

  getPhotoUrl: (photoPath: string | null) => {
    if (!photoPath) return null
    const baseURL = api.defaults.baseURL?.replace('/api', '') || ''
    return `${baseURL}/storage/${photoPath}`
  }
}
