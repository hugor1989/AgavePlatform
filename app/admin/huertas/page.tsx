"use client"

import { useState, useEffect } from "react"
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
import { Search, Plus, Calendar, Clock, ImageIcon, Eye, Edit, Camera, MapPin, Share2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

// 🔌 IMPORTACIONES NUEVAS - Conectar con backend
import { useOrchards } from "@/hooks/useOrchards"
import { orchardService, OrchardFormData } from "@/services/orchardService"
import { useFarmers } from "@/hooks/useFarmers"
import { useAgaveTypes } from "@/hooks/useAgaveTypes"


export default function AdminHuertasPage() {
  // 🔌 HOOK NUEVO - Conectar con backend (reemplaza mockHuertas)
  const {
    orchards,
    years,
    isLoading: isLoadingOrchards,
    createOrchard,
    updateOrchard,
    deleteOrchard,
    updateFilters,
  } = useOrchards({
    per_page: 50, // Mostrar muchas para que se vea completo
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  // Estados locales (igual que antes)
  const { farmers, isLoading: isLoadingFarmers } = useFarmers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { agaveTypes, isLoading: isLoadingAgaveTypes, getIdByName } = useAgaveTypes()

  // Formulario para nueva huerta (igual que antes)
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
    photoId: null as File | null,
    coverPhoto: null as File | null,
  })


  // 🔄 FILTRADO LOCAL - Mantener la misma lógica visual
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

  // 🆕 CREAR HUERTA - Conectada al backend
  const handleAddHuerta = async () => {
    // Validar campos requeridos
    if (!newHuerta.name || !newHuerta.type || !newHuerta.year || !newHuerta.farmerId || !newHuerta.plants) {
      toast.error("Por favor completa todos los campos requeridos (Nombre, Tipo, Año, Agricultor, Plantas)")
      return
    }

    setIsLoading(true)

    // Preparar datos para el backend
    const orchardData: OrchardFormData = {
      name: newHuerta.name,
      agave_type_id: Number(newHuerta.type),
      farmer_id: Number(newHuerta.farmerId),
      year: Number(newHuerta.year),
      age: newHuerta.age ? Number(newHuerta.age.replace(' años', '')) : undefined,
      plant_quantity: Number(newHuerta.plants),
      photo_id: newHuerta.photoId, // Foto de portada
      cover_photo: newHuerta.coverPhoto,     // ← NUEVO: Foto de portada
      state: newHuerta.state || undefined,
      municipality: newHuerta.municipality || undefined,
      latitude: newHuerta.latitude ? Number(newHuerta.latitude) : undefined,
      longitude: newHuerta.longitude ? Number(newHuerta.longitude) : undefined,
      status: 'disponible',
      is_featured: false,
    }

    // Llamar al servicio
    const result = await createOrchard(orchardData)

    setIsLoading(false)

    if (result.success) {
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
      })
    }
  }

  // ✏️ EDITAR HUERTA - Conectada al backend  
  const handleEditHuerta = async () => {
    if (!selectedHuerta) return

    setIsLoading(true)

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
    }

    // Si hay una nueva foto, agregarla
    if (selectedHuerta.photo_id instanceof File) {
      orchardData.photo_id = selectedHuerta.photo_id
    }

    const result = await updateOrchard(selectedHuerta.id, orchardData)

    setIsLoading(false)

    if (result.success) {
      setIsEditDialogOpen(false)
    }
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

  // Mapear status del backend al formato del frontend
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'disponible': 'Disponible',
      'vendida': 'Vendida',
      'reservada': 'Reservada'
    }
    return statusMap[status] || status
  }

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        {/* Header - MANTENER IGUAL */}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitud</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={newHuerta.latitude}
                        onChange={(e) => setNewHuerta({ ...newHuerta, latitude: e.target.value })}
                        placeholder="Ej: 20.8818"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitud</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={newHuerta.longitude}
                        onChange={(e) => setNewHuerta({ ...newHuerta, longitude: e.target.value })}
                        placeholder="Ej: -103.8370"
                      />
                    </div>
                  </div>

                  {/* FOTO DE IDENTIFICACIÓN */}
                  <div className="space-y-2">
                    <Label htmlFor="photo-id">Foto de Identificación</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo-id"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewHuerta({ ...newHuerta, photoId: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("photo-id")?.click()}
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

                  {/* 🆕 FOTO DE PORTADA */}
                  <div className="space-y-2">
                    <Label htmlFor="cover-photo">Foto de Portada</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="cover-photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewHuerta({ ...newHuerta, coverPhoto: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("cover-photo")?.click()}
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
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddHuerta} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? "Guardando..." : "Agregar Huerta"}
                  </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtro por año - MANTENER IGUAL */}
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

        {/* Búsqueda - MANTENER IGUAL */}
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

        {/* Tabs - MANTENER IGUAL */}
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
                    <div className="relative">
                      <Image
                        src={orchardService.getPhotoUrl(orchard.cover_photo) || "/placeholder.svg"}
                        alt={orchard.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                          <Camera className="w-3 h-3 mr-1" />
                          {orchard.photos_count} fotos
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

                      {orchard.location && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-700 font-medium">Ubicación</p>
                              <p className="text-sm font-mono text-green-800">{orchard.location}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                              <Share2 className="w-4 h-4 text-green-700" />
                            </Button>
                          </div>
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

        {/* Modal para ver foto - MANTENER IGUAL */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Foto ID de la Huerta</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedPhoto || "/placeholder.svg"}
                alt="Foto ID"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para editar huerta - MANTENER IGUAL (solo cambiar lógica interna) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Huerta</DialogTitle>
              <DialogDescription>Modifica la información de la huerta</DialogDescription>
            </DialogHeader>
            {selectedHuerta && (
              <div className="grid gap-4 py-4">
                {/* Nombre y Tipo */}
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

                {/* Año, Edad, Plantas */}
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

                {/* Agricultor */}
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

                {/* Estado y Municipio */}
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

                {/* Coordenadas */}
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                {/* Cambiar Foto */}
                <div className="space-y-2">
                  <Label htmlFor="edit-photo">Cambiar Foto de Portada</Label>
                  {selectedHuerta.photo_id && (
                    <div className="mb-2">
                      <img
                        src={orchardService.getPhotoUrl(selectedHuerta.photo_id) || "/placeholder.svg"}
                        alt="Foto actual"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-500 mt-1">Foto actual de portada</p>
                    </div>
                  )}
                  <Input
                    id="edit-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedHuerta({ ...selectedHuerta, photo_id: e.target.files?.[0] })}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("edit-photo")?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Seleccionar nueva foto de portada
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditHuerta} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}