import api from "@/lib/api"

export interface Offer {
  id: number
  orchard_id: number
  company_id: number
  price: number
  jima_cm: number
  financing_months: number
  harvest_date: string
  min_kilos: number
  payment_terms: string
  logistics: string
  farmer_price: number | null
  farmer_notified: boolean
  admin_notes: string | null
  status: "pendiente" | "revisada" | "aceptada" | "rechazada"
  created_at: string
  updated_at: string
  orchard?: {
    id: number
    name: string
    state: string
    municipality: string
    plant_quantity: number
    year: number
    age: number
    cover_photo: string | null
    agave_type?: { id: number; name: string }
    farmer?: { id: number; full_name: string; unique_identifier: string; email: string; phone: string }
  }
  company?: {
    id: number
    business_name: string
    email: string
    phone: string
  }
}

export interface OfferFormData {
  orchard_id: number
  price: number
  jima_cm: number
  financing_months: number
  harvest_date: string
  min_kilos: number
  payment_terms: string
  logistics: string
}

export const offerService = {
  getAll: async (status?: string): Promise<Offer[]> => {
    const params = status ? `?status=${status}` : ""
    const { data } = await api.get(`/offers${params}`)
    return Array.isArray(data?.data) ? data.data : []
  },

  getById: async (id: number | string): Promise<Offer> => {
    const { data } = await api.get(`/offers/${id}`)
    return data.data
  },

  create: async (offerData: OfferFormData): Promise<Offer> => {
    const { data } = await api.post("/offers", offerData)
    return data.data
  },

  updateStatus: async (id: number | string, status: "aceptada" | "rechazada"): Promise<Offer> => {
    const { data } = await api.patch(`/offers/${id}/status`, { status })
    return data.data
  },

  notifyFarmer: async (id: number | string, farmerPrice: number, adminNotes?: string): Promise<Offer> => {
    const { data } = await api.post(`/offers/${id}/notify-farmer`, {
      farmer_price: farmerPrice,
      admin_notes: adminNotes,
    })
    return data.data
  },
}
