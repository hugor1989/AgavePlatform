"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2, Calendar, Eye, MapPin, Clock, Leaf, Share2, Camera, Check } from "lucide-react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"
import Image from "next/image"

// Datos simulados de huertas vendidas
const mockSoldHuertas = [
  {
    id: 1,
    name: "Huerta Los Altos Premium",
    number: "#1",
    type: "Azul Tequilana Weber",
    year: 2020,
    age: "4 años",
    plants: 27627,
    description: "Excelente huerta con agave de alta calidad, ideal para producción de tequila premium.",
    farmerName: "Juan Pérez García",
    farmerUniqueId: "1705123456",
    companyName: "Tequila Premium SA",
    salePrice: 850000,
    saleDate: "2024-01-17T11:30:00Z",
    photoId: "/agave-field-plantation.png",
    state: "Jalisco",
    municipality: "Tequila",
    coordinates: "20.8818, -103.8370",
    photos: 8,
    featured: true,
    status: "Disponible",
    acceptedOffer: {
      companyName: "Tequila Premium SA",
      companyLogo: "/placeholder.svg",
      offerId: "OFF-2024-001",
      offerDate: "2024-01-15",
      price: "45.50",
      jimaSize: "35 cm mínimo",
      financedMonths: "18 meses",
      jimaDate: "Marzo 2024",
      minimumKilos: "500 kg",
      paymentDetails: "Pago semanal por viajes jimados, liquidación inmediata al entregar en báscula",
      logistics: "La fábrica se encarga de toda la logística de transporte desde la huerta hasta la planta procesadora",
    },
    jimaSchedule: {
      totalPhases: 3,
      completedPhases: 1,
      inProgressPhases: 1,
      scheduledPhases: 1,
      weeklySchedule: [
        {
          week: "Semana 1 (Feb 1-7, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-01", trips: 5 },
            { day: "Martes", date: "2024-02-02", trips: 4 },
            { day: "Miércoles", date: "2024-02-03", trips: 6 },
            { day: "Jueves", date: "2024-02-04", trips: 3 },
            { day: "Viernes", date: "2024-02-05", trips: 5 },
            { day: "Sábado", date: "2024-02-06", trips: 2 },
            { day: "Domingo", date: "2024-02-07", trips: 0 },
          ],
          totalTrips: 25,
          status: "completed",
        },
        {
          week: "Semana 2 (Feb 8-14, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-08", trips: 4 },
            { day: "Martes", date: "2024-02-09", trips: 5 },
            { day: "Miércoles", date: "2024-02-10", trips: 4 },
            { day: "Jueves", date: "2024-02-11", trips: 6 },
            { day: "Viernes", date: "2024-02-12", trips: 3 },
            { day: "Sábado", date: "2024-02-13", trips: 2 },
            { day: "Domingo", date: "2024-02-14", trips: 1 },
          ],
          totalTrips: 25,
          status: "in_progress",
        },
        {
          week: "Semana 3 (Feb 15-21, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-15", trips: 5 },
            { day: "Martes", date: "2024-02-16", trips: 4 },
            { day: "Miércoles", date: "2024-02-17", trips: 5 },
            { day: "Jueves", date: "2024-02-18", trips: 4 },
            { day: "Viernes", date: "2024-02-19", trips: 6 },
            { day: "Sábado", date: "2024-02-20", trips: 3 },
            { day: "Domingo", date: "2024-02-21", trips: 0 },
          ],
          totalTrips: 27,
          status: "scheduled",
        },
      ],
      guidePhotos: [
        {
          id: 1,
          title: "Entrada Principal",
          url: "/agave-field-plantation.png",
          description: "Acceso principal a la huerta desde carretera",
        },
        {
          id: 2,
          title: "Punto de Referencia",
          url: "/placeholder-n4bzz.png",
          description: "Casa del agricultor como punto de referencia",
        },
        {
          id: 3,
          title: "Área de Carga",
          url: "/agave-field-plantation.png",
          description: "Zona designada para carga de camiones",
        },
      ],
    },
  },
  {
    id: 2,
    name: "Agavera San Miguel",
    number: "#2",
    type: "Azul Tequilana Weber",
    year: 2021,
    age: "3 años",
    plants: 18900,
    description: "Huerta joven con gran potencial de crecimiento y excelente manejo.",
    farmerName: "Carlos Rodríguez Mendoza",
    farmerUniqueId: "1707345678",
    companyName: "Destilería Tradicional",
    salePrice: 650000,
    saleDate: "2024-01-17T11:30:00Z",
    photoId: "/agave-field-plantation.png",
    state: "Nayarit",
    municipality: "Tepic",
    coordinates: "21.5041, -104.8942",
    photos: 5,
    featured: false,
    status: "Vendida",
    acceptedOffer: {
      companyName: "Destilería Tradicional",
      companyLogo: "/placeholder.svg",
      offerId: "OFF-2024-002",
      offerDate: "2024-01-12",
      price: "42.00",
      jimaSize: "38 cm mínimo",
      financedMonths: "12 meses",
      jimaDate: "Abril 2024",
      minimumKilos: "300 kg",
      paymentDetails: "Pago quincenal por viajes jimados, con adelanto del 30% al inicio",
      logistics: "El agave será puesto en fábrica por parte del agricultor, transporte incluido en precio",
    },
    jimaSchedule: {
      totalPhases: 1,
      completedPhases: 0,
      inProgressPhases: 0,
      scheduledPhases: 1,
      weeklySchedule: [
        {
          week: "Semana 1 (Feb 1-7, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-01", trips: 5 },
            { day: "Martes", date: "2024-02-02", trips: 4 },
            { day: "Miércoles", date: "2024-02-03", trips: 6 },
            { day: "Jueves", date: "2024-02-04", trips: 3 },
            { day: "Viernes", date: "2024-02-05", trips: 5 },
            { day: "Sábado", date: "2024-02-06", trips: 2 },
            { day: "Domingo", date: "2024-02-07", trips: 0 },
          ],
          totalTrips: 25,
          status: "completed",
        },
        {
          week: "Semana 2 (Feb 8-14, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-08", trips: 4 },
            { day: "Martes", date: "2024-02-09", trips: 5 },
            { day: "Miércoles", date: "2024-02-10", trips: 4 },
            { day: "Jueves", date: "2024-02-11", trips: 6 },
            { day: "Viernes", date: "2024-02-12", trips: 3 },
            { day: "Sábado", date: "2024-02-13", trips: 2 },
            { day: "Domingo", date: "2024-02-14", trips: 1 },
          ],
          totalTrips: 25,
          status: "in_progress",
        },
        {
          week: "Semana 3 (Feb 15-21, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-15", trips: 5 },
            { day: "Martes", date: "2024-02-16", trips: 4 },
            { day: "Miércoles", date: "2024-02-17", trips: 5 },
            { day: "Jueves", date: "2024-02-18", trips: 4 },
            { day: "Viernes", date: "2024-02-19", trips: 6 },
            { day: "Sábado", date: "2024-02-20", trips: 3 },
            { day: "Domingo", date: "2024-02-21", trips: 0 },
          ],
          totalTrips: 27,
          status: "scheduled",
        },
      ],
      guidePhotos: [
        {
          id: 1,
          title: "Entrada Principal",
          url: "/agave-field-plantation.png",
          description: "Acceso principal a la huerta desde carretera",
        },
        {
          id: 2,
          title: "Punto de Referencia",
          url: "/placeholder-n4bzz.png",
          description: "Casa del agricultor como punto de referencia",
        },
        {
          id: 3,
          title: "Área de Carga",
          url: "/agave-field-plantation.png",
          description: "Zona designada para carga de camiones",
        },
      ],
    },
  },
  {
    id: 3,
    name: "Plantación El Mirador",
    number: "#3",
    type: "Azul Tequilana Weber",
    year: 2019,
    age: "5 años",
    plants: 22450,
    description: "Plantación madura con excelente ubicación y acceso a carreteras principales.",
    farmerName: "María González López",
    farmerUniqueId: "1706234567",
    companyName: "Agave Industries",
    salePrice: 1100000,
    saleDate: "2024-01-10T14:20:00Z",
    photoId: "/placeholder-n4bzz.png",
    state: "Michoacán",
    municipality: "Uruapan",
    coordinates: "19.4204, -102.0631",
    photos: 12,
    featured: true,
    status: "En Proceso",
    acceptedOffer: {
      companyName: "Agave Industries",
      companyLogo: "/placeholder.svg",
      offerId: "OFF-2024-003",
      offerDate: "2024-01-08",
      price: "48.75",
      jimaSize: "40 cm mínimo",
      financedMonths: "24 meses",
      jimaDate: "Mayo 2024",
      minimumKilos: "800 kg",
      paymentDetails: "Pago mensual por viajes jimados, con bonificación por calidad premium",
      logistics: "Logística compartida: fábrica proporciona transporte, agricultor carga y descarga",
    },
    jimaSchedule: {
      totalPhases: 2,
      completedPhases: 2,
      inProgressPhases: 0,
      scheduledPhases: 0,
      weeklySchedule: [
        {
          week: "Semana 1 (Feb 1-7, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-01", trips: 5 },
            { day: "Martes", date: "2024-02-02", trips: 4 },
            { day: "Miércoles", date: "2024-02-03", trips: 6 },
            { day: "Jueves", date: "2024-02-04", trips: 3 },
            { day: "Viernes", date: "2024-02-05", trips: 5 },
            { day: "Sábado", date: "2024-02-06", trips: 2 },
            { day: "Domingo", date: "2024-02-07", trips: 0 },
          ],
          totalTrips: 25,
          status: "completed",
        },
        {
          week: "Semana 2 (Feb 8-14, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-08", trips: 4 },
            { day: "Martes", date: "2024-02-09", trips: 5 },
            { day: "Miércoles", date: "2024-02-10", trips: 4 },
            { day: "Jueves", date: "2024-02-11", trips: 6 },
            { day: "Viernes", date: "2024-02-12", trips: 3 },
            { day: "Sábado", date: "2024-02-13", trips: 2 },
            { day: "Domingo", date: "2024-02-14", trips: 1 },
          ],
          totalTrips: 25,
          status: "in_progress",
        },
        {
          week: "Semana 3 (Feb 15-21, 2024)",
          days: [
            { day: "Lunes", date: "2024-02-15", trips: 5 },
            { day: "Martes", date: "2024-02-16", trips: 4 },
            { day: "Miércoles", date: "2024-02-17", trips: 5 },
            { day: "Jueves", date: "2024-02-18", trips: 4 },
            { day: "Viernes", date: "2024-02-19", trips: 6 },
            { day: "Sábado", date: "2024-02-20", trips: 3 },
            { day: "Domingo", date: "2024-02-21", trips: 0 },
          ],
          totalTrips: 27,
          status: "scheduled",
        },
      ],
      guidePhotos: [
        {
          id: 1,
          title: "Entrada Principal",
          url: "/agave-field-plantation.png",
          description: "Acceso principal a la huerta desde carretera",
        },
        {
          id: 2,
          title: "Punto de Referencia",
          url: "/placeholder-n4bzz.png",
          description: "Casa del agricultor como punto de referencia",
        },
        {
          id: 3,
          title: "Área de Carga",
          url: "/agave-field-plantation.png",
          description: "Zona designada para carga de camiones",
        },
      ],
    },
  },
]

