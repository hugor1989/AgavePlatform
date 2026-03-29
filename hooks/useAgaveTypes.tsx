'use client'

import { useState, useEffect } from 'react'
import { agaveTypeService, AgaveType } from '@/services/agaveTypeService'

export function useAgaveTypes() {
  const [agaveTypes, setAgaveTypes] = useState<AgaveType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgaveTypes = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await agaveTypeService.getAll()
        setAgaveTypes(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los tipos de agave')
        console.error('Error loading agave types:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgaveTypes()
  }, [])

  /**
   * Helper para obtener el ID de un tipo por su nombre
   */
  const getIdByName = (name: string): number | null => {
    const type = agaveTypes.find(t => 
      t.name.toLowerCase() === name.toLowerCase()
    )
    return type ? type.id : null
  }

  return { agaveTypes, isLoading, error, getIdByName }
}