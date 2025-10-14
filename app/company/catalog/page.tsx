"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CompanyLayout } from "@/components/company-layout"
import { AppLayout } from "@/components/layouts/app-layout"

import { Search, 
         MapPin, 
         Calendar, 
         Clock, 
         Share2, 
         Camera, 
         DollarSign } from "lucide-react"
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

export default function CompanyCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [offerAmount, setOfferAmount] = useState("")
  const [offerComments, setOfferComments] = useState("")
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)

  const huertas = [
    {
      id: 1,
      name: "Huerta Los Altos Premium",
      identifier: "HAP-2020-001",
      agaveType: "Azul Tequilana Weber",
      plantingYear: 2020,
      age: "4 años",
      plantCount: 27627,
      pricePerPlant: 45,
      totalPrice: 1243215,
      state: "Jalisco",
      municipality: "Tequila",
      coordinates: "20.8818, -103.8370",
      images: ["/agave-field-plantation.png"],
      photoCount: 8,
      status: "Disponible",
      featured: true,
    },
    {
      id: 2,
      name: "Plantación El Mirador",
      identifier: "PEM-2019-002",
      agaveType: "Azul Tequilana Weber",
      plantingYear: 2019,
      age: "5 años",
      plantCount: 23851,
      pricePerPlant: 52,
      totalPrice: 1240252,
      state: "Jalisco",
      municipality: "Arandas",
      coordinates: "20.7167, -102.3500",
      images: ["/agave-field-plantation.png"],
      photoCount: 12,
      status: "Disponible",
      featured: false,
    },
    {
      id: 3,
      name: "Hacienda Agave Real",
      identifier: "HAR-2018-003",
      agaveType: "Azul Tequilana Weber",
      plantingYear: 2018,
      age: "6 años",
      plantCount: 19500,
      pricePerPlant: 58,
      totalPrice: 1131000,
      state: "Nayarit",
      municipality: "Tepic",
      coordinates: "21.5041, -104.8942",
      images: ["/agave-field-plantation.png"],
      photoCount: 6,
      status: "Disponible",
      featured: true,
    },
  ]

  const filteredHuertas = huertas.filter((huerta) => {
    const matchesSearch =
      huerta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear === "all" || huerta.plantingYear.toString() === selectedYear

    return matchesSearch && matchesYear
  })

  const handleMakeOffer = async () => {
    if (!offerAmount || !selectedHuerta) return

    setIsSubmittingOffer(true)

    // Simular envío de oferta
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmittingOffer(false)
    setSelectedHuerta(null)
    setOfferAmount("")
    setOfferComments("")

    alert("Oferta enviada exitosamente. El administrador la revisará pronto.")
  }

  const handleShareLocation = (coordinates: string) => {
    const [lat, lng] = coordinates.split(", ")
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
    window.open(googleMapsUrl, "_blank")
  }

  return (
    <AppLayout type="company">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comprar Huertas</h1>
          <p className="text-gray-600 mt-2">Explora y adquiere huertas de agave disponibles</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Year Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Buscar por año</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedYear === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("all")}
                    className={selectedYear === "all" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={selectedYear === "2025" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("2025")}
                    className={selectedYear === "2025" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    2025
                  </Button>
                  <Button
                    variant={selectedYear === "2024" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("2024")}
                    className={selectedYear === "2024" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    2024
                  </Button>
                  <Button
                    variant={selectedYear === "2023" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("2023")}
                    className={selectedYear === "2023" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    2023
                  </Button>
                  <Button
                    variant={selectedYear === "2022" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("2022")}
                    className={selectedYear === "2022" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    2022
                  </Button>
                  <Button
                    variant={selectedYear === "2021" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("2021")}
                    className={selectedYear === "2021" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    2021
                  </Button>
                  <Button
                    variant={selectedYear === "2020" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("2020")}
                    className={selectedYear === "2020" ? "bg-teal-600 hover:bg-teal-700" : ""}
                  >
                    2020
                  </Button>
                </div>
              </div>

              {/* Search Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar huertas por nombre, agricultor o id"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Counter */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando {filteredHuertas.length} de {huertas.length} huertas
          </p>
        </div>

        {/* Huertas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHuertas.map((huerta) => (
            <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48">
                  <Image src={huerta.images[0] || "/placeholder.svg"} alt={huerta.name} fill className="object-cover" />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      <Camera className="h-3 w-3 mr-1" />
                      {huerta.photoCount} fotos
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Title and ID */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{huerta.name}</h3>
                    <p className="text-sm text-gray-500"># {huerta.identifier}</p>
                  </div>

                  {/* Agave Type */}
                  <div className="flex items-center gap-2">
                    <AgaveIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">{huerta.agaveType}</span>
                  </div>

                  {/* Plant Count */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cantidad de Plantas</span>
                    <span className="text-lg font-semibold text-blue-600">{huerta.plantCount.toLocaleString()}</span>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Estado</p>
                        <p className="text-sm font-medium text-gray-900">{huerta.state}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Municipio</p>
                        <p className="text-sm font-medium text-gray-900">{huerta.municipality}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Año</p>
                          <p className="text-sm font-medium text-gray-900">{huerta.plantingYear}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Edad</p>
                          <p className="text-sm font-medium text-gray-900">{huerta.age}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Section with Green Background */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-green-700 font-medium">Ubicación</p>
                        <p className="text-sm font-mono text-green-800">{huerta.coordinates}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShareLocation(huerta.coordinates)}
                        className="text-green-700 hover:bg-green-100"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">Ver Huerta</Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setSelectedHuerta(huerta)}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Hacer Oferta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Hacer Oferta</DialogTitle>
                          <DialogDescription>
                            {selectedHuerta?.name} - {selectedHuerta?.identifier}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="precio">Precio $ *</Label>
                            <Input
                              id="precio"
                              type="number"
                              placeholder="0"
                              value={offerAmount}
                              onChange={(e) => setOfferAmount(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cm-jima">Cm de Jima *</Label>
                            <Input id="cm-jima" type="number" placeholder="Centímetros" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="meses-financiado">Meses financiado *</Label>
                            <Input id="meses-financiado" type="number" placeholder="Número de meses" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fecha-jima">Fecha de mes de jima *</Label>
                            <Input id="fecha-jima" type="date" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="kilos-minimo">Se jimará a partir de * kilos para arriba *</Label>
                            <Input id="kilos-minimo" type="number" placeholder="Kilos mínimos" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pagos-viajes">Cómo serían los pagos de viajes jimados *</Label>
                            <textarea
                              id="pagos-viajes"
                              placeholder="Describe cómo serían los pagos..."
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
                              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                              rows={2}
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedHuerta(null)
                                setOfferAmount("")
                                setOfferComments("")
                              }}
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleMakeOffer}
                              disabled={!offerAmount || isSubmittingOffer}
                              className="flex-1 bg-teal-600 hover:bg-teal-700"
                            >
                              {isSubmittingOffer ? "Enviando..." : "Enviar Oferta"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHuertas.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron huertas</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
