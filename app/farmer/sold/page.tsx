"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
      d="M301.309,395.976c-18.87,15.93-47.081,13.547-63.011-5.323c-15.930-18.87-13.547-47.081,5.323-63.011
      c18.87-15.93,192.895-136.646,208.825-117.776C468.375,228.736,320.179,380.046,301.309,395.976z"
    />
  </svg>
)

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

  const handleIdPhoto = (sale: any) => {
    console.log("ID Foto para huerta:", sale.name)
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
                <AgaveIcon className="w-4 h-4 text-green-600" />
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
                  Ver Detalles
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
          {selectedSale && (
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                {selectedSale.acceptedOffer.companyName} - {selectedSale.acceptedOffer.offerId}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 min-w-[180px]">Precio $:</span>
                  <span className="font-medium">${selectedSale.acceptedOffer.pricePerKilo}/kg</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 min-w-[180px]">Cm de Jima:</span>
                  <span className="font-medium">{selectedSale.acceptedOffer.jimaSize}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 min-w-[180px]">Meses Financiado:</span>
                  <span className="font-medium">{selectedSale.acceptedOffer.financedMonths} meses</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 min-w-[180px]">Fecha de Mes de Jima:</span>
                  <span className="font-medium">{selectedSale.acceptedOffer.jimaMonth}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-gray-600 min-w-[180px]">Se Jimará a Partir de:</span>
                  <span className="font-medium">
                    {selectedSale.acceptedOffer.minimumKilos.toLocaleString()} kilos para arriba
                  </span>
                </div>

                <hr className="border-gray-200 my-4" />

                <div className="space-y-2">
                  <span className="text-gray-600 font-medium">Cómo Serían los Pagos de Viajes Jimados:</span>
                  <p className="text-gray-700">{selectedSale.acceptedOffer.paymentDetails}</p>
                </div>

                <hr className="border-gray-200 my-4" />

                <div className="space-y-2">
                  <span className="text-gray-600 font-medium">
                    El Agave Sería Puesto en Fábrica o la Fábrica se Encargaría de Toda la Logística:
                  </span>
                  <p className="text-gray-700">{selectedSale.acceptedOffer.logistics}</p>
                </div>
              </div>
            </div>
          )}
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
    </div>
  )
}
