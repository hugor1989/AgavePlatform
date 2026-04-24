import api from "@/lib/api"
import { Offer } from "./offerService"

export interface OrchardSale {
  id: number
  offer_id: number
  orchard_id: number
  company_id: number
  farmer_id: number
  company_price: number
  farmer_price: number
  sold_at: string
  status: string
  finished_at: string | null
  created_at: string
  offer?: Offer
  orchard?: {
    id: number
    name: string
    orchard_number: string | null
    state: string
    municipality: string
    plant_quantity: number
    year: number
    age: number
    cover_photo: string | null
    photo_id: string | null
    extra_photo: string | null
    location_url: string | null
    agave_type?: { id: number; name: string }
  }
  company?: {
    id: number
    business_name: string
    email: string
    phone: string
  }
  farmer?: {
    id: number
    full_name: string
    unique_identifier: string
    email: string
    phone: string
    rfc?: string
    clabe?: string
  }
}

export const saleService = {
  getAll: async (): Promise<OrchardSale[]> => {
    const { data } = await api.get("/sales")
    return Array.isArray(data?.data) ? data.data : []
  },

  getById: async (id: number | string): Promise<OrchardSale> => {
    const { data } = await api.get(`/sales/${id}`)
    return data.data
  },

  finish: async (id: number | string): Promise<OrchardSale> => {
    const { data } = await api.patch(`/sales/${id}/finish`)
    return data.data
  },
}
