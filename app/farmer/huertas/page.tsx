"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Calendar, MapPin, Camera, Eye, Clock, Share2, Award as IdCard } from "lucide-react"
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

export default function FarmerHuertasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [showHuertaDialog, setShowHuertaDialog] = useState(false)

  const huertas = [
    {
      id: "HVD-2024-001",
      name: "Huerta Los Altos Premium",
      type: "Azul Tequilana Weber",
      age: "4 años",
      plants: 27627,
      registrationDate: "15 Mar 2024",
      status: "Activa",
      photos: 8,
      state: "Jalisco",
      municipality: "Tequila",
      year: 2020,
      location: "20.8818, -103.8370",
      area: "12 hectáreas",
      price: "$2,850,000",
      description: "Excelente huerta con agave de alta calidad, ideal para producción de tequila premium.",
      soilType: "Arcilloso-arenoso",
      irrigation: "Temporal",
      certification: "CRT Certificado",
    },
    {
      id: "HVD-2024-002",
      name: "Rancho San Miguel",
      type: "Azul Tequilana Weber",
      age: "5 años",
      plants: 23851,
      registrationDate: "22 Feb 2024",
      status: "En Revisión",
      photos: 12,
      state: "Jalisco",
      municipality: "Arandas",
      year: 2019,
      location: "20.7167, -102.3500",
      area: "18 hectáreas",
      price: "$3,200,000",
      description: "Huerta con excelente desarrollo y ubicación estratégica.",
      soilType: "Franco-arcilloso",
      irrigation: "Mixto",
      certification: "En proceso",
    },
    {
      id: "HVD-2024-003",
      name: "Hacienda El Agave",
      type: "Azul Tequilana Weber",
      age: "6 años",
      plants: 19500,
      registrationDate: "08 Jan 2024",
      status: "Activa",
      photos: 6,
      state: "Nayarit",
      municipality: "Tepic",
      year: 2018,
      location: "21.5041, -104.8942",
      area: "15 hectáreas",
      price: "$2,950,000",
      description: "Huerta tradicional con manejo orgánico y certificaciones internacionales.",
      soilType: "Franco",
      irrigation: "Temporal",
      certification: "Orgánico Certificado",
    },
  ]

  const filteredHuertas = huertas.filter(
    (huerta) =>
      huerta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewHuerta = (huerta: any) => {
    setSelectedHuerta(huerta)
    setShowHuertaDialog(true)
  }

  const handleIdPhoto = (huerta: any) => {
    // Función para manejar la acción del botón Id Foto
    console.log("Id Foto clicked for:", huerta.name)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Huertas</h1>
        <p className="text-muted-foreground">Gestiona y visualiza todas tus huertas registradas</p>
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
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                  onClick={() => handleIdPhoto(huerta)}
                >
                  <IdCard className="w-4 h-4 mr-2" />
                  Id Foto
                </Button>

                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleViewHuerta(huerta)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Huerta
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showHuertaDialog} onOpenChange={setShowHuertaDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedHuerta?.name}</DialogTitle>
          </DialogHeader>
          {selectedHuerta && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src="/agave-field-plantation.png"
                    alt={selectedHuerta.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      <Camera className="w-3 h-3 mr-1" />
                      {selectedHuerta.photos} fotos
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        selectedHuerta.status === "Activa" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                      }
                    >
                      {selectedHuerta.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>{selectedHuerta.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edad:</span>
                      <span>{selectedHuerta.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID Identificador:</span>
                      <span>{selectedHuerta.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cantidad de Plantas:</span>
                      <span>{selectedHuerta.plants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Área:</span>
                      <span>{selectedHuerta.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span>{selectedHuerta.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Registro:</span>
                      <span>{selectedHuerta.registrationDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Características</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo de Suelo:</span>
                      <span>{selectedHuerta.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Riego:</span>
                      <span>{selectedHuerta.irrigation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificación:</span>
                      <span>{selectedHuerta.certification}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-sm text-muted-foreground">{selectedHuerta.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
