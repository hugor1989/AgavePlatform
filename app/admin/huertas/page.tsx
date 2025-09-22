"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
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

// Icono de Agave con el SVG proporcionado
const AgaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path
      fill="#91CC04"
      d="M217.081,418.866c23.418,7.837,48.756-4.794,56.594-28.213c7.837-23.419-4.794-48.756-28.213-56.594
      c-23.419-7.837-229.718-55.766-237.555-32.348C0.07,325.129,193.662,411.029,217.081,418.866z"
    />
    <path
      fill="#85BB04"
      d="M245.462,334.059c-14.861-4.973-103.365-26.091-168.066-34.876
      c6.584,7.874,72.569,80.301,91.733,99.441c23.381,10.518,41.712,18.152,47.953,20.24c23.418,7.837,48.756-4.794,56.594-28.213
      C281.512,367.235,268.881,341.897,245.462,334.059z"
    />
    <path
      fill="#9CDD05"
      d="M294.891,418.866c-23.418,7.837-48.756-4.794-56.594-28.213
      c-7.837-23.418,4.794-48.756,28.213-56.594c23.419-7.837,229.718-55.767,237.556-32.349
      C511.903,325.129,318.309,411.029,294.891,418.866z"
    />
    <path
      fill="#91CC04"
      d="M434.577,299.183c-64.702,8.786-153.206,29.903-168.066,34.876
      c-23.418,7.837-36.049,33.175-28.213,56.593c7.837,23.418,33.175,36.049,56.594,28.213c6.241-2.089,24.571-9.723,47.953-20.24
      C362.008,379.484,427.993,307.058,434.577,299.183z"
    />
    <path
      fill="#85BB04"
      d="M198.507,350.579c10.667,22.273,37.369,31.681,59.642,21.015
      c22.273-10.667,31.681-37.369,21.015-59.642c-10.667-22.273-119.792-203.79,142.064-193.124S187.84,328.306,198.507,350.579z"
    />
    <path
      fill="#85BB04"
      d="M319.087,350.579c-10.667,22.273-37.369,31.681-59.642,21.015
      c-22.273-10.667-31.681-37.369-21.015-59.642c10.667-22.273,119.792-203.79,142.064-193.124
      C402.767,129.495,329.752,328.306,319.087,350.579z"
    />
    <path
      fill="#91CC04"
      d="M214.084,326.516c-0.201,24.694,19.654,44.876,44.348,45.077
      c24.694,0.201,44.876-19.654,45.077-44.348S285.411,91.549,260.718,91.348S214.285,301.821,214.084,326.516z"
    />
    <path
      fill="#9CDD05"
      d="M210.663,395.976c18.87,15.93,47.081,13.547,63.011-5.323c15.93-18.87,13.547-47.081-5.323-63.011
      c-18.87-15.93-192.895-136.646-208.825-117.776S191.793,380.046,210.663,395.976z"
    />
    <path
      fill="#C2FB3B"
      d="M301.309,395.976c-18.87,15.93-47.081,13.547-63.011-5.323c-15.93-18.87-13.547-47.081,5.323-63.011
      c18.87-15.93,192.895-136.646,208.825-117.776C468.375,228.736,320.179,380.046,301.309,395.976z"
    />
  </svg>
)

