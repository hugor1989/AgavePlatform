"use client"

import { useEffect, useMemo, useState } from "react"
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
import { AppLayout } from "@/components/layouts/app-layout"
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Camera,
  DollarSign,
} from "lucide-react"
import Image from "next/image"
import { orchardService } from "@/services/orchardService"

export default function CompanyCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [huertas, setHuertas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [activeImageIndex, setActiveImageIndex] = useState<{[key: number]: number}>({})
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)

  const [selectedHuerta, setSelectedHuerta] = useState<any>(null)
  const [offerAmount, setOfferAmount] = useState("")
  const [offerComments, setOfferComments] = useState("")
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)

  // ------------------------------------------------
  // 🔵 CONSUMIR API (MISMA FUNCIÓN QUE FARMER)
  // ------------------------------------------------
  useEffect(() => {
    const fetchHuertas = async () => {
      try {
        const response = await orchardService.getAll()

        // Laravel pagination → response.data es el array
        setHuertas(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Error cargando huertas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHuertas()
  }, [])

  // ------------------------------------------------
  // 🔵 AÑOS DINÁMICOS (IGUAL QUE FARMER)
  // ------------------------------------------------
  const years = useMemo(() => {
    const setYears = new Set(huertas.map((h) => h.year))
    return Array.from(setYears).sort((a, b) => b - a)
  }, [huertas])

  // ------------------------------------------------
  // 🔵 FILTRO COMBINADO
  // ------------------------------------------------
  const filteredHuertas = huertas.filter((huerta) => {
    const matchesSearch =
      huerta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.municipality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huerta.id.toString().includes(searchTerm)

    const matchesYear =
      selectedYear === "all" || String(huerta.year) === selectedYear

    return matchesSearch && matchesYear
  })

  // ------------------------------------------------
  // 🔵 ACCIONES
  // ------------------------------------------------
  const handleMakeOffer = async () => {
    if (!offerAmount || !selectedHuerta) return

    setIsSubmittingOffer(true)

    // Aquí luego conectas tu API real de ofertas
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmittingOffer(false)
    setSelectedHuerta(null)
    setOfferAmount("")
    setOfferComments("")

    alert("Oferta enviada exitosamente. El administrador la revisará.")
  }

  const handleShareLocation = (location: string) => {
    if (!location) return
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      location
    )}`
    window.open(googleMapsUrl, "_blank")
  }

    const handleViewPhoto = (photoPath: string | null) => {
      const photoUrl = orchardService.getPhotoUrl(photoPath) || "/placeholder.svg"
      setSelectedPhoto(photoUrl)
      setIsPhotoDialogOpen(true)
  }

  return (
    <AppLayout type="company">
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comprar Huertas</h1>
          <p className="text-gray-600 mt-2">
            Explora y adquiere huertas de agave disponibles
          </p>
        </div>

        {/* FILTROS */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Filtro por año */}
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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar huertas por nombre, municipio o id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* CONTADOR */}
        <p className="text-sm text-gray-600">
          Mostrando {filteredHuertas.length} de {huertas.length} huertas
        </p>

        {/* GRID */}
        {loading ? (
          <p>Cargando huertas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHuertas.map((huerta) => (
              <Card
                key={huerta.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  {/* IMAGEN */}
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

                  {/* CONTENIDO */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{huerta.name}</h3>
                      <p className="text-sm text-gray-500">#{huerta.id}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Image
                        src="/agave-icon.svg"
                        alt="Agave"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm">
                        {huerta.agave_type?.name ?? "—"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Cantidad de Plantas
                      </span>
                      <span className="text-lg font-semibold text-blue-600">
                        {(huerta.plant_quantity || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* UBICACIÓN */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{huerta.state}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{huerta.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{huerta.age ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-mono text-green-800">
                          {huerta.location}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareLocation(huerta.location)}
                        >
                          <Share2 className="h-4 w-4 text-green-700" />
                        </Button>
                      </div>
                    </div>

                    {/* BOTONES */}
                    <div className="space-y-2">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        Ver Huerta
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
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
                              {selectedHuerta?.name}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <Input
                              type="number"
                              placeholder="Precio $"
                              value={offerAmount}
                              onChange={(e) =>
                                setOfferAmount(e.target.value)
                              }
                            />

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedHuerta(null)}
                                className="flex-1"
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleMakeOffer}
                                disabled={!offerAmount || isSubmittingOffer}
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                              >
                                {isSubmittingOffer
                                  ? "Enviando..."
                                  : "Enviar Oferta"}
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
        )}

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
