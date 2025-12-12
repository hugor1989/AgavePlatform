"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Camera, Share2 } from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { orchardService } from "@/services/orchardService"

export default function FarmerCatalogPage() {
  const [huertas, setHuertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState("all")

  // -----------------------------------------
  // 🔵 Usar nuevo endpoint: catálogo completo
  // -----------------------------------------
  useEffect(() => {
    const fetchHuertas = async () => {
      try {
        const response = await orchardService.catalog()
        setHuertas(response ?? [])
      } catch (error) {
        console.error("Error cargando huertas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHuertas()
  }, [])

  // -----------------------------------------
  // 🔵 Obtención dinámica de años
  // -----------------------------------------
  const years = useMemo(() => {
    const setYears = new Set<number>()
    huertas.forEach((h) => {
      if (h.year) setYears.add(h.year)
    })
    return Array.from(setYears).sort((a, b) => b - a)
  }, [huertas])

  // -----------------------------------------
  // 🔵 Filtrar por año
  // -----------------------------------------
  const filteredHuertas = useMemo(() => {
    if (selectedYear === "all") return huertas
    return huertas.filter((h) => h.year == selectedYear)
  }, [huertas, selectedYear])


  return (
    <AppLayout type="farmer">
      <div className="space-y-6">
        {/* TÍTULO */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Huertas</h1>
          <p className="text-gray-600">Explora todas las huertas disponibles en la plataforma</p>
        </div>

        {/* 🔸 FILTRO POR AÑO — Igual al admin */}
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

        {/* LOADING */}
        {loading && <p className="text-gray-500">Cargando huertas...</p>}

        {/* CARDS — mismo diseño */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHuertas.map((huerta) => (
            <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={orchardService.getPhotoUrl(huerta.photo_id) || "/agave-field-plantation.png"}
                  alt={huerta.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                    <Camera className="w-3 h-3 mr-1" />
                    {huerta.photos_count ?? 0} fotos
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
                  <span className="text-sm font-medium text-gray-900">
                    {huerta?.agave_type?.name}
                  </span>
                </div>

                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                  <span className="text-2xl font-bold text-blue-600">
                    {huerta.plant_quantity?.toLocaleString()}
                  </span>
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
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
                      <p className="text-sm font-medium text-gray-900">
                        {huerta.age ?? "-"} años
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium">Ubicación</p>
                      <p className="text-sm font-mono text-green-800">
                        {huerta.latitude}, {huerta.longitude}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                      <Share2 className="w-4 h-4 text-green-700" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Ver Huerta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
