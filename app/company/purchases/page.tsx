"use client"

import { CompanyLayout } from "@/components/company-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, CalendarIcon, Clock, Camera, Share2, FileText, Eye, Download } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const compras = [
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
    status: "Comprada",
    purchaseDate: "2024-01-15",
    guias: [
      {
        id: "G001",
        nombre: "Guía de Transporte #001",
        fecha: "2024-01-20",
        imagen: "/agave-field-plantation.png",
        estado: "Aprobada",
      },
      {
        id: "G002",
        nombre: "Guía de Transporte #002",
        fecha: "2024-01-22",
        imagen: "/agave-field-plantation.png",
        estado: "Pendiente",
      },
      {
        id: "G003",
        nombre: "Guía de Transporte #003",
        fecha: "2024-01-25",
        imagen: "/agave-field-plantation.png",
        estado: "Aprobada",
      },
    ],
    offerDetails: {
      precio: "$2,500,000 MXN",
      cmJima: "35 cm",
      mesesFinanciado: "12 meses",
      fechaMesJima: "Marzo 2025",
      kilosMinimos: "15 kilos",
      pagosViajes: "Pago contra entrega por viaje completado",
      logistica: "La fábrica se encarga de toda la logística de transporte",
    },
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
    status: "Comprada",
    purchaseDate: "2024-02-20",
    guias: [
      {
        id: "G004",
        nombre: "Guía de Transporte #004",
        fecha: "2024-02-25",
        imagen: "/agave-field-plantation.png",
        estado: "Aprobada",
      },
      {
        id: "G005",
        nombre: "Guía de Transporte #005",
        fecha: "2024-02-28",
        imagen: "/agave-field-plantation.png",
        estado: "Aprobada",
      },
    ],
    offerDetails: {
      precio: "$1,850,000 MXN",
      cmJima: "40 cm",
      mesesFinanciado: "18 meses",
      fechaMesJima: "Abril 2025",
      kilosMinimos: "18 kilos",
      pagosViajes: "50% adelanto, 50% contra entrega",
      logistica: "Agave puesto en fábrica por el agricultor",
    },
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
    status: "Comprada",
    purchaseDate: "2024-03-10",
    guias: [
      {
        id: "G006",
        nombre: "Guía de Transporte #006",
        fecha: "2024-03-15",
        imagen: "/agave-field-plantation.png",
        estado: "Pendiente",
      },
    ],
    offerDetails: {
      precio: "$3,200,000 MXN",
      cmJima: "38 cm",
      mesesFinanciado: "24 meses",
      fechaMesJima: "Mayo 2026",
      kilosMinimos: "20 kilos",
      pagosViajes: "Pago quincenal por toneladas entregadas",
      logistica: "Logística compartida - 50% empresa, 50% agricultor",
    },
  },
]

