"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Camera, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { orchardService } from "@/services/orchardService"

export default function FarmerCatalogPage() {
  const [huertas, setHuertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState("all")
  const [activeImageIndex, setActiveImageIndex] = useState<{[key: number]: number}>({})
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
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

  const handleViewPhoto = (photoPath: string | null) => {
      const photoUrl = orchardService.getPhotoUrl(photoPath) || "/placeholder.svg"
      setSelectedPhoto(photoUrl)
      setIsPhotoDialogOpen(true)
  }

  const handleOpenLocation = (url: string) => {
    if (!url) return

    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

      let finalUrl = url

      // Si es iOS y viene un link de Google Maps → convertir a Apple Maps
      if (isIOS && url.includes("google.com/maps")) {
        finalUrl = url.replace("https://www.google.com/maps", "https://maps.apple.com")
      }

      window.open(finalUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error al abrir ubicación:", error)
    }
  }

  const handleShareLocation = async (url: string) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Ubicación de la huerta",
        text: "Mira la ubicación de esta huerta",
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      //toast.success("Enlace copiado al portapapeles")
    }
  } catch (error) {
    console.error("Error al compartir ubicación:", error)
  }
}

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
             <div className="relative group">
              {/* Flechas de navegación (solo si hay foto extra) */}
              {huerta.extra_photo && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const current = activeImageIndex[huerta.id] || 0;
                      setActiveImageIndex((prev) => ({
                        ...prev,
                        [huerta.id]: current === 0 ? 1 : 0,
                      }));
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const current = activeImageIndex[huerta.id] || 0;
                      setActiveImageIndex((prev) => ({
                        ...prev,
                        [huerta.id]: current === 0 ? 1 : 0,
                      }));
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Foto activa */}
              <div className="relative w-full h-48 overflow-hidden rounded-lg">
                <button
                  onClick={() => {
                    const currentPhoto =
                      (activeImageIndex[huerta.id] || 0) === 0
                        ? huerta.cover_photo
                        : huerta.extra_photo;
                    handleViewPhoto(currentPhoto);
                  }}
                  className="block w-full h-full"
                >
                  {(activeImageIndex[huerta.id] || 0) === 0 ? (
                    <Image
                      src={
                        orchardService.getPhotoUrl(huerta.cover_photo) ||
                        '/placeholder.svg'
                      }
                      alt={huerta.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <Image
                      src={
                        orchardService.getPhotoUrl(huerta.extra_photo) ||
                        '/placeholder.svg'
                      }
                      alt={`${huerta.name} - Foto extra`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </button>
              </div>

              {/* Indicador de posición */}
              {huerta.extra_photo && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      (activeImageIndex[huerta.id] || 0) === 0 ? 'bg-white' : 'bg-white/50'
                    }`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      (activeImageIndex[huerta.id] || 0) === 1 ? 'bg-white' : 'bg-white/50'
                    }`}
                  ></div>
                </div>
              )}

              {/* Contador de fotos */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  <Camera className="w-3 h-3 mr-1" />
                  {huerta.extra_photo ? '2' : '1'} foto{huerta.extra_photo ? 's' : ''}
                </Badge>
              </div>

              {huerta.is_featured && (
                <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                  Destacada
                </Badge>
              )}
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
                        <div
                          onClick={() => handleOpenLocation(huerta.location_url!)}
                          className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm
                                    flex items-center justify-between gap-3 cursor-pointer
                                    hover:bg-green-100 active:scale-[0.98] transition"
                         >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-200 shrink-0">
                              <MapPin className="h-5 w-5 text-green-700" />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Ver ubicación
                              </p>
                              
                            </div>
                          </div>

                          {/* BOTÓN SOLO PARA COMPARTIR */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation() // 👈 IMPORTANTE
                              handleShareLocation(huerta.location_url!)
                            }}
                            className="h-9 w-9 rounded-full flex items-center justify-center
                                      hover:bg-green-200 transition"
                            aria-label="Compartir ubicación"
                          >
                            <Share2 className="h-4 w-4 text-green-700" />
                          </button>
                       </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Ver Huerta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal para ver foto */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Foto de la Huerta</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <div className="overflow-auto max-h-[70vh] p-2">
                  <img
                    src={selectedPhoto || "/placeholder.svg"}
                    alt="Foto"
                    className="max-w-none object-contain rounded-lg cursor-zoom-in"
                    style={{ width: "100%", height: "auto" }}
                    onClick={(e) => {
                      const img = e.currentTarget;
                      if (img.style.width === "100%") {
                        img.style.width = "200%";
                        img.style.cursor = "zoom-out";
                      } else {
                        img.style.width = "100%";
                        img.style.cursor = "zoom-in";
                      }
                    }}
                  />
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
