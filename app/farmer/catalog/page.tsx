"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Camera, Share2 } from "lucide-react"
import Image from "next/image"

const huertas = [
  {
    id: "HAP-2020-001",
    name: "Huerta Los Altos Premium",
    type: "Azul Tequilana Weber",
    plants: 27627,
    state: "Jalisco",
    municipality: "Tequila",
    year: 2020,
    age: 4,
    location: "20.8818, -103.8370",
    photos: 8,
    image: "/agave-field-plantation.png",
    status: "Disponible",
  },
  {
    id: "HAG-2019-002",
    name: "Plantación El Mirador",
    type: "Azul Tequilana Weber",
    plants: 15420,
    state: "Nayarit",
    municipality: "Ahuacatlán",
    year: 2019,
    age: 5,
    location: "21.0581, -104.4861",
    photos: 12,
    image: "/agave-field-plantation.png",
    status: "Disponible",
  },
  {
    id: "HAV-2021-003",
    name: "Agavera Valle Verde",
    type: "Azul Tequilana Weber",
    plants: 32150,
    state: "Jalisco",
    municipality: "Amatitán",
    year: 2021,
    age: 3,
    location: "20.7969, -103.6431",
    photos: 6,
    image: "/agave-field-plantation.png",
    status: "Disponible",
  },
  {
    id: "HAT-2018-004",
    name: "Terrenos San José",
    type: "Azul Tequilana Weber",
    plants: 18900,
    state: "Jalisco",
    municipality: "El Arenal",
    year: 2018,
    age: 6,
    location: "20.6847, -103.5931",
    photos: 15,
    image: "/agave-field-plantation.png",
    status: "Disponible",
  },
  {
    id: "HAC-2020-005",
    name: "Campo Los Cerritos",
    type: "Azul Tequilana Weber",
    plants: 24680,
    state: "Nayarit",
    municipality: "Jala",
    year: 2020,
    age: 4,
    location: "21.0789, -104.4756",
    photos: 9,
    image: "/agave-field-plantation.png",
    status: "Disponible",
  },
  {
    id: "HAP-2019-006",
    name: "Predio La Esperanza",
    type: "Azul Tequilana Weber",
    plants: 21340,
    state: "Jalisco",
    municipality: "Magdalena",
    year: 2019,
    age: 5,
    location: "20.9167, -103.9833",
    photos: 11,
    image: "/agave-field-plantation.png",
    status: "Disponible",
  },
]

export default function FarmerCatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Huertas</h1>
        <p className="text-gray-600">Explora todas las huertas disponibles en la plataforma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {huertas.map((huerta) => (
          <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={huerta.image || "/placeholder.svg"}
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
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{huerta.name}</h3>
                <p className="text-sm text-gray-500">#{huerta.id}</p>
              </div>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-900">{huerta.type}</span>
              </div>

              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                <span className="text-2xl font-bold text-blue-600">{huerta.plants.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-sm font-medium text-gray-900">{huerta.state}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
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
                    <p className="text-sm font-medium text-gray-900">{huerta.age} años</p>
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

              <Button className="w-full bg-teal-600 hover:bg-teal-700">Ver Huerta</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
