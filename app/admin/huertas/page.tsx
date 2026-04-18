"use client"

import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Calendar, Clock, ImageIcon, Eye, Edit, Camera, MapPin, Share2, User, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

// 🔌 IMPORTACIONES - Conectar con backend
import { useOrchards } from "@/hooks/useOrchards"
import { orchardService, OrchardFormData } from "@/services/orchardService"
import { useFarmers } from "@/hooks/useFarmers"
import { useAgaveTypes } from "@/hooks/useAgaveTypes"


export default function AdminHuertasPage() {
  // 🔌 HOOK - Conectar con backend
  const {
    orchards,
    years,
    isLoading: isLoadingOrchards,
    createOrchard,
    updateOrchard,
    deleteOrchard,
    updateFilters,
  } = useOrchards({
    per_page: 50,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  // Refs para inputs de archivo
  const photoIdInputRef = useRef<HTMLInputElement>(null)
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)
  const extraPhotoInputRef = useRef<HTMLInputElement>(null) 

  const editPhotoIdRef = useRef<HTMLInputElement>(null)
  const editCoverPhotoRef = useRef<HTMLInputElement>(null)
  const editExtraPhotoRef = useRef<HTMLInputElement>(null) 
  const [activeImageIndex, setActiveImageIndex] = useState<{[key: number]: number}>({})
  const touchStartX = useRef<number | null>(null)


  // Estados locales
  const { farmers, isLoading: isLoadingFarmers } = useFarmers()
  const { agaveTypes, isLoading: isLoadingAgaveTypes, getIdByName } = useAgaveTypes()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Formulario para nueva huerta
  const [newHuerta, setNewHuerta] = useState({
    name: "",
    type: "",
    year: "",
    age: "",
    plants: "",
    farmerId: "",
    state: "",
    municipality: "",
    latitude: "",
    longitude: "",
    location_url: "",
    photoId: null as File | null,
    coverPhoto: null as File | null,
    extraPhoto: null as File | null, 
  })


  // 🔄 FILTRADO LOCAL
  const filteredHuertas = orchards.filter((orchard) => {
    const matchesSearch =
      orchard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (orchard.farmer?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (orchard.farmer?.unique_identifier || '').includes(searchTerm)
    
    const matchesYear = selectedYear === "all" || orchard.year.toString() === selectedYear
    
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && orchard.status === "disponible") ||
      (activeTab === "sold" && orchard.status === "vendida")
    
    return matchesSearch && matchesYear && matchesTab
  })

  // 🆕 CREAR HUERTA
  const handleAddHuerta = async () => {
    console.log('🔵 [INICIO] handleAddHuerta llamado')
    
    // Validar campos requeridos
    if (!newHuerta.name || !newHuerta.type || !newHuerta.year || !newHuerta.farmerId || !newHuerta.plants) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para el backend
      const orchardData: OrchardFormData = {
        name: newHuerta.name,
        agave_type_id: Number(newHuerta.type),
        farmer_id: Number(newHuerta.farmerId),
        year: Number(newHuerta.year),
        age: newHuerta.age ? Number(newHuerta.age.replace(' años', '')) : undefined,
        plant_quantity: Number(newHuerta.plants),
        photo_id: newHuerta.photoId,
        cover_photo: newHuerta.coverPhoto,
        extra_photo: newHuerta.extraPhoto, 
        state: newHuerta.state || undefined,
        municipality: newHuerta.municipality || undefined,
        latitude: newHuerta.latitude ? Number(newHuerta.latitude) : undefined,
        longitude: newHuerta.longitude ? Number(newHuerta.longitude) : undefined,
        location_url: newHuerta.location_url || undefined,
        status: 'disponible',
        is_featured: false,
      }

      console.log('🚀 [API CALL] Llamando a createOrchard...')
      const result = await createOrchard(orchardData)
      
      setIsLoading(false)

      if (result.success) {
        toast.success('Huerta registrada exitosamente')
        setIsAddDialogOpen(false)
        
        // Resetear formulario
        setNewHuerta({
          name: "",
          type: "",
          year: "",
          age: "",
          plants: "",
          farmerId: "",
          state: "",
          municipality: "",
          latitude: "",
          longitude: "",
          photoId: null,
          coverPhoto: null,
          extraPhoto: null,
          location_url: "",
        })
      } else {
        toast.error(result.error || 'Error al crear la huerta')
      }
    } catch (error: any) {
      console.error('❌ [CATCH ERROR] Error en handleAddHuerta:', error)
      setIsLoading(false)
      toast.error(error.message || 'Error al crear la huerta')
    }
  }

  // ✏️ EDITAR HUERTA
  const handleEditHuerta = async () => {
    if (!selectedHuerta) return

    console.log('🔵 [EDIT] Iniciando edición de huerta:', selectedHuerta.location_url)
    setIsLoading(true)

    
    try {
      const orchardData: Partial<OrchardFormData> = {
        name: selectedHuerta.name,
        agave_type_id: selectedHuerta.agave_type_id,
        farmer_id: selectedHuerta.farmer_id,
        year: selectedHuerta.year,
        age: selectedHuerta.age,
        plant_quantity: selectedHuerta.plant_quantity,
        state: selectedHuerta.state || undefined,
        municipality: selectedHuerta.municipality || undefined,
        latitude: selectedHuerta.latitude || undefined,
        longitude: selectedHuerta.longitude || undefined,
        location_url: selectedHuerta.location_url || undefined,
      }

      // Agregar fotos si se seleccionaron nuevas
      if (selectedHuerta.photo_id instanceof File) {
        orchardData.photo_id = selectedHuerta.photo_id;
      }

      if (selectedHuerta.cover_photo instanceof File) {
        orchardData.cover_photo = selectedHuerta.cover_photo;
      }

      if (selectedHuerta.extra_photo instanceof File) {
        orchardData.extra_photo = selectedHuerta.extra_photo; 
      }

      console.log('🚀 [EDIT] Enviando actualización...')
      const result = await updateOrchard(selectedHuerta.id, orchardData)
      console.log('📥 [EDIT] Resultado:', result)

      setIsLoading(false)

      if (result.success) {
        console.log('✅ [EDIT] Actualización exitosa')
        toast.success('Huerta actualizada exitosamente')
        setIsEditDialogOpen(false)
      } else {
        console.log('⚠️ [EDIT] Error en actualización')
        toast.error(result.error || 'Error al actualizar')
      }
    } catch (error: any) {
      console.error('❌ [EDIT ERROR]:', error)
      setIsLoading(false)
      toast.error(error.message || 'Error al actualizar la huerta')
    }
  }

  const handleOpenLocation = (url: string) => {
    if (!url) return

    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

      let finalUrl = url

      // Si es iOS y viene un link de Google Maps → convertir a Apple Maps
      if (isIOS && url.includes("google.com/maps")) {
        finalUrl = url.replace("https://www.google.com/maps", "https://maps.apple.com")
      }

      window.open(finalUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error al abrir ubicación:", error)
    }
  }

  const handleShareLocation = async (url: string) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Ubicación de la huerta",
        text: "Mira la ubicación de esta huerta",
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado al portapapeles")
    }
  } catch (error) {
    console.error("Error al compartir ubicación:", error)
  }
}

