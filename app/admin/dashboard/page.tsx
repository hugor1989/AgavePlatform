"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Upload,
  DollarSign,
  Building2,
  MapPin,
  Calendar,
  Users,
  Sprout,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

// Datos simulados de historias de jimas
const jimaStories = [
  {
    id: 1,
    title: "Jima en Los Altos de Jalisco",
    farmer: "Juan Pérez García",
    location: "Arandas, Jalisco",
    date: "2024-01-20",
    duration: "3:45",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Jima+Los+Altos",
    videoUrl: "/videos/jima-los-altos.mp4",
  },
  {
    id: 2,
    title: "Cosecha Premium en Tequila",
    farmer: "María González López",
    location: "Tequila, Jalisco",
    date: "2024-01-18",
    duration: "4:12",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Cosecha+Premium",
    videoUrl: "/videos/cosecha-premium.mp4",
  },
  {
    id: 3,
    title: "Jima Tradicional El Mirador",
    farmer: "Carlos Rodríguez",
    location: "Amatitán, Jalisco",
    date: "2024-01-15",
    duration: "2:58",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Jima+Tradicional",
    videoUrl: "/videos/jima-tradicional.mp4",
  },
  {
    id: 4,
    title: "Cosecha de Agave Azul",
    farmer: "Ana Patricia López",
    location: "Tepatitlán, Jalisco",
    date: "2024-01-12",
    duration: "5:23",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Agave+Azul",
    videoUrl: "/videos/agave-azul.mp4",
  },
]

// Datos simulados de ofertas
const recentOffers = [
  {
    id: 1,
    huertaName: "Huerta Los Altos Premium",
    companyName: "Tequila Premium SA",
    farmerName: "Juan Pérez García",
    amount: 850000,
    status: "pending",
    createdAt: "2024-01-21T10:30:00Z",
  },
  {
    id: 2,
    huertaName: "Plantación El Mirador",
    companyName: "Agave Industries",
    farmerName: "María González López",
    amount: 1100000,
    status: "negotiating",
    createdAt: "2024-01-20T14:20:00Z",
  },
  {
    id: 3,
    huertaName: "Agavera San Miguel",
    companyName: "Destilería Tradicional",
    farmerName: "Carlos Rodríguez Mendoza",
    amount: 650000,
    status: "accepted",
    createdAt: "2024-01-19T16:45:00Z",
  },
  {
    id: 4,
    huertaName: "Campo Verde Premium",
    companyName: "Mezcal Artesanal",
    farmerName: "Roberto Sánchez",
    amount: 920000,
    status: "pending",
    createdAt: "2024-01-18T09:15:00Z",
  },
  {
    id: 5,
    huertaName: "Plantío Don Fernando",
    companyName: "Tequila Tradicional",
    farmerName: "Fernando Morales",
    amount: 780000,
    status: "negotiating",
    createdAt: "2024-01-17T11:30:00Z",
  },
]

// Datos simulados de huertas vendidas
const soldHuertas = [
  {
    id: 1,
    name: "Agavera San Miguel",
    farmer: "Carlos Rodríguez Mendoza",
    company: "Destilería Tradicional",
    location: "Amatitán, Jalisco",
    price: 650000,
    hectares: 8.5,
    soldDate: "2024-01-17T11:30:00Z",
  },
  {
    id: 2,
    name: "Huerta El Dorado",
    farmer: "Luis Alberto Vega",
    company: "Tequila Premium SA",
    location: "Arandas, Jalisco",
    price: 1200000,
    hectares: 12.3,
    soldDate: "2024-01-15T14:20:00Z",
  },
  {
    id: 3,
    name: "Campo Los Pinos",
    farmer: "Patricia Hernández",
    company: "Agave Industries",
    location: "Tepatitlán, Jalisco",
    price: 890000,
    hectares: 9.8,
    soldDate: "2024-01-12T16:45:00Z",
  },
  {
    id: 4,
    name: "Plantación Santa Rosa",
    farmer: "Miguel Ángel Torres",
    company: "Mezcal Artesanal",
    location: "Tequila, Jalisco",
    price: 1050000,
    hectares: 11.2,
    soldDate: "2024-01-10T09:30:00Z",
  },
  {
    id: 5,
    name: "Agavera La Esperanza",
    farmer: "Rosa María Jiménez",
    company: "Destilería del Valle",
    location: "Zapopan, Jalisco",
    price: 750000,
    hectares: 7.9,
    soldDate: "2024-01-08T13:15:00Z",
  },
]