export default function AdminHuertasVendidasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [soldHuertas, setSoldHuertas] = useState(mockSoldHuertas)
  const [isUploading, setIsUploading] = useState(false)

  const companies = Array.from(new Set(mockSoldHuertas.map((huerta) => huerta.companyName)))

  const filteredHuertas = soldHuertas.filter((huerta) => {
    const matchesSearch =
      huerta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.farmerUniqueId.includes(searchTerm)
    const matchesCompany = selectedCompany === "all" || huerta.companyName === selectedCompany
    return matchesSearch && matchesCompany
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada"
      case "in_progress":
        return "En Progreso"
      case "scheduled":
        return "Programada"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "Vendida":
        return "bg-blue-100 text-blue-800"
      case "En Proceso":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleImageUpload = async (phaseId: number, file: File) => {
    setIsUploading(true)

    // Simular subida de archivo
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Crear URL temporal para la imagen
    const imageUrl = URL.createObjectURL(file)

    // Actualizar la fase con la imagen
    const updatedHuertas = soldHuertas.map((huerta) => {
      if (huerta.id === selectedHuerta?.id) {
        return {
          ...huerta,
          jimaSchedule: {
            ...huerta.jimaSchedule,
            phases: huerta.jimaSchedule.phases.map((phase) =>
              phase.id === phaseId ? { ...phase, guideImage: imageUrl } : phase,
            ),
          },
        }
      }
      return huerta
    })

    setSoldHuertas(updatedHuertas)

    // Actualizar selectedHuerta también
    const updatedSelectedHuerta = updatedHuertas.find((h) => h.id === selectedHuerta?.id)
    setSelectedHuerta(updatedSelectedHuerta)

    setIsUploading(false)
    toast.success("Imagen de guía subida exitosamente")
  }

  const handleFileSelect = (phaseId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        handleImageUpload(phaseId, file)
      } else {
        toast.error("Por favor selecciona un archivo de imagen válido")
      }
    }
  }

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Huertas Vendidas</h1>
            <p className="text-gray-600">Gestiona las huertas vendidas y supervisa las jimas programadas</p>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por huerta, empresa o identificador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empresas</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid de huertas vendidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHuertas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No se encontraron huertas vendidas</p>
            </div>
          ) : (
            filteredHuertas.map((huerta) => (
              <div
                key={huerta.id}
                className="bg-orange-50 border border-orange-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Imagen con badges */}
                <div className="relative h-48">
                  <img
                    src={huerta.photoId || "/placeholder.svg"}
                    alt={huerta.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    <Camera className="h-3 w-3" />
                    {huerta.photos} fotos
                  </div>
                  {huerta.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Destacada
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-4">
                  {/* Título y status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{huerta.name}</h3>
                      <Badge className={getStatusColor(huerta.status)}>{huerta.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{huerta.number}</p>
                  </div>

                  {/* Tipo de agave */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                    <span>{huerta.type}</span>
                  </div>

                  {/* Cantidad de plantas */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Cantidad de Plantas</p>
                    <p className="text-3xl font-bold text-blue-600">{huerta.plants.toLocaleString()}</p>
                  </div>

                  {/* Información de ubicación */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Estado</span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">{huerta.state}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full ml-1" />
                        <span className="font-medium">Municipio</span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">{huerta.municipality}</p>
                    </div>
                  </div>

                  {/* Año y edad */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Año</p>
                        <p className="text-gray-900">{huerta.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Edad</p>
                        <p className="text-gray-900">{huerta.age}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ubicación con coordenadas */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Ubicación</p>
                        <p className="text-sm text-green-700">{huerta.coordinates}</p>
                      </div>
                      <Share2 className="h-4 w-4 text-green-600" />
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedHuerta(huerta)
                        setIsScheduleDialogOpen(true)
                      }}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Ver Programa de Jima
                    </Button>
                    <Button size="sm" className="w-full bg-green-600 text-white hover:bg-green-700">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Huerta
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedHuerta(huerta)
                        setIsOfferDialogOpen(true)
                      }}
                      className="w-full bg-gray-600 text-white hover:bg-gray-700"
                    >
                      <Building2 className="h-4 w-4 mr-1" />
                      Ver Detalle Oferta
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Función para ver ID Foto
                        toast.info("Funcionalidad de Ver ID Foto en desarrollo")
                      }}
                      className="w-full bg-orange-600 text-white hover:bg-orange-700"
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Ver Id Foto
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Función para ver ID Foto
                        toast.info("Funcionalidad de Ver ID Foto en desarrollo")
                      }}
                      className="w-full bg-red-600 text-white hover:bg-red-600"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Terminar Jima
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal para ver programa de jimas */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programa de Jimas</DialogTitle>
              <DialogDescription>
                {selectedHuerta?.name} - {selectedHuerta?.companyName}
              </DialogDescription>
            </DialogHeader>

            {selectedHuerta && (
              <div className="space-y-6 py-4">
                {/* Información básica de la huerta */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Información de la Huerta</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[120px]">Nombre:</span>
                      <span className="text-gray-900">{selectedHuerta.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[120px]">Empresa:</span>
                      <span className="text-gray-900">{selectedHuerta.companyName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[120px]">Total Plantas:</span>
                      <span className="text-gray-900">{selectedHuerta.plants.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[120px]">Precio de Venta:</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(selectedHuerta.salePrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Programación Semanal */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Programación Semanal de Viajes</h4>
                  <div className="space-y-6">
                    {selectedHuerta.jimaSchedule.weeklySchedule?.map((week: any, weekIndex: number) => (
                      <div key={weekIndex} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-900">{week.week}</h5>
                          <div className="flex items-center gap-2">
                            <Badge className={getPhaseStatusColor(week.status)}>
                              {getPhaseStatusText(week.status)}
                            </Badge>
                            <span className="text-sm font-semibold text-blue-600">Total: {week.totalTrips} viajes</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                          {week.days.map((day: any, dayIndex: number) => (
                            <div key={dayIndex} className="text-center p-3 bg-white rounded border">
                              <div className="text-xs font-medium text-gray-600 mb-1">{day.day}</div>
                              <div className="text-xs text-gray-500 mb-2">{formatDate(day.date)}</div>
                              <div
                                className={`text-2xl font-bold ${day.trips > 0 ? "text-green-600" : "text-gray-400"}`}
                              >
                                {day.trips}
                              </div>
                              <div className="text-xs text-gray-500">viajes</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fotos de Guías */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Fotos de Guías para la Empresa</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedHuerta.jimaSchedule.guidePhotos?.map((photo: any) => (
                      <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <h6 className="font-medium text-gray-900 text-sm mb-1">{photo.title}</h6>
                          <p className="text-xs text-gray-600">{photo.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal para ver detalle de oferta */}
        <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Oferta Aceptada</DialogTitle>
              <DialogDescription>
                {selectedHuerta?.name} - {selectedHuerta?.companyName}
              </DialogDescription>
            </DialogHeader>

            {selectedHuerta && selectedHuerta.acceptedOffer && (
              <div className="space-y-6 py-4">
                {/* Información de la empresa */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={selectedHuerta.acceptedOffer.companyLogo || "/placeholder.svg"}
                    alt={selectedHuerta.acceptedOffer.companyName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedHuerta.acceptedOffer.companyName}</h3>
                    <p className="text-sm text-gray-600">ID Oferta: {selectedHuerta.acceptedOffer.offerId}</p>
                    <p className="text-sm text-gray-600">Fecha: {formatDate(selectedHuerta.acceptedOffer.offerDate)}</p>
                  </div>
                </div>

                {/* Información de la oferta en un solo contenedor */}
                <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <h4 className="font-medium text-gray-900 mb-4">Detalles de la Oferta</h4>

                  <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600 block">Precio $:</span>
                        <p className="text-gray-900 text-base mt-1">${selectedHuerta.acceptedOffer.price} MXN/kg</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600 block">Cm de Jima:</span>
                        <p className="text-gray-900 text-base mt-1">{selectedHuerta.acceptedOffer.jimaSize}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600 block">Meses Financiado:</span>
                        <p className="text-gray-900 text-base mt-1">{selectedHuerta.acceptedOffer.financedMonths}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600 block">Fecha de Mes de Jima:</span>
                        <p className="text-gray-900 text-base mt-1">{selectedHuerta.acceptedOffer.jimaDate}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600 block">Se Jimará a Partir de:</span>
                        <p className="text-gray-900 text-base mt-1">{selectedHuerta.acceptedOffer.minimumKilos} para arriba</p>
                      </div>

                      <hr className="border-gray-200" />

                      <div>
                        <span className="text-sm font-medium text-gray-600 block">
                          Cómo Serían los Pagos de Viajes Jimados:
                        </span>
                        <p className="text-gray-900 text-sm mt-1">{selectedHuerta.acceptedOffer.paymentDetails}</p>
                      </div>

                      <hr className="border-gray-200" />

                      <div>
                        <span className="text-sm font-medium text-gray-600 block">
                          El Agave Sería Puesto en Fábrica o la Fábrica se Encargaría de Toda la Logística:
                        </span>
                        <p className="text-gray-900 text-sm mt-1">{selectedHuerta.acceptedOffer.logistics}</p>
                      </div>
                    </div>

                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
