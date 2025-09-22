"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bell,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  Trash2,
  Award as MarkAsRead,
  Eye,
  EyeOff,
} from "lucide-react"

export default function FarmerNotifications() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])

  // Mock data
  const notifications = [
    {
      id: 1,
      title: "Nueva oferta recibida",
      message:
        "Empresa Tequilera del Valle ha enviado una oferta de $850,000 MXN por tu huerta Los Altos Premium. La oferta incluye pago inmediato y condiciones preferenciales.",
      type: "offer",
      priority: "Alta",
      read: false,
      date: "2024-01-15T14:30:00",
      relativeTime: "Hace 2 horas",
      huerta: "Huerta Los Altos Premium",
      company: "Tequilera del Valle",
    },
    {
      id: 2,
      title: "Oferta aceptada - Documentación requerida",
      message:
        "Tu aceptación de la oferta de Grupo Agavero Nacional ha sido procesada. Se requiere completar la documentación legal para proceder con la venta de Hacienda Agave Real.",
      type: "success",
      priority: "Alta",
      read: false,
      date: "2024-01-15T10:15:00",
      relativeTime: "Hace 6 horas",
      huerta: "Hacienda Agave Real",
      company: "Grupo Agavero Nacional",
    },
    {
      id: 3,
      title: "Recordatorio: Documentación pendiente",
      message:
        "Recuerda completar la documentación requerida para tu huerta San Miguel. Faltan: certificado de origen, análisis de suelo y documentos de propiedad.",
      type: "reminder",
      priority: "Media",
      read: true,
      date: "2024-01-14T16:45:00",
      relativeTime: "Hace 1 día",
      huerta: "Agavera San Miguel",
      company: null,
    },
    {
      id: 4,
      title: "Huerta aprobada y publicada",
      message:
        "¡Excelente noticia! Tu huerta Agavera Real ha sido aprobada por nuestro equipo de administración y ya está disponible en el catálogo para recibir ofertas.",
      type: "success",
      priority: "Media",
      read: true,
      date: "2024-01-13T09:20:00",
      relativeTime: "Hace 2 días",
      huerta: "Agavera Real",
      company: null,
    },
    {
      id: 5,
      title: "Mensaje del administrador",
      message:
        "Se han implementado nuevas políticas de calidad para las huertas. Por favor revisa los nuevos requisitos en la sección de configuración y asegúrate de que tus huertas cumplan con los estándares.",
      type: "info",
      priority: "Media",
      read: true,
      date: "2024-01-12T11:30:00",
      relativeTime: "Hace 3 días",
      huerta: null,
      company: null,
    },
    {
      id: 6,
      title: "Oferta rechazada",
      message:
        "Has rechazado la oferta de Tequilera Regional por $950,000 MXN para Hacienda Agave Real. La empresa ha sido notificada de tu decisión.",
      type: "info",
      priority: "Baja",
      read: true,
      date: "2024-01-11T15:10:00",
      relativeTime: "Hace 4 días",
      huerta: "Hacienda Agave Real",
      company: "Tequilera Regional",
    },
    {
      id: 7,
      title: "Nueva empresa interesada",
      message:
        "Destiladora Artesanal ha mostrado interés en tu huerta Los Altos Premium. Esperamos recibir una oferta formal en los próximos días.",
      type: "info",
      priority: "Baja",
      read: true,
      date: "2024-01-10T13:25:00",
      relativeTime: "Hace 5 días",
      huerta: "Huerta Los Altos Premium",
      company: "Destiladora Artesanal",
    },
    {
      id: 8,
      title: "Actualización de perfil requerida",
      message:
        "Para mejorar la visibilidad de tus huertas, te recomendamos actualizar tu perfil con información adicional sobre tu experiencia y certificaciones.",
      type: "reminder",
      priority: "Baja",
      read: true,
      date: "2024-01-09T08:45:00",
      relativeTime: "Hace 6 días",
      huerta: null,
      company: null,
    },
  ]

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    offers: notifications.filter((n) => n.type === "offer").length,
    reminders: notifications.filter((n) => n.type === "reminder").length,
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.huerta && notification.huerta.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.company && notification.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.read) ||
      (statusFilter === "unread" && !notification.read)

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "offer":
        return "bg-green-100 text-green-800"
      case "success":
        return "bg-blue-100 text-blue-800"
      case "reminder":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "offer":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "reminder":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Info className="h-4 w-4 text-gray-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const handleSelectNotification = (id: number) => {
    setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600">Mantente al día con todas las actividades de tus huertas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MarkAsRead className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recordatorios</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.reminders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="offer">Ofertas</SelectItem>
                <SelectItem value="success">Éxito</SelectItem>
                <SelectItem value="reminder">Recordatorios</SelectItem>
                <SelectItem value="info">Información</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">No leídas</SelectItem>
                <SelectItem value="read">Leídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedNotifications.length} notificación{selectedNotifications.length > 1 ? "es" : ""} seleccionada
                {selectedNotifications.length > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Marcar como leídas
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-gray-600">Seleccionar todas</span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedNotifications.includes(notification.id)}
                  onCheckedChange={() => handleSelectNotification(notification.id)}
                />

                <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type === "offer" && "Oferta"}
                        {notification.type === "success" && "Éxito"}
                        {notification.type === "reminder" && "Recordatorio"}
                        {notification.type === "info" && "Info"}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{notification.message}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{notification.relativeTime}</span>
                      {notification.huerta && <span className="text-teal-600">📍 {notification.huerta}</span>}
                      {notification.company && <span className="text-purple-600">🏢 {notification.company}</span>}
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      {notification.read ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron notificaciones</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}