// Datos simulados de huertas registradas recientemente
const recentHuertas = [
  {
    id: 1,
    name: "Huerta Nuevo Amanecer",
    farmer: "Diego Ramírez Soto",
    location: "Arandas, Jalisco",
    hectares: 15.2,
    agaveAge: 6,
    registeredAt: "2024-01-21T08:30:00Z",
    status: "Disponible",
  },
  {
    id: 2,
    name: "Campo Las Flores",
    farmer: "Elena Martínez Cruz",
    location: "Tepatitlán, Jalisco",
    hectares: 9.8,
    agaveAge: 7,
    registeredAt: "2024-01-20T15:45:00Z",
    status: "Disponible",
  },
  {
    id: 3,
    name: "Plantío San José",
    farmer: "Arturo González Vega",
    location: "Tequila, Jalisco",
    hectares: 12.5,
    agaveAge: 8,
    registeredAt: "2024-01-19T11:20:00Z",
    status: "Disponible",
  },
  {
    id: 4,
    name: "Agavera El Refugio",
    farmer: "Carmen López Herrera",
    location: "Amatitán, Jalisco",
    hectares: 6.7,
    agaveAge: 5,
    registeredAt: "2024-01-18T14:10:00Z",
    status: "Disponible",
  },
  {
    id: 5,
    name: "Huerta Vista Hermosa",
    farmer: "Raúl Moreno Díaz",
    location: "Zapopan, Jalisco",
    hectares: 18.3,
    agaveAge: 9,
    registeredAt: "2024-01-17T09:55:00Z",
    status: "Disponible",
  },
]

export default function AdminDashboard() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [newStory, setNewStory] = useState({
    title: "",
    farmer: "",
    location: "",
    video: null as File | null,
  })

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % jimaStories.length)
  }

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + jimaStories.length) % jimaStories.length)
  }

  const handleUploadStory = async () => {
    if (!newStory.title || !newStory.farmer || !newStory.location || !newStory.video) {
      alert("Por favor completa todos los campos")
      return
    }

    // Simular subida
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Historia subida exitosamente")
    setIsUploadDialogOpen(false)
    setNewStory({ title: "", farmer: "", location: "", video: null })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "negotiating":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "negotiating":
        return "Negociando"
      case "accepted":
        return "Aceptada"
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Carrusel de Historias de Jimas */}
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Play className="h-5 w-5 text-green-600" />
                  Historias de Jimas
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Videos documentando el proceso de cosecha</p>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Historia
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Subir Nueva Historia de Jima</DialogTitle>
                    <DialogDescription>Documenta el proceso de cosecha con un video</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título de la Historia</Label>
                      <Input
                        id="title"
                        value={newStory.title}
                        onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        placeholder="Ej: Jima en Los Altos de Jalisco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer">Agricultor</Label>
                      <Input
                        id="farmer"
                        value={newStory.farmer}
                        onChange={(e) => setNewStory({ ...newStory, farmer: e.target.value })}
                        placeholder="Nombre del agricultor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={newStory.location}
                        onChange={(e) => setNewStory({ ...newStory, location: e.target.value })}
                        placeholder="Ej: Arandas, Jalisco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video">Video</Label>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => setNewStory({ ...newStory, video: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                    <Button onClick={handleUploadStory} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                      Subir Historia
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStory}
                    disabled={jimaStories.length <= 1}
                    className="z-10 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-2">
                    {jimaStories.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentStoryIndex ? "bg-green-600" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextStory}
                    disabled={jimaStories.length <= 1}
                    className="z-10 bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jimaStories.slice(currentStoryIndex, currentStoryIndex + 3).map((story) => (
                    <div
                      key={story.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={story.thumbnail || "/placeholder.svg"}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {story.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base break-words">
                          {story.title}
                        </h3>
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{story.farmer}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{story.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>{formatDate(story.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ofertas Recientes */}
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Ofertas Recientes
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Las 5 ofertas más recientes recibidas</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {recentOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    {/* Título de la huerta */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-base break-words leading-tight">
                        {offer.huertaName}
                      </h3>
                    </div>

                    {/* Información en grid responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words leading-relaxed">{offer.companyName}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words leading-relaxed">{offer.farmerName}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{formatDate(offer.createdAt)}</span>
                      </div>
                    </div>

                    {/* Monto y Estado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="font-bold text-green-600 text-lg break-all">
                          {formatCurrency(offer.amount)}
                        </span>
                      </div>
                      <Badge
                        className={`${getStatusColor(offer.status)} text-sm px-3 py-1 font-medium border self-start sm:self-center`}
                      >
                        {getStatusText(offer.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Huertas Vendidas */}
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Huertas Vendidas
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Las 5 ventas más recientes completadas</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {soldHuertas.map((huerta) => (
                  <div
                    key={huerta.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-base break-words leading-tight">{huerta.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words leading-relaxed">{huerta.farmer}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words leading-relaxed">{huerta.company}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 break-words leading-relaxed">{huerta.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="font-bold text-green-600 text-lg break-all">
                          {formatCurrency(huerta.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {huerta.hectares} ha • {formatDate(huerta.soldDate)}
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1 font-medium border">
                          Vendida
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Huertas Registradas Recientemente */}
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sprout className="h-5 w-5 text-green-600" />
                  Huertas Registradas Recientemente
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Los 5 registros más recientes en la plataforma</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {recentHuertas.map((huerta) => (
                  <div
                    key={huerta.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-base break-words leading-tight">{huerta.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words leading-relaxed">{huerta.farmer}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words leading-relaxed">{huerta.location}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{formatDate(huerta.registeredAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="font-semibold text-gray-900 text-base">
                          {huerta.hectares} ha • {huerta.agaveAge} años
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Agave azul</span>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1 font-medium border">
                          {huerta.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