export default function CompanyPurchasesPage() {
  const [viajesPorDia, setViajesPorDia] = useState<{ [key: string]: string }>({
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
    domingo: "",
  })

  const [programacionesGuardadas, setProgramacionesGuardadas] = useState<{ [key: string]: { [key: string]: string } }>(
    {},
  )

  const getCurrentWeekDays = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)

    // Ajustar para que lunes sea el primer día (0 = domingo, 1 = lunes, etc.)
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1
    monday.setDate(today.getDate() - daysFromMonday)

    const weekDays = []
    const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const dayKeys = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)

      weekDays.push({
        name: dayNames[i],
        key: dayKeys[i],
        date: day.getDate(),
        month: months[day.getMonth()],
        fullDate: day,
      })
    }

    return weekDays
  }

  const handleViajesChange = (dayKey: string, value: string) => {
    setViajesPorDia((prev) => ({
      ...prev,
      [dayKey]: value,
    }))
  }

  const handleIdPhoto = () => {
    console.log("Abrir funcionalidad de ID Foto")
    // Aquí iría la lógica para abrir la cámara o seleccionar foto
  }

  const handleGuardarProgramacion = (compraId: string) => {
    setProgramacionesGuardadas((prev) => ({
      ...prev,
      [compraId]: { ...viajesPorDia },
    }))
    // Resetear el formulario
    setViajesPorDia({
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    })
  }

  const weekDays = getCurrentWeekDays()

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Compras</h1>
          <p className="text-gray-600">Gestiona las huertas que has adquirido</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {compras.map((compra) => (
            <Card
              key={compra.id}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-orange-50 border-orange-200"
            >
              <div className="relative">
                <Image
                  src={compra.image || "/placeholder.svg"}
                  alt={compra.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                    <Camera className="w-3 h-3 mr-1" />
                    {compra.photos} fotos
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{compra.name}</h3>
                  <p className="text-sm text-gray-500">#{compra.id}</p>
                </div>

                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-900">{compra.type}</span>
                </div>

                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                  <span className="text-2xl font-bold text-blue-600">{compra.plants.toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="text-sm font-medium text-gray-900">{compra.state}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-500">Municipio</p>
                      <p className="text-sm font-medium text-gray-900">{compra.municipality}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Año</p>
                      <p className="text-sm font-medium text-gray-900">{compra.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Edad</p>
                      <p className="text-sm font-medium text-gray-900">{compra.age} años</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium">Ubicación</p>
                      <p className="text-sm font-mono text-green-800">{compra.location}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                      <Share2 className="w-4 h-4 text-green-700" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-blue-600 text-white hover:bg-blue-700" onClick={handleIdPhoto}>
                    <FileText className="w-4 h-4 mr-1" />
                    ID Foto
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex-1 bg-orange-600 text-white hover:bg-orange-700">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Programar Jima
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] sm:max-w-2xl lg:max-w-5xl max-h-[90vh] p-0">
                      <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-center text-lg sm:text-xl">
                          Programar Jima - Semana Actual
                        </DialogTitle>
                      </DialogHeader>

                      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        {/* Sección de Programación de Jima */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-orange-600" />
                            Programación de Viajes
                          </h3>

                          {/* Contenedor principal con scroll */}
                          <div className="w-full overflow-x-auto">
                            <div className="min-w-[600px]">
                              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead>
                                  <tr className="bg-gray-50">
                                    {weekDays.map((day) => (
                                      <th
                                        key={day.key}
                                        className="px-3 py-3 text-center border-r border-gray-200 last:border-r-0"
                                      >
                                        <div className="space-y-1">
                                          <p className="font-semibold text-gray-900 text-sm">{day.name}</p>
                                          <p className="text-xs text-gray-600">
                                            {day.date} {day.month}
                                          </p>
                                        </div>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-white">
                                    {weekDays.map((day) => (
                                      <td
                                        key={day.key}
                                        className="px-3 py-4 text-center border-r border-gray-200 last:border-r-0"
                                      >
                                        <div className="space-y-2">
                                          <Label
                                            htmlFor={`viajes-${day.key}`}
                                            className="text-xs font-medium text-gray-700 block"
                                          >
                                            Viajes
                                          </Label>
                                          <Input
                                            id={`viajes-${day.key}`}
                                            type="number"
                                            placeholder="0"
                                            value={viajesPorDia[day.key]}
                                            onChange={(e) => handleViajesChange(day.key, e.target.value)}
                                            className="text-center text-sm h-9 w-16 mx-auto"
                                            min="0"
                                            max="99"
                                          />
                                        </div>
                                      </td>
                                    ))}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Indicador de scroll para móvil */}
                          <div className="block sm:hidden text-center">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span>Desliza para ver todos los días</span>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>

                        {/* Sección de Guías de Transporte */}
                        <div className="space-y-4 border-t pt-6">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Guías de Transporte Agregadas por Admin
                            <Badge variant="secondary" className="ml-2">
                              {compra.guias?.length || 0} guías
                            </Badge>
                          </h3>

                          {compra.guias && compra.guias.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {compra.guias.map((guia) => (
                                <Card key={guia.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                  <div className="relative">
                                    <Image
                                      src={guia.imagen || "/placeholder.svg"}
                                      alt={guia.nombre}
                                      width={300}
                                      height={200}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <Badge
                                        variant={guia.estado === "Aprobada" ? "default" : "secondary"}
                                        className={guia.estado === "Aprobada" ? "bg-green-600" : "bg-yellow-600"}
                                      >
                                        {guia.estado}
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-3">
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-sm text-gray-900 truncate">{guia.nombre}</h4>
                                      <p className="text-xs text-gray-500">ID: {guia.id}</p>
                                      <p className="text-xs text-gray-600">
                                        Fecha: {new Date(guia.fecha).toLocaleDateString("es-MX")}
                                      </p>
                                      <div className="flex gap-1 pt-2">
                                        <Button size="sm" className="flex-1 h-8 text-xs bg-transparent">
                                          <Eye className="w-3 h-3 mr-1" />
                                          Ver
                                        </Button>
                                        <Button size="sm" className="flex-1 h-8 text-xs bg-transparent">
                                          <Download className="w-3 h-3 mr-1" />
                                          Descargar
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">No hay guías de transporte agregadas aún</p>
                              <p className="text-gray-400 text-xs mt-1">
                                Las guías aparecerán aquí cuando el admin las agregue
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                          <Button size="sm" className="w-full sm:w-auto bg-transparent">
                            Cancelar
                          </Button>
                          <Button
                            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                            onClick={() => handleGuardarProgramacion(compra.id)}
                          >
                            Guardar Programación
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Botón Ver Detalle Oferta */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full bg-purple-600 text-white hover:bg-purple-700">
                      <FileText className="w-4 h-4 mr-1" />
                      Ver Detalle Oferta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-900">
                        Detalles de la Oferta - {compra.name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                          Detalles de la Oferta - {compra.name}
                        </h3>

                        <div className="space-y-3 text-sm">
                          <div className="flex">
                            <span className="font-medium text-gray-700 min-w-[200px]">Precio $:</span>
                            <span className="text-gray-900">{compra.offerDetails.precio}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium text-gray-700 min-w-[200px]">Cm de Jima:</span>
                            <span className="text-gray-900">{compra.offerDetails.cmJima}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium text-gray-700 min-w-[200px]">Meses Financiado:</span>
                            <span className="text-gray-900">{compra.offerDetails.mesesFinanciado}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium text-gray-700 min-w-[200px]">Fecha de Mes de Jima:</span>
                            <span className="text-gray-900">{compra.offerDetails.fechaMesJima}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium text-gray-700 min-w-[200px]">
                              Se Jimará a Partir de * kilos para arriba:
                            </span>
                            <span className="text-gray-900">{compra.offerDetails.kilosMinimos}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row">
                            <span className="font-medium text-gray-700 min-w-[200px] mb-1 sm:mb-0">
                              Cómo Serían los Pagos de Viajes Jimados:
                            </span>
                            <span className="text-gray-900">{compra.offerDetails.pagosViajes}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row">
                            <span className="font-medium text-gray-700 min-w-[200px] mb-1 sm:mb-0">
                              El Agave Sería Puesto en Fábrica o la Fábrica se Encargaría de Toda la Logística:
                            </span>
                            <span className="text-gray-900">{compra.offerDetails.logistica}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Botón Ver Programa de Jima - DEBAJO de Ver Detalle Oferta */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full bg-green-600 text-white hover:bg-green-700">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Ver Programa de Jima
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] sm:max-w-2xl lg:max-w-4xl max-h-[85vh] p-0">
                    <DialogHeader className="px-6 py-4 border-b">
                      <DialogTitle className="text-center text-lg sm:text-xl">
                        Programa de Jima Guardado - {compra.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4 overflow-hidden">
                      {programacionesGuardadas[compra.id] ? (
                        <div className="w-full overflow-x-auto">
                          <div className="min-w-[600px]">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                              <thead>
                                <tr className="bg-gray-50">
                                  {weekDays.map((day) => (
                                    <th
                                      key={day.key}
                                      className="px-3 py-3 text-center border-r border-gray-200 last:border-r-0"
                                    >
                                      <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 text-sm">{day.name}</p>
                                        <p className="text-xs text-gray-600">
                                          {day.date} {day.month}
                                        </p>
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-white">
                                  {weekDays.map((day) => (
                                    <td
                                      key={day.key}
                                      className="px-3 py-4 text-center border-r border-gray-200 last:border-r-0"
                                    >
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-gray-700 block">
                                          Viajes Programados
                                        </Label>
                                        <div className="text-center text-lg font-bold text-green-600 bg-green-50 rounded-lg py-2 px-3 min-h-[40px] flex items-center justify-center">
                                          {programacionesGuardadas[compra.id][day.key] || "0"}
                                        </div>
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No hay programación de jima guardada</p>
                          <p className="text-gray-400 text-xs mt-1">
                            Usa el botón "Programar Jima" para crear una programación
                          </p>
                        </div>
                      )}

                      <div className="block sm:hidden text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>Desliza para ver todos los días</span>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      <div className="flex justify-center pt-4 border-t">
                        <Button size="sm" className="bg-transparent">
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CompanyLayout>
  )
}
