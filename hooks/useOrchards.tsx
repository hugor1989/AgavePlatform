'use client'

import { useState, useEffect, useCallback } from 'react'
import { orchardService, Orchard, OrchardFilters, OrchardFormData, PaginatedResponse, OrchardStats } from '@/services/orchardService'
import { toast } from 'sonner'

export function useOrchards(initialFilters?: OrchardFilters) {
  const [orchards, setOrchards] = useState<Orchard[]>([])
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Orchard>, 'data'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrchardFilters>(initialFilters || {})
  const [years, setYears] = useState<number[]>([])  // ← NUEVO


  // Fetch orchards
  const fetchOrchards = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await orchardService.getAll(filters)
      setOrchards(response.data)
      const { data, ...paginationData } = response
      setPagination(paginationData)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las huertas')
      toast.error('Error al cargar las huertas')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // ← NUEVO: Fetch years
  const fetchYears = useCallback(async () => {
    try {
      const yearsData = await orchardService.getYears()
      setYears(yearsData)
    } catch (err) {
      console.error('Error loading years:', err)
    }
  }, [])
  // Fetch on mount and when filters change
  useEffect(() => {
    fetchOrchards()
    fetchYears()  // ← NUEVO
  }, [fetchOrchards, fetchYears])

  // Create orchard
  const createOrchard = async (orchardData: OrchardFormData) => {
    try {
      const newOrchard = await orchardService.create(orchardData)
      toast.success('Huerta creada exitosamente')
      await fetchOrchards() // Reload list
      return { success: true, data: newOrchard }
    } catch (err: any) {
      toast.error(err.message || 'Error al crear la huerta')
      return { success: false, error: err.message }
    }
  }

  // Update orchard
  const updateOrchard = async (id: number | string, orchardData: Partial<OrchardFormData>) => {
    try {
      const updatedOrchard = await orchardService.update(id, orchardData)
      toast.success('Huerta actualizada exitosamente')
      await fetchOrchards() // Reload list
      return { success: true, data: updatedOrchard }
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar la huerta')
      return { success: false, error: err.message }
    }
  }

  // Delete orchard
  const deleteOrchard = async (id: number | string) => {
    try {
      await orchardService.delete(id)
      toast.success('Huerta eliminada exitosamente')
      await fetchOrchards() // Reload list
      return { success: true }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar la huerta')
      return { success: false, error: err.message }
    }
  }

  // Toggle featured
  const toggleFeatured = async (id: number | string) => {
    try {
      const updatedOrchard = await orchardService.toggleFeatured(id)
      toast.success(updatedOrchard.is_featured ? 'Huerta marcada como destacada' : 'Huerta desmarcada como destacada')
      await fetchOrchards() // Reload list
      return { success: true, data: updatedOrchard }
    } catch (err: any) {
      toast.error('Error al actualizar el estado')
      return { success: false, error: err.message }
    }
  }

  // Update filters
  const updateFilters = (newFilters: Partial<OrchardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({})
  }

  // Go to page
  const goToPage = (page: number) => {
    updateFilters({ page })
  }

  return {
    orchards,
    pagination,
    isLoading,
    error,
    filters,
    years,
    fetchOrchards,
    createOrchard,
    updateOrchard,
    deleteOrchard,
    toggleFeatured,
    updateFilters,
    clearFilters,
    goToPage,
  }
}

// Hook para obtener una huerta específica
export function useOrchard(id: number | string | null) {
  const [orchard, setOrchard] = useState<Orchard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const fetchOrchard = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await orchardService.getById(id)
        setOrchard(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar la huerta')
        toast.error('Error al cargar la huerta')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrchard()
  }, [id])

  return { orchard, isLoading, error }
}

// Hook para estadísticas
export function useOrchardStats() {
  const [stats, setStats] = useState<OrchardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await orchardService.getStatistics()
      setStats(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las estadísticas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, isLoading, error, refetch: fetchStats }
}