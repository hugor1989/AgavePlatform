import api from "@/lib/api"

export const farmerService = {
  getAll: async () => {
    const { data } = await api.get("/farmer/get-all-farmer")

    // Laravel pagination: data.data.data = lista real
    return Array.isArray(data?.data?.data) ? data.data.data : []
  },

  // 🆕 NUEVO MÉTODO
  getActive: async () => {
    const { data } = await api.get("/farmer/active")
    return Array.isArray(data?.data) ? data.data : []
  },
  create: async (farmerData: any) => {
    const { data } = await api.post("/farmer/create-farmer", farmerData)
    return data
  },

  getById: async (id: number | string) => {
    const { data } = await api.get(`/farmer/get-by-id/${id}`)
    return data
  },

  update: async (id: number | string, farmerData: any) => {
    const { data } = await api.put(`/farmer/update/${id}`, farmerData)
    return data
  },

  delete: async (id: number | string) => {
    const { data } = await api.delete(`/farmer/delete/${id}`)
    return data
  },

  verifyCode: async (otpData: any) => {
    const response = await api.post("/admin/verify-code", otpData)
    return response.data
  },

  resendOtp: async (userId: number | string) => {
    const response = await api.post("/admin/resend-otp", { user_type: "farmer", user_id: userId })
    return response.data
  },

  async resetPassword(payload: any) {
    return api.post(`/farmer/reset-password`, payload)
  }

  

  
}
