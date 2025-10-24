"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Search,
  Calendar,
  DollarSign,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Hash,
  MapPin,
  Share2,
  Map,
  Building,
} from "lucide-react"
import { CompanyLayout } from "@/components/company-layout"
import { AppLayout } from "@/components/layouts/app-layout"

// Icono de Agave personalizado
const AgaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L10 8h4l-2-6zm0 0l2 6h4l-6-6zm0 0L8 8h4L12 2zm0 0L6 8l6-6zm0 0l6 6-6-6zm0 8l-2 6h4l-2-6zm0 0l2 6h4l-6-6zm0 0l-4 6h4l-4-6zm0 0l-6 6l6-6zm0 0l6 6-6-6z" />
  </svg>
)

export default function CompanyNegotiations() {
  const [searchTerm, setSearchTerm] = useState("")

  const offers = [
    {
      id: "NEG-2024-001",
      huertaName: "Huerta Los Altos Premium",
      huertaId: "HAP-2020-001",
      tipo: "Premium Tequilana Weber",
      farmer: "Juan Pérez García",
      farmerContact: "juan.perez@email.com",
      amount: "$2,850,000",
      date: "15 Mar 2024",
      status: "En Proceso",
      plants: 27627,
      age: "4 años",
      year: 2020,
      estado: "Jalisco",
      municipio: "Amatitán",
      ubicacion: "20.7969° N, 103.5581° W",
      lastActivity: "Hace 2 días",
    },
  ]

  const filteredOffers = offers.filter(
    (offer) =>
      offer.huertaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.huertaId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const inProcessOffers = filteredOffers.filter((offer) => offer.status === "En Proceso")
  const acceptedOffers = filteredOffers.filter((offer) => offer.status === "Aceptada")
  const rejectedOffers = filteredOffers.filter((offer) => offer.status === "Rechazada")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Proceso":
        return "bg-blue-100 text-blue-800"
      case "Aceptada":
        return "bg-green-100 text-green-800"
      case "Rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En Proceso":
        return <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
      case "Aceptada":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "Rechazada":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  const shareLocation = (ubicacion: string, nombre: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Ubicación de ${nombre}`,
        text: `Coordenadas: ${ubicacion}`,
        url: `https://maps.google.com/?q=${ubicacion}`,
      })
    } else {
      // Fallback para navegadores que no soportan Web Share API
      const url = `https://maps.google.com/?q=${ubicacion}`
      window.open(url, "_blank")
    }
  }

  const OfferCard = ({ offer }: { offer: any }) => (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {/* 1. Nombre */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 break-words leading-tight">
              {offer.huertaName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground break-words">{offer.huertaId}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(offer.status)} flex items-center gap-1 text-xs px-2 py-1 flex-shrink-0`}>
            {getStatusIcon(offer.status)}
            {offer.status}
          </Badge>
        </div>

        {/* Monto destacado */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
         
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 2. Tipo y 3. Cantidad de Plantas */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <h4 className="font-medium text-gray-900 mb-4">Detalles de la Oferta</h4>

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
            </div>
      </CardContent>
    </Card>
  )

  return (
    <AppLayout type="company">
      <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Barra de búsqueda */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por huerta, agricultor, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full text-sm sm:text-base"
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="process" className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 min-w-max">
                  <TabsTrigger value="process" className="text-xs sm:text-sm whitespace-nowrap">
                    En Proceso ({inProcessOffers.length})
                  </TabsTrigger>
                  <TabsTrigger value="accepted" className="text-xs sm:text-sm whitespace-nowrap">
                    Aceptadas ({acceptedOffers.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="text-xs sm:text-sm whitespace-nowrap">
                    Rechazadas ({rejectedOffers.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Contenido de las tabs */}
              <TabsContent value="process" className="w-full">
                {inProcessOffers.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {inProcessOffers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                ) : (
                  <Card className="w-full">
                    <CardContent className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground text-sm sm:text-base">No hay ofertas en proceso</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="accepted" className="w-full">
                {acceptedOffers.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {acceptedOffers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                ) : (
                  <Card className="w-full">
                    <CardContent className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground text-sm sm:text-base">No hay ofertas aceptadas</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="w-full">
                {rejectedOffers.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {rejectedOffers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                ) : (
                  <Card className="w-full">
                    <CardContent className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground text-sm sm:text-base">No hay ofertas rechazadas</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