const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX
}

const handleTouchEnd = (e: React.TouchEvent, huertaId: number) => {
  if (touchStartX.current === null) return

  const touchEndX = e.changedTouches[0].clientX
  const diffX = touchStartX.current - touchEndX

  // Umbral mínimo para considerar swipe
  if (Math.abs(diffX) > 50) {
    setActiveImageIndex(prev => {
      const current = prev[huertaId] || 0
      return { ...prev, [huertaId]: current === 0 ? 1 : 0 }
    })
  }

  touchStartX.current = null
}

  const handleViewPhoto = (photoPath: string | null) => {
    const photoUrl = orchardService.getPhotoUrl(photoPath) || "/placeholder.svg"
    setSelectedPhoto(photoUrl)
    setIsPhotoDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible":
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "vendida":
      case "Vendida":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'disponible': 'Disponible',
      'vendida': 'Vendida',
      'reservada': 'Reservada'
    }
    return statusMap[status] || status
  }

  // Bloquear navegación mientras se guarda
  useEffect(() => {
    if (!isLoading) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isLoading])

  return (
    <AppLayout type="admin">
      {/* Overlay de carga — bloquea toda interacción */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm mx-4 text-center">
            <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-semibold text-gray-900 text-lg">Guardando huerta...</p>
              <p className="text-sm text-gray-500 mt-1">Por favor espera, no cierres ni salgas de esta página</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Huertas</h1>
            <p className="text-gray-600">Administra todas las huertas registradas en la plataforma</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Huerta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Huerta</DialogTitle>
                  <DialogDescription>Completa la información para registrar una nueva huerta</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Nombre y Tipo de Agave */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        value={newHuerta.name}
                        onChange={(e) => setNewHuerta({ ...newHuerta, name: e.target.value })}
                        placeholder="Ej: Huerta Los Altos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Agave *</Label>
                      <Select
                        value={newHuerta.type}
                        onValueChange={(value) => setNewHuerta({ ...newHuerta, type: value })}
                        disabled={isLoadingAgaveTypes}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingAgaveTypes ? "Cargando..." : "Seleccionar tipo"} />
                        </SelectTrigger>
                        <SelectContent>
                          {agaveTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Año, Edad y Cantidad de Plantas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Año *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newHuerta.year}
                        onChange={(e) => setNewHuerta({ ...newHuerta, year: e.target.value })}
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Edad</Label>
                      <Input
                        id="age"
                        value={newHuerta.age}
                        onChange={(e) => setNewHuerta({ ...newHuerta, age: e.target.value })}
                        placeholder="Ej: 4 años"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plants">Cantidad de Plantas *</Label>
                      <Input
                        id="plants"
                        type="number"
                        value={newHuerta.plants}
                        onChange={(e) => setNewHuerta({ ...newHuerta, plants: e.target.value })}
                        placeholder="27627"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Agricultor */}
                  <div className="space-y-2">
                    <Label htmlFor="farmer">Agricultor *</Label>
                    <Select
                      value={newHuerta.farmerId}
                      onValueChange={(value) => setNewHuerta({ ...newHuerta, farmerId: value })}
                      disabled={isLoadingFarmers}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingFarmers ? "Cargando..." : "Seleccionar agricultor"} />
                      </SelectTrigger>
                      <SelectContent>
                        {farmers.map((farmer) => (
                          <SelectItem key={farmer.id} value={farmer.id.toString()}>
                            {farmer.full_name} - Identificador: {farmer.unique_identifier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado y Municipio */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={newHuerta.state}
                        onChange={(e) => setNewHuerta({ ...newHuerta, state: e.target.value })}
                        placeholder="Ej: Jalisco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipality">Municipio</Label>
                      <Input
                        id="municipality"
                        value={newHuerta.municipality}
                        onChange={(e) => setNewHuerta({ ...newHuerta, municipality: e.target.value })}
                        placeholder="Ej: Tequila"
                      />
                    </div>
                  </div>

                  {/* Coordenadas GPS */}
                    <div className="space-y-2">
                      <Label htmlFor="locationurl">Ubicación (URL)</Label>
                      <Input
                        id="locationurl"
                        type="text"
                        value={newHuerta.location_url}
                        onChange={(e) => setNewHuerta({ ...newHuerta, location_url: e.target.value })}
                        placeholder="Ej: https://maps.google.com/?q=20.12345,-103.12345"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={newHuerta.longitude}
                        onChange={(e) => setNewHuerta({ ...newHuerta, longitude: e.target.value })}
                        placeholder="Ej: -103.8370"
                      />
                    </div> */}
                  

                  {/* FOTO DE IDENTIFICACIÓN */}
                  <div className="space-y-2">
                    <Label htmlFor="photo-id">Foto de Identificación</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        ref={photoIdInputRef}
                        id="photo-id"
                        type="file"
                        accept="image/*,.heic,.heif"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          console.log('📸 [PHOTO_ID] Archivo seleccionado:', file?.name || 'ninguno')
                          setNewHuerta({ ...newHuerta, photoId: file })
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => photoIdInputRef.current?.click()}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {newHuerta.photoId ? newHuerta.photoId.name : "Seleccionar foto de identificación"}
                      </Button>
                    </div>
                    {newHuerta.photoId && (
                      <p className="text-sm text-gray-500">
                        Archivo seleccionado: {newHuerta.photoId.name}
                      </p>
                    )}
                  </div>

                  {/* FOTO DE PORTADA */}
                  <div className="space-y-2">
                    <Label htmlFor="cover-photo">Foto de Portada</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        ref={coverPhotoInputRef}
                        id="cover-photo"
                        type="file"
                        accept="image/*,.heic,.heif"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          console.log('📸 [COVER_PHOTO] Archivo seleccionado:', file?.name || 'ninguno')
                          setNewHuerta({ ...newHuerta, coverPhoto: file })
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverPhotoInputRef.current?.click()}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {newHuerta.coverPhoto ? newHuerta.coverPhoto.name : "Seleccionar foto de portada"}
                      </Button>
                    </div>
                    {newHuerta.coverPhoto && (
                      <p className="text-sm text-gray-500">
                        Archivo seleccionado: {newHuerta.coverPhoto.name}
                      </p>
                    )}
                  </div>

                  {/* 🔴 FOTO EXTRA - NUEVO CAMPO */}
                  <div className="space-y-2">
                    <Label htmlFor="extra-photo">Foto Area Huerta</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        ref={extraPhotoInputRef}
                        id="extra-photo"
                        type="file"
                        accept="image/*,.heic,.heif"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          console.log('📸 [EXTRA_PHOTO] Archivo seleccionado:', file?.name || 'ninguno')
                          setNewHuerta({ ...newHuerta, extraPhoto: file })
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => extraPhotoInputRef.current?.click()}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {newHuerta.extraPhoto ? newHuerta.extraPhoto.name : "Seleccionar foto extra"}
                      </Button>
                    </div>
                    {newHuerta.extraPhoto && (
                      <p className="text-sm text-gray-500">
                        Archivo seleccionado: {newHuerta.extraPhoto.name}
                      </p>
                    )}
                  </div>

                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} type="button">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddHuerta} disabled={isLoading} className="bg-green-600 hover:bg-green-700" type="button">
                    {isLoading ? "Guardando..." : "Agregar Huerta"}
                  </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtro por año */}
        <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
          <h3 className="text-center text-lg font-medium text-gray-900 mb-4">Buscar por año</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedYear === "all" ? "default" : "outline"}
              onClick={() => setSelectedYear("all")}
              className="min-w-[80px]"
            >
              Todos
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year.toString() ? "default" : "outline"}
                onClick={() => setSelectedYear(year.toString())}
                className="min-w-[80px]"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar huertas por nombre, agricultor o identificador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas ({orchards.length})</TabsTrigger>
            <TabsTrigger value="active">
              Disponibles ({orchards.filter((h) => h.status === "disponible").length})
            </TabsTrigger>
            <TabsTrigger value="sold">Vendidas ({orchards.filter((h) => h.status === "vendida").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoadingOrchards ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando huertas...</p>
              </div>
            ) : filteredHuertas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron huertas</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredHuertas.map((orchard) => (
                  <Card key={orchard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative group">
                      {/* Flechas de navegación (solo si hay foto extra) */}
                      {orchard.extra_photo && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const current = activeImageIndex[orchard.id] || 0
                              setActiveImageIndex(prev => ({ ...prev, [orchard.id]: current === 0 ? 1 : 0 }))
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const current = activeImageIndex[orchard.id] || 0
                              setActiveImageIndex(prev => ({ ...prev, [orchard.id]: current === 0 ? 1 : 0 }))
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                     {/* FOTO ACTIVA — AQUÍ VA EL SWIPE */}
                                         <div
                                           className="relative w-full h-48 overflow-hidden rounded-lg"
                                           onTouchStart={handleTouchStart}
                                           onTouchEnd={(e) => handleTouchEnd(e, orchard.id)}
                                         >
                                           <button
                                             onClick={() => {
                                               const currentPhoto =
                                                 (activeImageIndex[orchard.id] || 0) === 0
                                                   ? orchard.cover_photo
                                                   : orchard.extra_photo
                     
                                               handleViewPhoto(currentPhoto)
                                             }}
                                             className="block w-full h-full"
                                           >
                                             {(activeImageIndex[orchard.id] || 0) === 0 ? (
                                               <Image
                                                 src={orchardService.getPhotoUrl(orchard.cover_photo) || "/placeholder.svg"}
                                                 alt={orchard.name}
                                                 width={400}
                                                 height={200}
                                                 className="w-full h-48 object-cover"
                                               />
                                             ) : (
                                               <Image
                                                 src={orchardService.getPhotoUrl(orchard.extra_photo) || "/placeholder.svg"}
                                                 alt={`${orchard.name} - Foto extra`}
                                                 width={400}
                                                 height={200}
                                                 className="w-full h-48 object-cover"
                                               />
                                             )}
                                           </button>
                                         </div>
                      
                      {/* Indicador de posición */}
                      {orchard.extra_photo && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          <div className={`w-2 h-2 rounded-full ${(activeImageIndex[orchard.id] || 0) === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                          <div className={`w-2 h-2 rounded-full ${(activeImageIndex[orchard.id] || 0) === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
                        </div>
                      )}
                      
                      {/* Contador de fotos */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          <Camera className="w-3 h-3 mr-1" />
                          {orchard.extra_photo ? '2' : '1'} foto{orchard.extra_photo ? 's' : ''}
                        </Badge>
                      </div>
                      
                      {orchard.is_featured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">Destacada</Badge>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{orchard.name}</h3>
                          <p className="text-sm text-gray-500">#{orchard.id}</p>
                        </div>
                        <Badge className={getStatusColor(orchard.status)}>{formatStatus(orchard.status)}</Badge>
                      </div>

                      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                        <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-900">
                          {orchard.agave_type?.name || 'Azul Tequilana Weber'}
                        </span>
                      </div>

                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                        <span className="text-2xl font-bold text-blue-600">{orchard.plant_quantity.toLocaleString()}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Estado</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-6">{orchard.state || 'N/A'}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Municipio</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-6">{orchard.municipality || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Año</p>
                            <p className="text-sm font-medium text-gray-900">{orchard.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Edad</p>
                            <p className="text-sm font-medium text-gray-900">{orchard.age_formatted || `${orchard.age} años`}</p>
                          </div>
                        </div>
                      </div>

                      {orchard.location_url && (
                       <div
                          onClick={() => handleOpenLocation(orchard.location_url!)}
                          className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm
                                    flex items-center justify-between gap-3 cursor-pointer
                                    hover:bg-green-100 active:scale-[0.98] transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-200 shrink-0">
                              <MapPin className="h-5 w-5 text-green-700" />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Ver ubicación
                              </p>
                              
                            </div>
                          </div>

                          {/* BOTÓN SOLO PARA COMPARTIR */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation() // 👈 IMPORTANTE
                              handleShareLocation(orchard.location_url!)
                            }}
                            className="h-9 w-9 rounded-full flex items-center justify-center
                                      hover:bg-green-200 transition"
                            aria-label="Compartir ubicación"
                          >
                            <Share2 className="h-4 w-4 text-green-700" />
                          </button>
                       </div>
                      )}

                      {orchard.farmer && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Agricultor</p>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{orchard.farmer.full_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 ml-0.5 font-mono">ID</span>
                            <span className="text-sm text-gray-600">{orchard.farmer.unique_identifier}</span>
                          </div>
                          {orchard.farmer.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate">{orchard.farmer.email}</span>
                            </div>
                          )}
                          {orchard.farmer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{orchard.farmer.phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewPhoto(orchard.photo_id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Ver Foto ID
                        </Button>
                      
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Huerta
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedHuerta(orchard)
                            setIsEditDialogOpen(true)
                          }}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal para ver foto */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Foto de la Huerta</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <div className="overflow-auto max-h-[70vh] p-2">
                  <img
                    src={selectedPhoto || "/placeholder.svg"}
                    alt="Foto"
                    className="max-w-none object-contain rounded-lg cursor-zoom-in"
                    style={{ width: "100%", height: "auto" }}
                    onClick={(e) => {
                      const img = e.currentTarget;
                      if (img.style.width === "100%") {
                        img.style.width = "200%";
                        img.style.cursor = "zoom-out";
                      } else {
                        img.style.width = "100%";
                        img.style.cursor = "zoom-in";
                      }
                    }}
                  />
                </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para editar huerta */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Huerta</DialogTitle>
              <DialogDescription>Modifica la información de la huerta</DialogDescription>
            </DialogHeader>
            {selectedHuerta && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nombre</Label>
                    <Input
                      id="edit-name"
                      value={selectedHuerta.name}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Tipo de Agave</Label>
                    <Select
                      value={selectedHuerta.agave_type_id?.toString() || ''}
                      onValueChange={(value) => setSelectedHuerta({ ...selectedHuerta, agave_type_id: Number(value) })}
                      disabled={isLoadingAgaveTypes}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingAgaveTypes ? "Cargando..." : "Seleccionar tipo"} />
                      </SelectTrigger>
                      <SelectContent>
                        {agaveTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Año</Label>
                    <Input
                      id="edit-year"
                      type="number"
                      value={selectedHuerta.year}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, year: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Edad</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      value={selectedHuerta.age}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, age: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-plants">Cantidad de Plantas</Label>
                    <Input
                      id="edit-plants"
                      type="number"
                      value={selectedHuerta.plant_quantity}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, plant_quantity: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-farmer">Agricultor</Label>
                  <Select
                    value={selectedHuerta.farmer_id?.toString() || ''}
                    onValueChange={(value) => setSelectedHuerta({ ...selectedHuerta, farmer_id: Number(value) })}
                    disabled={isLoadingFarmers}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingFarmers ? "Cargando..." : "Seleccionar agricultor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.id.toString()}>
                          {farmer.full_name} - Identificador: {farmer.unique_identifier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-state">Estado</Label>
                    <Input
                      id="edit-state"
                      value={selectedHuerta.state || ''}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, state: e.target.value })}
                      placeholder="Ej: Jalisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-municipality">Municipio</Label>
                    <Input
                      id="edit-municipality"
                      value={selectedHuerta.municipality || ''}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, municipality: e.target.value })}
                      placeholder="Ej: Tequila"
                    />
                  </div>
                </div>

                {/* Coordenadas GPS */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-locationurl">Ubicación (URL)</Label>
                      <Input
                        id="edit-locationurl"
                        type="text"
                        value={selectedHuerta.location_url || ''}
                        onChange={(e) => setSelectedHuerta({ ...selectedHuerta, location_url: e.target.value })}
                        placeholder="Ej: https://maps.google.com/?q=20.12345,-103.12345"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={newHuerta.longitude}
                        onChange={(e) => setNewHuerta({ ...newHuerta, longitude: e.target.value })}
                        placeholder="Ej: -103.8370"
                      />
                    </div> */}
                  
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-latitude">Latitud</Label>
                    <Input
                      id="edit-latitude"
                      type="number"
                      step="0.000001"
                      value={selectedHuerta.latitude || ''}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, latitude: Number(e.target.value) })}
                      placeholder="Ej: 20.8818"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-longitude">Longitud</Label>
                    <Input
                      id="edit-longitude"
                      type="number"
                      step="0.000001"
                      value={selectedHuerta.longitude || ''}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, longitude: Number(e.target.value) })}
                      placeholder="Ej: -103.8370"
                    />
                  </div>
                </div> */}

                {/* EDITAR FOTO DE IDENTIFICACIÓN */}
        <div className="space-y-2">
          <Label htmlFor="edit-photo-id">Cambiar Foto de Identificación</Label>
          {(selectedHuerta.photo_id || selectedHuerta.photo_id_path) && (
            <div className="mb-2">
              <img
                src={
                  selectedHuerta.photo_id instanceof File
                    ? URL.createObjectURL(selectedHuerta.photo_id)
                    : orchardService.getPhotoUrl(selectedHuerta.photo_id || selectedHuerta.photo_id_path) || "/placeholder.svg"
                }
                alt="Foto actual"
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                {selectedHuerta.photo_id instanceof File
                  ? "Nueva foto seleccionada"
                  : "Foto actual de identificación"}
              </p>
            </div>
          )}
          <Input
            ref={editPhotoIdRef}
            id="edit-photo-id"
            type="file"
            accept="image/*,.heic,.heif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log("Nueva foto ID:", file?.name);
              setSelectedHuerta({ ...selectedHuerta, photo_id: file });
            }}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => editPhotoIdRef.current?.click()}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {selectedHuerta.photo_id ? 
              "Reemplazar foto de identificación" : 
              "Seleccionar foto de identificación"}
          </Button>
        </div>

        {/* EDITAR FOTO DE PORTADA */}
        <div className="space-y-2">
          <Label htmlFor="edit-cover-photo">Cambiar Foto de Portada</Label>
          {(selectedHuerta.cover_photo || selectedHuerta.cover_photo_path) && (
            <div className="mb-2">
              <img
                src={
                  selectedHuerta.cover_photo instanceof File
                    ? URL.createObjectURL(selectedHuerta.cover_photo)
                    : orchardService.getPhotoUrl(selectedHuerta.cover_photo || selectedHuerta.cover_photo_path) || "/placeholder.svg"
                }
                alt="Foto actual"
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                {selectedHuerta.cover_photo instanceof File
                  ? "Nueva foto seleccionada"
                  : "Foto actual de portada"}
              </p>
            </div>
          )}
          
          <Input
            ref={editCoverPhotoRef}
            id="edit-cover-photo"
            type="file"
            accept="image/*,.heic,.heif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log("Nueva foto portada:", file?.name);
              setSelectedHuerta({ ...selectedHuerta, cover_photo: file });
            }}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => editCoverPhotoRef.current?.click()}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {selectedHuerta.cover_photo ? 
              "Reemplazar foto de portada" : 
              "Seleccionar foto de portada"}
          </Button>
        </div>

        {/* EDITAR FOTO EXTRA */}
        <div className="space-y-2">
          <Label htmlFor="edit-extra-photo">Cambiar Foto Area Huerta</Label>
          {(selectedHuerta.extra_photo || selectedHuerta.extra_photo_path) && (
            <div className="mb-2">
              <img
                src={
                  selectedHuerta.extra_photo instanceof File
                    ? URL.createObjectURL(selectedHuerta.extra_photo)
                    : orchardService.getPhotoUrl(selectedHuerta.extra_photo || selectedHuerta.extra_photo_path) || "/placeholder.svg"
                }
                alt="Foto extra actual"
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                {selectedHuerta.extra_photo instanceof File
                  ? "Nueva foto seleccionada"
                  : "Foto extra actual"}
              </p>
            </div>
        )}
  
        <Input
          ref={editExtraPhotoRef}
          id="edit-extra-photo"
          type="file"
          accept="image/*,.heic,.heif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            console.log("Nueva foto extra:", file?.name);
            setSelectedHuerta({ ...selectedHuerta, extra_photo: file });
          }}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => editExtraPhotoRef.current?.click()}
          className="w-full"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {selectedHuerta.extra_photo ? 
            "Reemplazar foto area huerta" : 
            "Seleccionar foto area huerta"}
        </Button>
      </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">
                Cancelar
              </Button>
              <Button onClick={handleEditHuerta} disabled={isLoading} className="bg-green-600 hover:bg-green-700" type="button">
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}