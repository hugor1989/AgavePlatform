import api from "@/lib/api"

export interface OrchardVideo {
  id: number
  orchard_id: number
  orchard_number: string
  heading_number: number
  line_number: number
  video_path: string
  original_filename: string
  uploaded_by: number
  video_url: string
  created_at: string
  updated_at: string
  orchard?: {
    id: number
    name: string
    orchard_number: string
  }
}

export const videoService = {
  getAll: async (filters?: { orchard_id?: number; orchard_number?: string }) => {
    const params = new URLSearchParams()
    if (filters?.orchard_id) params.append('orchard_id', String(filters.orchard_id))
    if (filters?.orchard_number) params.append('orchard_number', filters.orchard_number)
    const { data } = await api.get(`/orchard-videos?${params.toString()}`)
    return data.data as OrchardVideo[]
  },

  upload: async (file: File, onProgress?: (pct: number) => void) => {
    const formData = new FormData()
    formData.append('video', file)
    const { data } = await api.post('/orchard-videos', formData, {
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total))
        }
      },
      timeout: 3600000, // 1 hora — FFmpeg puede tardar varios minutos en el servidor
    })
    return data.data as OrchardVideo
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/orchard-videos/${id}`)
    return data
  },

  streamUrl: (id: number) => {
    const baseURL = api.defaults.baseURL || ''
    // Ruta pública — el <video> no puede enviar headers de auth
    return `${baseURL}/orchard-videos/${id}/stream`
  },
}
