import api from "@/lib/api"

export const companiService = {
  getAll: async () => {
    const { data } = await api.get("/companies/get-all-compani")

    // Laravel pagination: data.data.data = lista real
    return Array.isArray(data?.data) ? data.data : []
  },

  create: async (farmerData: any) => {
    const { data } = await api.post("/companies/create-compani", farmerData)
    return data
  },

  getById: async (id: number | string) => {
    const { data } = await api.get(`/companies/get-by-id/${id}`)
    return data
  },

  update: async (id: number | string, farmerData: any) => {
    const { data } = await api.put(`/companies/update/${id}`, farmerData)
    return data
  },

  delete: async (id: number | string) => {
    const { data } = await api.delete(`/companies/delete/${id}`)
    return data
  },
  verifyCode: async (otpData: any) => {
    const response = await api.post("/admin/verify-code", otpData)
    return response.data
  },

  resendOtp: async (userId: number | string) => {
    const response = await api.post("/admin/resend-otp", { user_type: "company", user_id: userId })
    return response.data
  },

  async resetPassword(payload: any) {
    return api.post(`/companies/reset-password`, payload)
  }
}
