"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Calendar, MapPin, Camera, Eye, Clock, Building2, Check, X } from "lucide-react"
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

export default function FarmerOffersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [showOffersDialog, setShowOffersDialog] = useState(false)

  const huertas = [
    {
      id: "HVD-2024-001",
      huertaName: "Huerta Los Altos Premium",
      type: "Azul Tequilana Weber",
      age: "4 años",
      plants: 27627,
      photos: 8,
      state: "Jalisco",
      municipality: "Tequila",
      year: 2020,
      area: "12 hectáreas",
      totalOffers: 3,
      offers: [
        {
          id: "OFR-001",
          companyName: "Tequila Premium S.A.",
          companyLogo: "/placeholder-n4bzz.png",
          fechaOferta: "20 Mar 2024",
          status: "Pendiente",
          precio: "$145.50",
          cmJima: "35 cm",
          mesesFinanciado: "18 meses",
          fechaMesJima: "Octubre 2024",
          kilosMinimos: "800 kilos",
          pagosViajes: "Pago semanal por viaje completado, $2,500 por tonelada transportada",
          logistica: "La fábrica se encarga de toda la logística de recolección y transporte",
        },
        {
          id: "OFR-002",
          companyName: "Destiladora Azteca",
          companyLogo: "/placeholder-n4bzz.png",
          fechaOferta: "18 Mar 2024",
          status: "Pendiente",
          precio: "$152.75",
          cmJima: "38 cm",
          mesesFinanciado: "24 meses",
          fechaMesJima: "Septiembre 2024",
          kilosMinimos: "1000 kilos",
          pagosViajes: "Pago quincenal, $2,800 por tonelada con bonificación por volumen",
          logistica: "Agave puesto en fábrica, agricultor se encarga del transporte",
        },
        {
          id: "OFR-003",
          companyName: "Grupo Agavero Nacional",
          companyLogo: "/placeholder-n4bzz.png",
          fechaOferta: "15 Mar 2024",
          status: "Pendiente",
          precio: "$148.25",
          cmJima: "40 cm",
          mesesFinanciado: "12 meses",
          fechaMesJima: "Noviembre 2024",
          kilosMinimos: "600 kilos",
          pagosViajes: "Pago mensual, $2,400 por tonelada, pago al contado",
          logistica: "Fábrica se encarga de toda la logística incluyendo personal especializado",
        },
      ],
    },
    {
      id: "HVD-2024-002",
      huertaName: "Rancho San Miguel",
      type: "Azul Tequilana Weber",
      age: "5 años",
      plants: 23851,
      photos: 12,
      state: "Jalisco",
      municipality: "Arandas",
      year: 2019,
      area: "18 hectáreas",
      totalOffers: 2,
      offers: [
        {
          id: "OFR-004",
          companyName: "Tequila Artesanal Mexicano",
          companyLogo: "/placeholder-n4bzz.png",
          fechaOferta: "22 Mar 2024",
          status: "Pendiente",
          precio: "$158.90",
          cmJima: "42 cm",
          mesesFinanciado: "20 meses",
          fechaMesJima: "Agosto 2024",
          kilosMinimos: "900 kilos",
          pagosViajes: "Pago por lote completo, $3,000 por tonelada",
          logistica: "Logística compartida, fábrica proporciona transporte especializado",
        },
        {
          id: "OFR-005",
          companyName: "Destilados del Valle",
          companyLogo: "/placeholder-n4bzz.png",
          fechaOferta: "19 Mar 2024",
          status: "Pendiente",
          precio: "$144.60",
          cmJima: "36 cm",
          mesesFinanciado: "15 meses",
          fechaMesJima: "Octubre 2024",
          kilosMinimos: "750 kilos",
          pagosViajes: "Pago semanal, $2,600 por tonelada más bonos por calidad",
          logistica: "Agricultor entrega en punto de acopio, fábrica maneja distribución",
        },
      ],
    },
    {
      id: "HVD-2024-003",
      huertaName: "Hacienda El Agave",
      type: "Azul Tequilana Weber",
      age: "6 años",
      plants: 19500,
      photos: 6,
      state: "Nayarit",
      municipality: "Tepic",
      year: 2018,
      area: "15 hectáreas",
      totalOffers: 1,
      offers: [
        {
          id: "OFR-006",
          companyName: "Tequila Tradicional de México",
          companyLogo: "/placeholder-n4bzz.png",
          fechaOferta: "25 Mar 2024",
          status: "Pendiente",
          precio: "$162.40",
          cmJima: "45 cm",
          mesesFinanciado: "36 meses",
          fechaMesJima: "Diciembre 2024",
          kilosMinimos: "500 kilos",
          pagosViajes: "Pago mensual anticipado, $3,200 por tonelada",
          logistica: "Servicio completo puerta a puerta, incluye personal especializado y equipo",
        },
      ],
    },
  ]

  const filteredHuertas = huertas.filter(
    (huerta) =>
      huerta.huertaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewOffers = (huerta: any) => {
    setSelectedHuerta(huerta)
    setShowOffersDialog(true)
  }

  const handleAcceptOffer = (offerId: string) => {
    console.log(`Oferta aceptada: ${offerId}`)
    // Aquí iría la lógica para aceptar la oferta
  }

  const handleRejectOffer = (offerId: string) => {
    console.log(`Oferta rechazada: ${offerId}`)
    // Aquí iría la lógica para rechazar la oferta
  }

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-500 text-white"
      case "Aceptada":
        return "bg-green-500 text-white"
      case "Rechazada":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Ofertas</h1>
        <p className="text-muted-foreground">Revisa y gestiona las ofertas recibidas para tus huertas</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar huertas por nombre o identificador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHuertas.map((huerta) => (
          <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src="/agave-field-plantation.png"
                alt={huerta.huertaName}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                  <Camera className="w-3 h-3 mr-1" />
                  {huerta.photos} fotos
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-orange-600 text-white">
                  {huerta.totalOffers} {huerta.totalOffers === 1 ? "oferta" : "ofertas"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{huerta.huertaName}</h3>
                <p className="text-sm text-gray-500">#{huerta.id}</p>
              </div>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <AgaveIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">{huerta.type}</span>
              </div>

              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                <span className="text-2xl font-bold text-blue-600">{huerta.plants.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-sm font-medium text-gray-900">{huerta.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Municipio</p>
                    <p className="text-sm font-medium text-gray-900">{huerta.municipality}</p>
                  </div>
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

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Ofertas Recibidas</span>
                  </div>
                  <span className="text-lg font-bold text-orange-800">{huerta.totalOffers}</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  {huerta.totalOffers === 1 ? "Nueva oferta disponible" : `${huerta.totalOffers} ofertas para revisar`}
                </p>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleViewOffers(huerta)}>
                <Eye className="w-4 h-4 mr-2" />
                Ver Ofertas
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showOffersDialog} onOpenChange={setShowOffersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700">
              Ofertas para {selectedHuerta?.huertaName}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedHuerta?.totalOffers}{" "}
              {selectedHuerta?.totalOffers === 1 ? "oferta recibida" : "ofertas recibidas"}
            </p>
          </DialogHeader>
          {selectedHuerta && (
            <div className="space-y-6">
              {selectedHuerta.offers.map((offer: any, index: number) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{offer.companyName}</h3>
                        <p className="text-sm text-gray-500">
                          Oferta #{offer.id} • {offer.fechaOferta}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={getOfferStatusColor(offer.status)}>
                      {offer.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 min-w-[140px]">Precio $:</span>
                      <span className="font-semibold text-gray-900">{offer.precio}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 min-w-[140px]">Cm de Jima:</span>
                      <span className="font-semibold text-gray-900">{offer.cmJima}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 min-w-[140px]">Meses Financiado:</span>
                      <span className="font-semibold text-gray-900">{offer.mesesFinanciado}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 min-w-[140px]">Fecha de Mes de Jima:</span>
                      <span className="font-semibold text-gray-900">{offer.fechaMesJima}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 min-w-[140px]">Se Jimará a Partir de:</span>
                      <span className="font-semibold text-gray-900">{offer.kilosMinimos} para arriba</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Cómo Serían los Pagos de Viajes Jimados:</span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">{offer.pagosViajes}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">
                          El Agave Sería Puesto en Fábrica o la Fábrica se Encargaría de Toda la Logística:
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">{offer.logistica}</p>
                    </div>
                  </div>

                  {offer.status === "Pendiente" && (
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptOffer(offer.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aceptar Oferta
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 bg-transparent"
                        onClick={() => handleRejectOffer(offer.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rechazar Oferta
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
