import { useState, useEffect } from 'react'
import { orchardService, Orchard, OrchardFormData, OrchardFilters } from '@/services/orchardService'
import { toast } from 'sonner'

interface UseOrchardsResult {
  orchards: Orchard[]
  years: number[]
  isLoading: boolean
  error: string | null
  createOrchard: (data: OrchardFormData) => Promise<{ success: boolean; error?: string }>
  updateOrchard: (id: number, data: Partial<OrchardFormData>) => Promise<{ success: boolean; error?: string }>
  deleteOrchard: (id: number) => Promise<{ success: boolean; error?: string }>
  updateFilters: (filters: OrchardFilters) => void
  refresh: () => void
}

export function useOrchards(initialFilters?: OrchardFilters): UseOrchardsResult {
  const [orchards, setOrchards] = useState<Orchard[]>([])
  const [years, setYears] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrchardFilters>(initialFilters || {})

  // Función para cargar huertas
  const loadOrchards = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔄 [useOrchards] Cargando huertas con filtros:', filters)
      const response = await orchardService.getAll(filters)
      
      console.log('✅ [useOrchards] Huertas cargadas:', response.data.length)
      setOrchards(response.data)
      
      // 🆕 Calcular años únicos localmente desde los datos
      const uniqueYears = [...new Set(response.data.map(o => o.year))]
      const sortedYears = uniqueYears.sort((a, b) => b - a) // Más reciente primero
      console.log('📅 [useOrchards] Años únicos:', sortedYears)
      setYears(sortedYears)
      
      setIsLoading(false)
    } catch (err: any) {
      console.error('❌ [useOrchards] Error cargando huertas:', err)
      setError(err.message || 'Error al cargar huertas')
      setIsLoading(false)
      toast.error('Error al cargar huertas')
    }
  }

  // Cargar huertas al montar y cuando cambien los filtros
  useEffect(() => {
    loadOrchards()
  }, [JSON.stringify(filters)])

  // Crear huerta
  const createOrchard = async (data: OrchardFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🆕 [useOrchards] Creando huerta...')
      const newOrchard = await orchardService.create(data)
      console.log('✅ [useOrchards] Huerta creada:', newOrchard.id)
      
      // Recargar lista
      await loadOrchards()
      
      toast.success('Huerta creada exitosamente')
      return { success: true }
    } catch (err: any) {
      console.error('❌ [useOrchards] Error creando huerta:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear huerta'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Actualizar huerta
  const updateOrchard = async (id: number, data: Partial<OrchardFormData>): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('✏️ [useOrchards] Actualizando huerta:', id)
      await orchardService.update(id, data)
      console.log('✅ [useOrchards] Huerta actualizada')
      
      // Recargar lista
      await loadOrchards()
      
      toast.success('Huerta actualizada exitosamente')
      return { success: true }
    } catch (err: any) {
      console.error('❌ [useOrchards] Error actualizando huerta:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar huerta'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Eliminar huerta
  const deleteOrchard = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🗑️ [useOrchards] Eliminando huerta:', id)
      await orchardService.delete(id)
      console.log('✅ [useOrchards] Huerta eliminada')
      
      // Recargar lista
      await loadOrchards()
      
      toast.success('Huerta eliminada exitosamente')
      return { success: true }
    } catch (err: any) {
      console.error('❌ [useOrchards] Error eliminando huerta:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar huerta'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Actualizar filtros
  const updateFilters = (newFilters: OrchardFilters) => {
    console.log('🔧 [useOrchards] Actualizando filtros:', newFilters)
    setFilters({ ...filters, ...newFilters })
  }

  // Refrescar datos
  const refresh = () => {
    console.log('🔄 [useOrchards] Refrescando datos...')
    loadOrchards()
  }

  return {
    orchards,
    years,
    isLoading,
    error,
    createOrchard,
    updateOrchard,
    deleteOrchard,
    updateFilters,
    refresh,
  }
}