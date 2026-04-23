import api from "@/lib/api"

export interface JimaStory {
  id: number
  orchard_id: number
  farmer_id: number
  company_id: number | null
  plant_quantity: number | null
  video_path: string
  expires_at: string
  is_expired: boolean
  created_at: string
  orchard?: {
    id: number
    name: string
    state: string
    municipality: string
    agave_type?: { id: number; name: string }
  }
  farmer?: {
    id: number
    full_name: string
    unique_identifier: string
  }
  company?: {
    id: number
    name: string
  }
}

export const jimaStoryService = {
  getAll: async (): Promise<JimaStory[]> => {
    const { data } = await api.get("/jima-stories")
    return Array.isArray(data?.data) ? data.data : []
  },

  create: async (
    orchardId: number,
    videoFile: File,
    companyId?: number | null,
    plantQuantity?: number | null,
  ): Promise<JimaStory> => {
    const form = new FormData()
    form.append("orchard_id", String(orchardId))
    form.append("video", videoFile)
    if (companyId) form.append("company_id", String(companyId))
    if (plantQuantity) form.append("plant_quantity", String(plantQuantity))
    const { data } = await api.post("/jima-stories", form)
    return data.data
  },

  getVideoUrl: async (storyId: number): Promise<string> => {
    const { data } = await api.get(`/jima-stories/${storyId}/video-url`, {
      responseType: "blob",
    })
    return URL.createObjectURL(data)
  },

  delete: async (storyId: number): Promise<void> => {
    await api.delete(`/jima-stories/${storyId}`)
  },
}