// Datos simulados de huertas
const mockHuertas = [
  {
    id: 1,
    name: "Huerta Los Altos Premium",
    type: "Azul Tequilana Weber",
    year: 2020,
    age: "4 años",
    plants: 27627,
    status: "Disponible",
    featured: true,
    photos: 8,
    farmerName: "Juan Pérez García",
    farmerUniqueId: "1705123456",
    photoId: "/agave-field-plantation.png",
    state: "Jalisco",
    municipality: "Tequila",
    location: "20.8818, -103.8370",
  },
  {
    id: 2,
    name: "Plantación El Mirador",
    type: "Azul Tequilana Weber",
    year: 2019,
    age: "5 años",
    plants: 22450,
    status: "Disponible",
    featured: false,
    photos: 12,
    farmerName: "María González López",
    farmerUniqueId: "1706234567",
    photoId: "/placeholder-n4bzz.png",
    state: "Jalisco",
    municipality: "Arandas",
    location: "20.7167, -102.3500",
  },
  {
    id: 3,
    name: "Agavera San Miguel",
    type: "Azul Tequilana Weber",
    year: 2021,
    age: "3 años",
    plants: 18900,
    status: "Vendida",
    featured: false,
    photos: 6,
    farmerName: "Carlos Rodríguez Mendoza",
    farmerUniqueId: "1707345678",
    photoId: "/agave-field-plantation.png",
    state: "Nayarit",
    municipality: "Tepic",
    location: "21.5041, -104.8942",
  },
]

// Datos simulados de agricultores
const mockFarmers = [
  { id: 1, name: "Juan Pérez García", uniqueId: "1705123456" },
  { id: 2, name: "María González López", uniqueId: "1706234567" },
  { id: 3, name: "Carlos Rodríguez Mendoza", uniqueId: "1707345678" },
  { id: 4, name: "Ana Martínez Silva", uniqueId: "1708456789" },
  { id: 5, name: "Roberto Hernández Cruz", uniqueId: "1709567890" },
]

