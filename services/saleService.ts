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
  created_at: string
  offer?: Offer
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
}
