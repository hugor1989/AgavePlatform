"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Calendar,
  MapPin,
  Camera,
  Eye,
  Clock,
  DollarSign,
  CheckCircle,
  Award as IdCard,
  FileText,
} from "lucide-react"
import Image from "next/image"



export default function FarmerSoldPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [showSaleDialog, setShowSaleDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const soldHuertas = [
    {
      id: "VND-2024-001",
      name: "Huerta Los Altos Premium",
      type: "Azul Tequilana Weber",
      age: "4 años",
      plants: 27627,
      saleDate: "15 Mar 2024",
      status: "Vendida",
      photos: 8,
      state: "Jalisco",
      municipality: "Tequila",
      year: 2020,
      location: "20.8818, -103.8370",
      area: "12 hectáreas",
      finalPrice: "$2,850,000",
      pricePerPlant: "$103.15",
      buyer: "Tequila Premium S.A. de C.V.",
      buyerType: "Empresa",
      description: "Excelente huerta con agave de alta calidad, ideal para producción de tequila premium.",
      soilType: "Arcilloso-arenoso",
      irrigation: "Temporal",
      certification: "CRT Certificado",
      contractDate: "10 Mar 2024",
      deliveryDate: "20 Mar 2024",
      // Información de la oferta aceptada
      acceptedOffer: {
        companyName: "Tequila Premium S.A. de C.V.",
        companyLogo: "/placeholder.svg?height=40&width=40&text=TP",
        offerId: "TP-2024-001",
        offerDate: "2024-03-05T10:00:00Z",
        pricePerKilo: 31.5,
        jimaSize: "38 cm mínimo",
        financedMonths: 18,
        jimaMonth: "Marzo 2024",
        minimumKilos: 50000,
        paymentDetails: "Pago quincenal por viajes jimados, liquidación inmediata al entregar en báscula",
        logistics: "La empresa se encarga de toda la logística desde el corte hasta la entrega en fábrica",
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
    {
      id: "VND-2024-002",
      name: "Rancho San Miguel",
      type: "Azul Tequilana Weber",
      age: "5 años",
      plants: 23851,
      saleDate: "22 Feb 2024",
      status: "Entregada",
      photos: 12,
      state: "Jalisco",
      municipality: "Arandas",
      year: 2019,
      location: "20.7167, -102.3500",
      area: "18 hectáreas",
      finalPrice: "$3,200,000",
      pricePerPlant: "$134.22",
      buyer: "Agave Investments LLC",
      buyerType: "Empresa",
      description: "Huerta con excelente desarrollo y ubicación estratégica.",
      soilType: "Franco-arcilloso",
      irrigation: "Mixto",
      certification: "En proceso",
      contractDate: "18 Feb 2024",
      deliveryDate: "25 Feb 2024",
      acceptedOffer: {
        companyName: "Agave Investments LLC",
        companyLogo: "/placeholder.svg?height=40&width=40&text=AI",
        offerId: "AI-2024-002",
        offerDate: "2024-02-15T14:30:00Z",
        pricePerKilo: 29.75,
        jimaSize: "35 cm mínimo",
        financedMonths: 12,
        jimaMonth: "Febrero 2024",
        minimumKilos: 35000,
        paymentDetails: "Pago semanal por viajes jimados, con adelanto del 20% al iniciar",
        logistics: "Agricultor entrega agave puesto en fábrica, empresa proporciona transporte",
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
    {
      id: "VND-2023-015",
      name: "Hacienda El Agave",
      type: "Azul Tequilana Weber",
      age: "6 años",
      plants: 19500,
      saleDate: "08 Dec 2023",
      status: "Completada",
      photos: 6,
      state: "Nayarit",
      municipality: "Tepic",
      year: 2018,
      location: "21.5041, -104.8942",
      area: "15 hectáreas",
      finalPrice: "$2,950,000",
      pricePerPlant: "$151.28",
      buyer: "Destilería Artesanal del Norte",
      buyerType: "Empresa",
      description: "Huerta tradicional con manejo orgánico y certificaciones internacionales.",
      soilType: "Franco",
      irrigation: "Temporal",
      certification: "Orgánico Certificado",
      contractDate: "05 Dec 2023",
      deliveryDate: "12 Dec 2023",
      acceptedOffer: {
        companyName: "Destilería Artesanal del Norte",
        companyLogo: "/placeholder.svg?height=40&width=40&text=DA",
        offerId: "DA-2023-015",
        offerDate: "2023-12-01T16:45:00Z",
        pricePerKilo: 33.25,
        jimaSize: "40 cm mínimo",
        financedMonths: 24,
        jimaMonth: "Diciembre 2023",
        minimumKilos: 60000,
        paymentDetails: "Pago mensual por viajes jimados, bonificación por calidad superior",
        logistics: "Empresa se encarga de toda la logística, incluye seguro de transporte",
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

  const filteredSales = soldHuertas.filter(
    (sale) =>
      sale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewSale = (sale: any) => {
    setSelectedSale(sale)
    setShowSaleDialog(true)
  }

  const handleViewHuerta = (sale: any) => {
    console.log("Ver huerta:", sale.name)
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
  const handleIdPhoto = (sale: any) => {
    console.log("ID Foto para huerta:", sale.name)
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
  const handleViewSchedule = (sale: any) => {
    setSelectedSale(sale)
    setShowScheduleDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vendida":
        return "bg-green-500 text-white"
      case "Entregada":
        return "bg-blue-500 text-white"
      case "Completada":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Huertas Vendidas</h1>
        <p className="text-muted-foreground">Historial de todas tus huertas vendidas exitosamente</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, identificador o comprador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSales.map((sale) => (
          <Card
            key={sale.id}
            className="overflow-hidden hover:shadow-lg transition-shadow bg-orange-50 border-orange-200"
          >
            <div className="relative">
              <Image
                src="/agave-field-plantation.png"
                alt={sale.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                  <Camera className="w-3 h-3 mr-1" />
                  {sale.photos} fotos
                </Badge>
                <Badge variant="secondary" className={getStatusColor(sale.status)}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {sale.status}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-green-600 text-white">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {sale.finalPrice}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{sale.name}</h3>
                <p className="text-sm text-gray-500">#{sale.id}</p>
              </div>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-900">{sale.type}</span>
              </div>

              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                <span className="text-2xl font-bold text-blue-600">{sale.plants.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-sm font-medium text-gray-900">{sale.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Municipio</p>
                    <p className="text-sm font-medium text-gray-900">{sale.municipality}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Año</p>
                    <p className="text-sm font-medium text-gray-900">{sale.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="text-sm font-medium text-gray-900">{sale.age}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleViewSale(sale)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Detalles de Oferta
                </Button>

                <Button
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                  onClick={() => handleViewHuerta(sale)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Huerta
                </Button>

                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => handleIdPhoto(sale)}
                >
                  <IdCard className="w-4 h-4 mr-2" />
                  ID Foto
                </Button>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleViewSchedule(sale)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Programa de Jima
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para ver detalles de la oferta aceptada */}
      <Dialog open={showSaleDialog} onOpenChange={setShowSaleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Oferta Aceptada - {selectedSale?.name}</DialogTitle>
          </DialogHeader>
           <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="precio">Precio $ *</Label>
                            <Input
                              id="precio"
                              type="number"
                              readOnly
                              placeholder="0"
                              value="500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cm-jima">Cm de Jima *</Label>
                            <Input id="cm-jima" type="number" placeholder="Centímetros" readOnly value={5} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="meses-financiado">Meses financiado *</Label>
                            <Input id="meses-financiado" type="number" placeholder="Número de meses" readOnly value={5} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fecha-jima">Fecha de mes de jima *</Label>
                            <Input id="fecha-jima" type="date" readOnly value={"Marzo 2025"} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="kilos-minimo">Se jimará a partir de * kilos para arriba *</Label>
                            <Input id="kilos-minimo" type="number" placeholder="Kilos mínimos" readOnly value={15} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pagos-viajes">Cómo serían los pagos de viajes jimados *</Label>
                            <textarea
                              id="pagos-viajes"
                              placeholder="Describe cómo serían los pagos..."
                              readOnly
                              value={"Pago contra entrega por viaje completado"}
                              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="logistica">
                              El Agave sería puesto en fábrica o la fábrica se encargaría de toda la logística *
                            </Label>
                            <textarea
                              id="logistica"
                              placeholder="Especifica la logística..."
                              readOnly
                              value={"La fábrica se encarga de toda la logística de transporte"}
                              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                              rows={2}
                            />
                          </div>
           </div>
        </DialogContent>
      </Dialog>

      {/* Modal para ver programa de jima */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Programa de Jima - {selectedSale?.name}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Información del Programa</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Empresa:</span>
                    <p className="font-medium">{selectedSale.buyer}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mes de Jima:</span>
                    <p className="font-medium">{selectedSale.acceptedOffer.jimaMonth}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Plantas:</span>
                    <p className="font-medium">{selectedSale.plants.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Precio por Kg:</span>
                    <p className="font-medium">${selectedSale.acceptedOffer.pricePerKilo}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Estado del Programa</h4>
                <p className="text-sm text-gray-700">
                  El programa de jima está programado para {selectedSale.acceptedOffer.jimaMonth}. Se realizará la jima
                  de {selectedSale.plants.toLocaleString()} plantas con un tamaño mínimo de{" "}
                  {selectedSale.acceptedOffer.jimaSize}.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

       <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programa de Jimas</DialogTitle>
              <DialogDescription>
                {selectedSale?.name} - {selectedSale?.companyName}
              </DialogDescription>
            </DialogHeader>

            {selectedSale && (
              <div className="space-y-6 py-4">
                {/* Información básica de la huerta */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Información de la Huerta</h4>
                  <div className="space-y-3">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[120px]">Empresa:</span>
                      <span className="text-gray-900">PATITA</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[120px]">Precio de Venta:</span>
                      <span className="text-green-600 font-semibold">500</span>
                    </div>
                  </div>
                </div>

                {/* Programación Semanal */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Programación Semanal de Viajes</h4>
                  <div className="space-y-6">
                    {selectedSale.jimaSchedule.weeklySchedule?.map((week: any, weekIndex: number) => (
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
                    {selectedSale.jimaSchedule.guidePhotos?.map((photo: any) => (
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
    </div>
  )
}