export default function AdminHuertasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [huertas, setHuertas] = useState(mockHuertas)

  // Formulario para nueva huerta
  const [newHuerta, setNewHuerta] = useState({
    name: "",
    type: "",
    year: "",
    age: "",
    plants: "",
    farmerId: "",
    photoId: null as File | null,
  })

  const years = [2025, 2024, 2023, 2022, 2021, 2020]
  const agaveTypes = ["Azul Tequilana Weber", "Americana", "Angustifolia", "Cupreata", "Duranguensis", "Potatorum"]

  const filteredHuertas = huertas.filter((huerta) => {
    const matchesSearch =
      huerta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.farmerUniqueId.includes(searchTerm)
    const matchesYear = selectedYear === "all" || huerta.year.toString() === selectedYear
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && huerta.status === "Disponible") ||
      (activeTab === "sold" && huerta.status === "Vendida")
    return matchesSearch && matchesYear && matchesTab
  })

  const handleAddHuerta = async () => {
    if (!newHuerta.name || !newHuerta.type || !newHuerta.year || !newHuerta.farmerId) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setIsLoading(true)

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const farmer = mockFarmers.find((f) => f.id.toString() === newHuerta.farmerId)
    const newId = Math.max(...huertas.map((h) => h.id)) + 1

    const huertaToAdd = {
      id: newId,
      name: newHuerta.name,
      type: newHuerta.type,
      year: Number.parseInt(newHuerta.year),
      age: newHuerta.age,
      plants: Number.parseInt(newHuerta.plants) || 0,
      status: "Disponible",
      featured: false,
      photos: 1,
      farmerName: farmer?.name || "",
      farmerUniqueId: farmer?.uniqueId || "",
      photoId: "/agave-field-plantation.png",
      state: "Jalisco",
      municipality: "Tequila",
      location: "20.8818, -103.8370",
    }

    setHuertas([...huertas, huertaToAdd])
    setIsLoading(false)
    setIsAddDialogOpen(false)
    setNewHuerta({
      name: "",
      type: "",
      year: "",
      age: "",
      plants: "",
      farmerId: "",
      photoId: null,
    })

    toast.success("Huerta agregada exitosamente")
  }

  const handleEditHuerta = async () => {
    if (!selectedHuerta) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const updatedHuertas = huertas.map((h) => (h.id === selectedHuerta.id ? selectedHuerta : h))
    setHuertas(updatedHuertas)
    setIsLoading(false)
    setIsEditDialogOpen(false)
    toast.success("Huerta actualizada exitosamente")
  }

  const handleViewPhoto = (photoId: string) => {
    setSelectedPhoto(photoId)
    setIsPhotoDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "Vendida":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {agaveTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Año *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newHuerta.year}
                      onChange={(e) => setNewHuerta({ ...newHuerta, year: e.target.value })}
                      placeholder="2020"
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
                    <Label htmlFor="plants">Cantidad de Plantas</Label>
                    <Input
                      id="plants"
                      type="number"
                      value={newHuerta.plants}
                      onChange={(e) => setNewHuerta({ ...newHuerta, plants: e.target.value })}
                      placeholder="27627"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmer">Agricultor *</Label>
                  <Select
                    value={newHuerta.farmerId}
                    onValueChange={(value) => setNewHuerta({ ...newHuerta, farmerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar agricultor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFarmers.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.id.toString()}>
                          {farmer.name} - Identificador: {farmer.uniqueId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Foto ID</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewHuerta({ ...newHuerta, photoId: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo")?.click()}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {newHuerta.photoId ? newHuerta.photoId.name : "Seleccionar imagen"}
                    </Button>
                  </div>
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

        {/* Búsqueda y filtros */}
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
            <TabsTrigger value="all">Todas ({huertas.length})</TabsTrigger>
            <TabsTrigger value="active">
              Disponibles ({huertas.filter((h) => h.status === "Disponible").length})
            </TabsTrigger>
            <TabsTrigger value="sold">Vendidas ({huertas.filter((h) => h.status === "Vendida").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredHuertas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron huertas</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredHuertas.map((huerta) => (
                  <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={huerta.photoId || "/placeholder.svg"}
                        alt={huerta.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                          <Camera className="w-3 h-3 mr-1" />
                          {huerta.photos} fotos
                        </Badge>
                      </div>
                      {huerta.featured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">Destacada</Badge>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{huerta.name}</h3>
                          <p className="text-sm text-gray-500">#{huerta.id}</p>
                        </div>
                        <Badge className={getStatusColor(huerta.status)}>{huerta.status}</Badge>
                      </div>

                      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                        <AgaveIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{huerta.type}</span>
                      </div>

                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                        <span className="text-2xl font-bold text-blue-600">{huerta.plants.toLocaleString()}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Estado</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-6">{huerta.state}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-500">Municipio</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-6">{huerta.municipality}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Año</p>
                            <p className="text-sm font-medium text-gray-900">{huerta.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Edad</p>
                            <p className="text-sm font-medium text-gray-900">{huerta.age}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-700 font-medium">Ubicación</p>
                            <p className="text-sm font-mono text-green-800">{huerta.location}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                            <Share2 className="w-4 h-4 text-green-700" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewPhoto(huerta.photoId)}
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
                            setSelectedHuerta(huerta)
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
                      value={selectedHuerta.type}
                      onValueChange={(value) => setSelectedHuerta({ ...selectedHuerta, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {agaveTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, year: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Edad</Label>
                    <Input
                      id="edit-age"
                      value={selectedHuerta.age}
                      onChange={(e) => setSelectedHuerta({ ...selectedHuerta, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-plants">Cantidad de Plantas</Label>
                    <Input
                      id="edit-plants"
                      type="number"
                      value={selectedHuerta.plants}
                      onChange={(e) =>
                        setSelectedHuerta({ ...selectedHuerta, plants: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-farmer">Agricultor</Label>
                  <Select
                    value={selectedHuerta.farmerUniqueId}
                    onValueChange={(value) => {
                      const farmer = mockFarmers.find((f) => f.uniqueId === value)
                      setSelectedHuerta({
                        ...selectedHuerta,
                        farmerUniqueId: value,
                        farmerName: farmer?.name || "",
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFarmers.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.uniqueId}>
                          {farmer.name} - Identificador: {farmer.uniqueId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-photo">Cambiar Foto ID</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("edit-photo")?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Seleccionar nueva imagen
                  </Button>
                  <Input id="edit-photo" type="file" accept="image/*" className="hidden" />
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
    </AdminLayout>
  )
}
