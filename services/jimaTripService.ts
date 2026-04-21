import api from "@/lib/api"

export interface JimaTrip {
  id: number
  sale_id: number
  scheduled_date: string
  trip_number: number
  guide_path: string | null
  weigh_path: string | null
  kilos: number | null
  status: "programado" | "completado"
  created_at: string
}

export const jimaTripService = {
  getAll: async (): Promise<JimaTrip[]> => {
    const { data } = await api.get("/jima-trips")
    return Array.isArray(data?.data) ? data.data : []
  },

  getBySale: async (saleId: number): Promise<JimaTrip[]> => {
    const { data } = await api.get(`/jima-trips?sale_id=${saleId}`)
    return Array.isArray(data?.data) ? data.data : []
  },

  schedule: async (saleId: number, scheduledDate: string, numTrips: number): Promise<JimaTrip[]> => {
    const { data } = await api.post("/jima-trips", {
      sale_id:        saleId,
      scheduled_date: scheduledDate,
      num_trips:      numTrips,
    })
    return Array.isArray(data?.data) ? data.data : []
  },

  updateDate: async (tripId: number, date: string): Promise<JimaTrip> => {
    const { data } = await api.patch(`/jima-trips/${tripId}`, { scheduled_date: date })
    return data.data
  },

  deleteTrip: async (tripId: number): Promise<void> => {
    await api.delete(`/jima-trips/${tripId}`)
  },

  uploadGuide: async (tripId: number, file: File): Promise<JimaTrip> => {
    const form = new FormData()
    form.append("guide", file)
    const { data } = await api.post(`/jima-trips/${tripId}/upload-guide`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data.data
  },

  getGuideUrl: async (tripId: number): Promise<string> => {
    const { data } = await api.get(`/jima-trips/${tripId}/guide-url`, {
      responseType: "blob",
    })
    return URL.createObjectURL(data)
  },

  uploadWeigh: async (tripId: number, file: File, kilos: number): Promise<JimaTrip> => {
    const form = new FormData()
    form.append("weigh", file)
    form.append("kilos", String(kilos))
    const { data } = await api.post(`/jima-trips/${tripId}/upload-weigh`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data.data
  },

  getWeighUrl: async (tripId: number): Promise<string> => {
    const { data } = await api.get(`/jima-trips/${tripId}/weigh-url`, {
      responseType: "blob",
    })
    return URL.createObjectURL(data)
  },
}
