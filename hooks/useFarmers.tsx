'use client'

import { useState, useEffect } from 'react'
import { farmerService } from '@/services/farmerService'

export function useFarmers() {
  const [farmers, setFarmers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFarmers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await farmerService.getActive()
        setFarmers(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los agricultores')
        console.error('Error loading farmers:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFarmers()
  }, [])

  return { farmers, isLoading, error }
}