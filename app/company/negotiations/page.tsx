"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
    {
      id: "NEG-2024-002",
      huertaName: "Rancho San Miguel",
      huertaId: "ASM-2021-002",
      tipo: "Azul Tequilana Weber",
      farmer: "Carlos Rodríguez Mendoza",
      farmerContact: "carlos.rodriguez@email.com",
      amount: "$3,100,000",
      date: "12 Mar 2024",
      status: "En Proceso",
      plants: 18900,
      age: "3 años",
      year: 2021,
      estado: "Nayarit",
      municipio: "Tepic",
      ubicacion: "21.5041° N, 104.8942° W",
      lastActivity: "Hace 1 hora",
    },
    {
      id: "NEG-2024-003",
      huertaName: "Plantación El Mirador",
      huertaId: "PEM-2019-003",
      tipo: "Premium Tequilana Weber",
      farmer: "María González López",
      farmerContact: "maria.gonzalez@email.com",
      amount: "$2,950,000",
      date: "10 Mar 2024",
      status: "Aceptada",
      plants: 22450,
      age: "5 años",
      year: 2019,
      estado: "Guanajuato",
      municipio: "León",
      ubicacion: "21.1619° N, 101.6739° W",
      lastActivity: "Hace 5 días",
    },
    {
      id: "NEG-2024-004",
      huertaName: "Agavera del Valle",
      huertaId: "ADV-2022-004",
      tipo: "Azul Tequilana Weber",
      farmer: "Roberto Martínez Sánchez",
      farmerContact: "roberto.martinez@email.com",
      amount: "$1,750,000",
      date: "08 Mar 2024",
      status: "Rechazada",
      plants: 15200,
      age: "2 años",
      year: 2022,
      estado: "Michoacán",
      municipio: "Uruapan",
      ubicacion: "19.4204° N, 102.0631° W",
      lastActivity: "Hace 1 semana",
    },
    {
      id: "NEG-2024-005",
      huertaName: "Hacienda Agave Real",
      huertaId: "HAR-2020-005",
      tipo: "Premium Tequilana Weber",
      farmer: "Ana Patricia Morales",
      farmerContact: "ana.morales@email.com",
      amount: "$4,200,000",
      date: "05 Mar 2024",
      status: "En Proceso",
      plants: 35600,
      age: "4 años",
      year: 2020,
      estado: "Jalisco",
      municipio: "Tequila",
      ubicacion: "20.8818° N, 103.8370° W",
      lastActivity: "Hace 3 días",
    },
    {
      id: "NEG-2024-006",
      huertaName: "Campo Verde Premium",
      huertaId: "CVP-2021-006",
      tipo: "Azul Tequilana Weber",
      farmer: "Luis Fernando Castro",
      farmerContact: "luis.castro@email.com",
      amount: "$1,950,000",
      date: "02 Mar 2024",
      status: "Aceptada",
      plants: 19800,
      age: "3 años",
      year: 2021,
      estado: "Jalisco",
      municipio: "Zapopan",
      ubicacion: "20.7214° N, 103.3918° W",
      lastActivity: "Hace 1 semana",
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
          <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-lg sm:text-xl font-bold text-green-600 break-all">{offer.amount}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 2. Tipo y 3. Cantidad de Plantas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <AgaveIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-green-600 font-medium">Tipo</p>
              <p className="text-sm font-bold text-green-800 break-words">{offer.tipo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <div className="h-4 w-4 bg-blue-600 rounded-full flex-shrink-0"></div>
            <div className="min-w-0">
              <p className="text-xs text-blue-600 font-medium">Cantidad de Plantas</p>
              <p className="text-sm font-bold text-blue-800">{offer.plants.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 4. Estado y 5. Municipio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
            <Map className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-purple-600 font-medium">Estado</p>
              <p className="text-sm font-bold text-purple-800 break-words">{offer.estado}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
            <Building className="h-4 w-4 text-indigo-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-indigo-600 font-medium">Municipio</p>
              <p className="text-sm font-bold text-indigo-800 break-words">{offer.municipio}</p>
            </div>
          </div>
        </div>

        {/* 6. Año y 7. Edad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-orange-600 font-medium">Año</p>
              <p className="text-sm font-bold text-orange-800">{offer.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg">
            <Clock className="h-4 w-4 text-pink-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-pink-600 font-medium">Edad</p>
              <p className="text-sm font-bold text-pink-800">{offer.age}</p>
            </div>
          </div>
        </div>

        {/* 8. Ubicación que pueda compartir */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600 font-medium">Ubicación</p>
                <p className="text-sm font-mono text-gray-800 break-all">{offer.ubicacion}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => shareLocation(offer.ubicacion, offer.huertaName)}
              className="flex-shrink-0"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Compartir</span>
            </Button>
          </div>
        </div>

        {/* Fechas importantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <div>
              <span className="font-medium">Fecha de oferta:</span>
              <p>{offer.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <div>
              <span className="font-medium">Última actividad:</span>
              <p>{offer.lastActivity}</p>
            </div>
          </div>
        </div>

        {/* Mensaje de estado para ofertas en proceso */}
        {offer.status === "En Proceso" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Esperando respuesta</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              Tu oferta ha sido enviada y está siendo revisada por el administrador. Te notificaremos cuando haya una
              respuesta.
            </p>
          </div>
        )}

        {/* Mensaje para ofertas aceptadas */}
        {offer.status === "Aceptada" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800">¡Oferta aceptada!</span>
            </div>
            <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
              Tu oferta ha sido aceptada. Pronto recibirás información sobre los siguientes pasos del proceso.
            </p>
          </div>
        )}

        {/* Mensaje para ofertas rechazadas */}
        {offer.status === "Rechazada" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-sm font-medium text-red-800">Oferta rechazada</span>
            </div>
            <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
              Tu oferta no fue aceptada en esta ocasión. Puedes intentar con otras huertas disponibles.
            </p>
          </div>
        )}
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
