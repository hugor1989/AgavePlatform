import api from "@/lib/api"

export interface AgaveType {
  id: number
  name: string
  scientific_name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export const agaveTypeService = {
  /**
   * Obtener todos los tipos de agave
   */
  getAll: async (): Promise<AgaveType[]> => {
    const { data } = await api.get("/agave-type/get-all")
    return Array.isArray(data?.data) ? data.data : []
  },

  /**
   * Obtener un tipo de agave por ID
   */
  getById: async (id: number | string): Promise<AgaveType> => {
    const { data } = await api.get(`/agave-type/agave-types-id/${id}`)
    return data.data
  },

  /**
   * Buscar tipo de agave por nombre
   */
  findByName: async (name: string): Promise<AgaveType | null> => {
    const types = await agaveTypeService.getAll()
    return types.find(type => 
      type.name.toLowerCase() === name.toLowerCase()
    ) || null
  },
}