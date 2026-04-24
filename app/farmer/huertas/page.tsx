"use client"

import { useEffect, useMemo, useState, useRef} from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Calendar, MapPin, Camera, Eye, Clock, Share2, Award as IdCard, ImageIcon } from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { orchardService } from "@/services/orchardService"
import { ZoomableImage } from "@/components/ui/ZoomableImage"

export default function FarmerHuertasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [huertas, setHuertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState<{[key: number]: number}>({})
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)

  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [showHuertaDialog, setShowHuertaDialog] = useState(false)

  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null)
  const [showIdDialog, setShowIdDialog] = useState(false)

  const touchStartX = useRef<number | null>(null)

  

  // -----------------------------------------
  // 🔵 Consumir API REAL
  // -----------------------------------------
useEffect(() => {
  const fetchHuertas = async () => {
    try {
     const response = await orchardService.getAll()

    // Laravel pagination → response.data es el array real
    setHuertas(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error cargando huertas:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchHuertas()
}, []) // ⬅️ solo se ejecuta una vez

  // -----------------------------------------
  // 🔵 Años dinámicos con tus huertas reales
  // -----------------------------------------
  const years = useMemo(() => {
    const setYears = new Set(huertas.map((h) => h.year))
    return Array.from(setYears).sort((a, b) => b - a)
  }, [huertas])

  // -----------------------------------------
  // 🔵 Filtro combinado búsqueda + año
  // -----------------------------------------
  const filteredHuertas = huertas.filter((huerta) => {
    const matchSearch =
      huerta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.id.toString().includes(searchTerm) ||
      (huerta.orchard_number || '').includes(searchTerm)

    const matchYear =
      selectedYear === "all" || String(huerta.year) === selectedYear

    return matchSearch && matchYear
  })

  const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX
}

const handleTouchEnd = (e: React.TouchEvent, huertaId: number) => {
  if (touchStartX.current === null) return

  const touchEndX = e.changedTouches[0].clientX
  const diffX = touchStartX.current - touchEndX

  // Umbral mínimo para considerar swipe
  if (Math.abs(diffX) > 50) {
    setActiveImageIndex(prev => {
      const current = prev[huertaId] || 0
      return { ...prev, [huertaId]: current === 0 ? 1 : 0 }
    })
  }

  touchStartX.current = null
}

  // -----------------------------------------
  // 🔵 BOTÓN: Id Foto (abre modal con imagen real)
  // -----------------------------------------
  const handleIdPhoto = (huerta: any) => {
    if (!huerta?.photo_id) return

    // Construir URL real desde el servicio
    const url = orchardService.getPhotoUrl(huerta.photo_id)

    setIdPhotoUrl(url)
    setShowIdDialog(true)
  }

  // -----------------------------------------
  // 🔵 BOTÓN: Ver información completa
  // -----------------------------------------
  const handleViewHuerta = (huerta: any) => {
    setSelectedHuerta(huerta)
    setShowHuertaDialog(true)
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

  const handleViewPhoto = (photoPath: string | null) => {
      const photoUrl = orchardService.getPhotoUrl(photoPath) || "/placeholder.svg"
      setSelectedPhoto(photoUrl)
      setIsPhotoDialogOpen(true)
  }
  return (
    <AppLayout type="farmer">
      <div className="space-y-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Huertas</h1>
          <p className="text-muted-foreground">Gestiona y visualiza todas tus huertas registradas</p>
        </div>

        {/* Campo de búsqueda */}
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

        {/* 🔵 Filtro por año (respeta tu diseño) */}
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
                variant={selectedYear === String(year) ? "default" : "outline"}
                onClick={() => setSelectedYear(String(year))}
                className="min-w-[80px]"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de huertas */}
        {loading ? (
          <p>Cargando huertas...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHuertas.map((huerta) => (
              <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
               <div className="relative group">
                {/* Flechas de navegación (solo si hay foto extra) */}
                {huerta.extra_photo && (
                                       <>
                                         <button
                                           onClick={(e) => {
                                             e.stopPropagation()
                                             const current = activeImageIndex[huerta.id] || 0
                                             setActiveImageIndex(prev => ({ ...prev, [huerta.id]: current === 0 ? 1 : 0 }))
                                           }}
                                           className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                         >
                                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                           </svg>
                                         </button>
                                         
                                         <button
                                           onClick={(e) => {
                                             e.stopPropagation()
                                             const current = activeImageIndex[huerta.id] || 0
                                             setActiveImageIndex(prev => ({ ...prev, [huerta.id]: current === 0 ? 1 : 0 }))
                                           }}
                                           className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                         >
                                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                           </svg>
                                         </button>
                                       </>
                                     )}
                                     
                                     {/* Foto activa */}
                                     <div
                                    className="relative w-full h-48 overflow-hidden rounded-lg"
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={(e) => handleTouchEnd(e, huerta.id)}
                                  >
                                    <button
                                      onClick={() => {
                                        const currentPhoto =
                                          (activeImageIndex[huerta.id] || 0) === 0
                                            ? huerta.cover_photo
                                            : huerta.extra_photo

                                        handleViewPhoto(currentPhoto)
                                      }}
                                      className="block w-full h-full"
                                    >
                                      {(activeImageIndex[huerta.id] || 0) === 0 ? (
                                        <Image
                                          src={orchardService.getPhotoUrl(huerta.cover_photo) || "/placeholder.svg"}
                                          alt={huerta.name}
                                          width={400}
                                          height={200}
                                          className="w-full h-48 object-cover"
                                        />
                                      ) : (
                                        <Image
                                          src={orchardService.getPhotoUrl(huerta.extra_photo) || "/placeholder.svg"}
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
                                         <div className={`w-2 h-2 rounded-full ${(activeImageIndex[huerta.id] || 0) === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                                         <div className={`w-2 h-2 rounded-full ${(activeImageIndex[huerta.id] || 0) === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
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
                                       <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">Destacada</Badge>
                                     )}
                </div>


                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{huerta.name}</h3>
                    <p className="text-sm text-gray-500">#{huerta.id}</p>
                    {huerta.orchard_number && (
                      <p className="text-sm text-blue-600 font-mono font-medium">Id Huerta: {huerta.orchard_number}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-900">
                      {huerta.agave_type?.name ?? "—"}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                    <span className="text-2xl font-bold text-blue-600">
                      {(huerta.plant_quantity || 0).toLocaleString()}
                    </span>
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
                        <p className="text-sm font-medium text-gray-900">
                          {huerta.age ?? "-"}
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
                  <div className="space-y-2">
                    {/* BOTÓN ID FOTO */}
                   
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                      onClick={() => handleIdPhoto(huerta)}
                    >
                     <ImageIcon className="h-4 w-4 mr-1" />

                      Ver Id Foto
                    </Button>

                    {/* BOTÓN VER HORTA */}
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => handleViewHuerta(huerta)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Huerta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}



        {/* Modal para ver foto */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Foto de la Huerta</DialogTitle>
            </DialogHeader>
            <ZoomableImage src={selectedPhoto || "/placeholder.svg"} alt="Foto" />
          </DialogContent>
        </Dialog>

        {/* MODAL: ID FOTO */}
        <Dialog open={showIdDialog} onOpenChange={setShowIdDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Identificación de la Huerta</DialogTitle>
            </DialogHeader>

            {idPhotoUrl && (
              <img
                src={idPhotoUrl}
                alt="ID Foto"
                className="w-full rounded-lg border shadow"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* MODAL: VER HORTA ORIGINAL (diseño intacto) */}
        <Dialog open={showHuertaDialog} onOpenChange={setShowHuertaDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedHuerta?.name}</DialogTitle>
            </DialogHeader>

            {/* Mantengo tu diseño TAL CUAL */}
            {selectedHuerta && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={orchardService.getPhotoUrl(selectedHuerta.photo_id)}
                      alt={selectedHuerta.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />

                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        <Camera className="w-3 h-3 mr-1" />
                        {selectedHuerta.photos_count ?? 0} fotos
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          selectedHuerta.status === "Activa"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {selectedHuerta.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Información General</h3>

                  <p className="text-sm text-muted-foreground">{selectedHuerta.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
