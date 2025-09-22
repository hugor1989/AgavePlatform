"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sprout,
  DollarSign,
  Star,
  Edit,
  Camera,
  Save,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

export default function FarmerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data del agricultor
  const farmerData = {
    id: "1705123456",
    name: "Juan Pérez García",
    email: "juan.perez@email.com",
    phone: "+52 33 1234 5678",
    location: "Jalisco, México",
    joinDate: "Enero 2020",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "Agricultor con más de 15 años de experiencia en el cultivo de agave azul tequilana. Especializado en técnicas sustentables y producción de alta calidad.",
    stats: {
      totalHuertas: 8,
      huertasVendidas: 3,
      ingresosTotales: 4250000,
      promedioCalificacion: 4.8,
    },
    huertas: [
      {
        id: 1,
        name: "Huerta Los Altos Premium",
        status: "Disponible",
        year: 2020,
        plants: 27627,
        area: "15 hectáreas",
        image: "/agave-field-plantation.png",
        offers: 2,
        lastOffer: "$850,000",
      },
      {
        id: 2,
        name: "Rancho San Miguel",
        status: "En Negociación",
        year: 2019,
        plants: 18900,
        area: "12 hectáreas",
        image: "/placeholder-n4bzz.png",
        offers: 1,
        lastOffer: "$720,000",
      },
      {
        id: 3,
        name: "Plantación El Mirador",
        status: "Vendida",
        year: 2018,
        plants: 22450,
        area: "18 hectáreas",
        image: "/agave-field-plantation.png",
        offers: 0,
        lastOffer: "$1,100,000",
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "offer",
        title: "Nueva oferta recibida",
        description: "Tequila Premium SA envió una oferta por Huerta Los Altos Premium",
        amount: "$850,000",
        date: "Hace 2 horas",
        status: "pending",
      },
      {
        id: 2,
        type: "sale",
        title: "Venta completada",
        description: "Plantación El Mirador vendida exitosamente",
        amount: "$1,100,000",
        date: "Hace 3 días",
        status: "completed",
      },
      {
        id: 3,
        type: "negotiation",
        title: "Negociación en curso",
        description: "Contraoferta enviada para Rancho San Miguel",
        amount: "$720,000",
        date: "Hace 1 semana",
        status: "negotiating",
      },
    ],
    reviews: [
      {
        id: 1,
        company: "Tequila Premium SA",
        rating: 5,
        comment: "Excelente calidad de agave y muy profesional en todo el proceso.",
        date: "15 Mar 2024",
        huerta: "Hacienda El Agave",
      },
      {
        id: 2,
        company: "Destiladora Jalisco",
        rating: 5,
        comment: "Agave de primera calidad, entrega puntual y documentación completa.",
        date: "28 Feb 2024",
        huerta: "Rancho Verde",
      },
      {
        id: 3,
        company: "Agave Industries",
        rating: 4,
        comment: "Buen producto, proceso transparente y comunicación efectiva.",
        date: "10 Feb 2024",
        huerta: "Los Altos Premium",
      },
    ],
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "En Negociación":
        return "bg-yellow-100 text-yellow-800"
      case "Vendida":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "offer":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "sale":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "negotiation":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header del Perfil */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={farmerData.avatar || "/placeholder.svg"} alt={farmerData.name} />
                <AvatarFallback className="text-lg sm:text-xl bg-teal-100 text-teal-700">
                  {farmerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>

            {/* Información Principal */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{farmerData.name}</h1>
                  <p className="text-sm text-gray-600">ID: {farmerData.id}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                      <DialogDescription>Actualiza tu información personal</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input id="name" defaultValue={farmerData.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={farmerData.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" defaultValue={farmerData.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Textarea id="bio" defaultValue={farmerData.bio} rows={3} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full sm:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Información de Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">{farmerData.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{farmerData.phone}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{farmerData.location}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Miembro desde {farmerData.joinDate}</span>
                </div>
              </div>

              {/* Biografía */}
              <div className="mt-3 sm:mt-4">
                <p className="text-sm text-gray-700 leading-relaxed">{farmerData.bio}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <Sprout className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{farmerData.stats.totalHuertas}</p>
                <p className="text-xs sm:text-sm text-gray-600">Huertas Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{farmerData.stats.huertasVendidas}</p>
                <p className="text-xs sm:text-sm text-gray-600">Vendidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div>
                <p className="text-sm sm:text-lg font-bold text-gray-900">
                  {formatCurrency(farmerData.stats.ingresosTotales)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Ingresos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{farmerData.stats.promedioCalificacion}</p>
                <p className="text-xs sm:text-sm text-gray-600">Calificación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-3">
            Mis Huertas
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm py-2 sm:py-3">
            Actividad
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2 sm:py-3">
            Reseñas
          </TabsTrigger>
        </TabsList>

        {/* Tab: Mis Huertas */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {farmerData.huertas.map((huerta) => (
              <Card key={huerta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32 sm:h-40">
                  <Image src={huerta.image || "/placeholder.svg"} alt={huerta.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(huerta.status)}>{huerta.status}</Badge>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base break-words">{huerta.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Año: {huerta.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sprout className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{huerta.plants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{huerta.area}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">{huerta.lastOffer}</span>
                    </div>
                  </div>
                  {huerta.offers > 0 && (
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {huerta.offers} oferta{huerta.offers > 1 ? "s" : ""}
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Ver Detalles
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Actividad Reciente */}
        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-3 sm:space-y-4">
            {farmerData.recentActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">{activity.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-sm font-semibold text-green-600 break-words">{activity.amount}</span>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{activity.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Reseñas */}
        <TabsContent value="reviews" className="space-y-4">
          <div className="space-y-3 sm:space-y-4">
            {farmerData.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">{review.company}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">Huerta: {review.huerta}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 break-words leading-relaxed">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
