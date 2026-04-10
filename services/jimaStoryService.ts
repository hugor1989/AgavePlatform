import api from "@/lib/api"

export interface JimaStory {
  id: number
  orchard_id: number
  farmer_id: number
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
}

export const jimaStoryService = {
  getAll: async (): Promise<JimaStory[]> => {
    const { data } = await api.get("/jima-stories")
    return Array.isArray(data?.data) ? data.data : []
  },

  create: async (orchardId: number, videoFile: File): Promise<JimaStory> => {
    const form = new FormData()
    form.append("orchard_id", String(orchardId))
    form.append("video", videoFile)
    const { data } = await api.post("/jima-stories", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
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
