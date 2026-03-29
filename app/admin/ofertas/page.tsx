"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Building2,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Send,
  Bell,
  Calculator,
  DollarSign,
  Mail,
  Phone,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"

// Datos simulados de ofertas
const mockOffers = [
  {
    id: 1,
    huertaId: 1,
    huertaName: "Huerta Los Altos Premium",
    companyId: 1,
    companyName: "Tequila Premium SA",
    companyContact: "contacto@tequilapremium.com",
    farmerName: "Juan Pérez García",
    farmerUniqueId: "1705123456",
    farmerEmail: "juan.perez@email.com",
    farmerPhone: "+52 33 1234 5678",
    amount: 850000,
    originalAmount: 850000,
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    message:
      "Estamos interesados en adquirir esta huerta para nuestra producción premium. El precio ofrecido refleja la calidad del agave.",
    farmerNotified: false,
    farmerAmount: null,
    adminCommission: null,
    adminExpenses: null,
    offerDetails: {
      precio: 850000,
      cmJima: 15,
      mesesFinanciado: 12,
      fechaMesJima: "Marzo 2025",
      kilosMinimos: 500,
      pagosViajes: "Pago semanal por viaje completado",
      logistica: "La fábrica se encarga de toda la logística de transporte",
    },
  },
  {
    id: 2,
    huertaId: 2,
    huertaName: "Plantación El Mirador",
    companyId: 2,
    companyName: "Agave Industries",
    companyContact: "compras@agaveindustries.com",
    farmerName: "María González López",
    farmerUniqueId: "1706234567",
    farmerEmail: "maria.gonzalez@email.com",
    farmerPhone: "+52 33 2345 6789",
    amount: 1100000,
    originalAmount: 1200000,
    status: "accepted",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    message: "Queremos esta plantación para expandir nuestra producción. Estamos abiertos a negociar.",
    farmerNotified: true,
    farmerAmount: 990000,
    adminCommission: 66000,
    adminExpenses: 44000,
    offerDetails: {
      precio: 1100000,
      cmJima: 18,
      mesesFinanciado: 18,
      fechaMesJima: "Abril 2025",
      kilosMinimos: 750,
      pagosViajes: "Pago quincenal por lotes entregados",
      logistica: "Agave puesto en fábrica por el agricultor",
    },
  },
  {
    id: 4,
    huertaId: 1,
    huertaName: "Huerta Los Altos Premium",
    companyId: 4,
    companyName: "Mezcal Artesanal",
    companyContact: "info@mezcalartesanal.com",
    farmerName: "Juan Pérez García",
    farmerUniqueId: "1705123456",
    farmerEmail: "juan.perez@email.com",
    farmerPhone: "+52 33 1234 5678",
    amount: 780000,
    originalAmount: 780000,
    status: "rejected",
    createdAt: "2024-01-10T08:15:00Z",
    updatedAt: "2024-01-16T15:20:00Z",
    message: "Oferta competitiva para producción de mezcal artesanal.",
    farmerNotified: true,
    farmerAmount: null,
    adminCommission: null,
    adminExpenses: null,
    offerDetails: {
      precio: 780000,
      cmJima: 14,
      mesesFinanciado: 9,
      fechaMesJima: "Mayo 2025",
      kilosMinimos: 400,
      pagosViajes: "Pago mensual por producción entregada",
      logistica: "Logística compartida entre fábrica y agricultor",
    },
  },
]

export default function AdminOfertasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [offers, setOffers] = useState(mockOffers)

  // Estado para cálculo de comisión y notificación al agricultor
  const [calculation, setCalculation] = useState({
    farmerPrice: "",
    message: "Tienes una nueva oferta por tu huerta. Por favor revisa los detalles en tu panel.",
  })

  const companies = Array.from(new Set(offers.map((offer) => offer.companyName)))

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.huertaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.farmerUniqueId.includes(searchTerm)
    const matchesCompany = selectedCompany === "all" || offer.companyName === selectedCompany
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && offer.status === "pending") ||
      (activeTab === "accepted" && offer.status === "accepted") ||
      (activeTab === "rejected" && offer.status === "rejected")
    return matchesSearch && matchesCompany && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "accepted":
        return "Aceptada"
      case "rejected":
        return "Rechazada"
      default:
        return status
    }
  }

  // Calcular montos
  const calculateAmounts = () => {
    if (!selectedOffer || !calculation.farmerPrice) {
      return { farmerAmount: 0 }
    }

    const farmerAmount = Number.parseFloat(calculation.farmerPrice)
    return { farmerAmount }
  }

  const handleAcceptOffer = async (offerId: number) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedOffers = offers.map((offer) =>
      offer.id === offerId
        ? {
            ...offer,
            status: "accepted",
            updatedAt: new Date().toISOString(),
          }
        : offer,
    )
    setOffers(updatedOffers)
    setIsLoading(false)
    toast.success("Oferta aceptada. Se ha notificado al agricultor sobre la venta.")
  }

  const handleRejectOffer = async (offerId: number) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedOffers = offers.map((offer) =>
      offer.id === offerId
        ? {
            ...offer,
            status: "rejected",
            updatedAt: new Date().toISOString(),
          }
        : offer,
    )
    setOffers(updatedOffers)
    setIsLoading(false)
    toast.success("Oferta rechazada. Se ha notificado a la empresa.")
  }

  const handleCalculateAndNotify = async () => {
    if (!calculation.farmerPrice || !calculation.message || !selectedOffer) {
      toast.error("Por favor completa todos los campos")
      return
    }

    const { farmerAmount } = calculateAmounts()

    if (farmerAmount <= 0) {
      toast.error("El precio para el agricultor debe ser mayor a cero")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Actualizar la oferta con los cálculos y marcar como notificado
    const updatedOffers = offers.map((offer) =>
      offer.id === selectedOffer.id
        ? {
            ...offer,
            farmerNotified: true,
            farmerAmount,
            adminCommission: null,
            adminExpenses: null,
          }
        : offer,
    )
    setOffers(updatedOffers)

    setIsLoading(false)
    setIsCalculateDialogOpen(false)
    setCalculation({
      farmerPrice: "",
      message: "Tienes una nueva oferta por tu huerta. Por favor revisa los detalles en tu panel.",
    })
    toast.success(`Notificación enviada a ${selectedOffer?.farmerName} con el monto calculado`)
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Métricas
  const totalOffers = offers.length
  const pendingOffers = offers.filter((o) => o.status === "pending").length
  const acceptedOffers = offers.filter((o) => o.status === "accepted").length

  return (
    <AppLayout type="admin">
      <div className="w-full overflow-x-hidden max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Ofertas</h1>
            <p className="text-sm sm:text-base text-gray-600">Administra todas las ofertas recibidas de las empresas</p>
          </div>

          {/* Búsqueda y filtros */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por huerta, empresa, agricultor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs optimizados para móvil */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto no-scrollbar w-full">
              <TabsList className="flex w-max sm:w-full h-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">Todas</span>
                  <span className="sm:hidden">Todo</span>
                  <span className="ml-1">({totalOffers})</span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">Pendientes</span>
                  <span className="sm:hidden">Pend</span>
                  <span className="ml-1">({pendingOffers})</span>
                </TabsTrigger>
                <TabsTrigger value="accepted" className="text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">Aceptadas</span>
                  <span className="sm:hidden">Acep</span>
                  <span className="ml-1">({acceptedOffers})</span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">Rechazadas</span>
                  <span className="sm:hidden">Rech</span>
                  <span className="ml-1">({offers.filter((o) => o.status === "rejected").length})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredOffers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron ofertas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                    >
                      {/* Header de la tarjeta */}
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words leading-tight">
                              {offer.huertaName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1 min-w-0">
                                <Building2 className="h-4 w-4 flex-shrink-0" />
                                <span className="break-words">{offer.companyName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">{formatDate(offer.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Badge className={`${getStatusColor(offer.status)} whitespace-nowrap`}>
                              {getStatusText(offer.status)}
                            </Badge>
                            {!offer.farmerNotified && offer.status === "pending" && (
                              <Badge className="bg-orange-100 text-orange-800 whitespace-nowrap">
                                <Bell className="h-3 w-3 mr-1 flex-shrink-0" />
                                Sin calcular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contenido principal */}
                      <div className="p-4 sm:p-6 space-y-4">
                        {/* Información de la oferta */}
                        <div className="bg-white-50 rounded-lg p-6">
                          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-white-600 flex-shrink-0" />
                            Información de la Oferta
                          </h4>

                          <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="precio">Precio $ *</Label>
                            <Input
                              id="precio"
                              type="number"
                              readOnly
                              placeholder="0"
                              value="500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cm-jima">Cm de Jima *</Label>
                            <Input id="cm-jima" type="number" placeholder="Centímetros" readOnly value={5} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="meses-financiado">Meses financiado *</Label>
                            <Input id="meses-financiado" type="number" placeholder="Número de meses" readOnly value={5} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fecha-jima">Fecha de mes de jima *</Label>
                            <Input id="fecha-jima" type="date" readOnly value={"Marzo 2025"} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="kilos-minimo">Se jimará a partir de * kilos para arriba *</Label>
                            <Input id="kilos-minimo" type="number" placeholder="Kilos mínimos" readOnly value={15} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pagos-viajes">Cómo serían los pagos de viajes jimados *</Label>
                            <textarea
                              id="pagos-viajes"
                              placeholder="Describe cómo serían los pagos..."
                              readOnly
                              value={"Pago contra entrega por viaje completado"}
                              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="logistica">
                              El Agave sería puesto en fábrica o la fábrica se encargaría de toda la logística *
                            </Label>
                            <textarea
                              id="logistica"
                              placeholder="Especifica la logística..."
                              readOnly
                              value={"La fábrica se encarga de toda la logística de transporte"}
                              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                              rows={2}
                            />
                          </div>

                         
                          </div>
                        </div>


                        {/* Información del agricultor */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <h4 className="font-medium text-gray-900">Información del Agricultor</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-600">Nombre:</span>
                              <span className="break-words">{offer.farmerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">ID:</span>
                              <span className="break-all">{offer.farmerUniqueId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="break-all">{offer.farmerEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="break-all">{offer.farmerPhone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mensaje de la empresa */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Mensaje de la Empresa</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg break-words leading-relaxed">
                            {offer.message}
                          </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                          {!offer.farmerNotified && offer.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOffer(offer)
                                setCalculation({
                                  farmerPrice: "",
                                  message: `Hola ${offer.farmerName}, tienes una nueva oferta de ${offer.companyName} por tu huerta "${offer.huertaName}". Por favor revisa los detalles en tu panel.`,
                                })
                                setIsCalculateDialogOpen(true)
                              }}
                              className="text-orange-600 border-orange-600 hover:bg-orange-50 w-full sm:w-auto"
                            >
                              <Calculator className="h-4 w-4 mr-2 flex-shrink-0" />
                              Notificar a Agricultor
                            </Button>
                          )}

                          {(offer.status === "pending" || offer.status === "accepted") && offer.farmerNotified && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptOffer(offer.id)}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                              >
                                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                Aceptar
                              </Button>
                            
                            </>
                          )}

                          {offer.status === "accepted" && (
                            <div className="flex items-center gap-2 text-green-600 text-sm w-full sm:w-auto">
                              <CheckCircle className="h-4 w-4 flex-shrink-0" />
                              <span>Venta completada - Agricultor notificado</span>
                            </div>
                          )}

                          {offer.status === "rejected" && (
                            <div className="flex items-center gap-2 text-red-600 text-sm w-full sm:w-auto">
                              <XCircle className="h-4 w-4 flex-shrink-0" />
                              <span>Oferta rechazada - Empresa notificada</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Modal para calcular comisión y notificar al agricultor */}
          <Dialog open={isCalculateDialogOpen} onOpenChange={setIsCalculateDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Notificación de Precio al Agricultor</DialogTitle>
                <DialogDescription className="text-sm">
                  Establece el precio final para {selectedOffer?.farmerName}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:gap-6 py-4">
                {/* Información de la oferta */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Información de la Oferta</Label>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <strong>Huerta:</strong> <span className="break-words">{selectedOffer?.huertaName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <strong>Oferta Total:</strong>
                      <span className="text-blue-600 font-bold break-all">
                        {selectedOffer && formatCurrency(selectedOffer.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Precio para agricultor */}
                <div className="space-y-2">
                  <Label htmlFor="farmerPrice" className="text-sm">
                    Precio a Agricultor (MXN)
                  </Label>
                  <Input
                    id="farmerPrice"
                    type="number"
                    value={calculation.farmerPrice}
                    onChange={(e) => setCalculation({ ...calculation, farmerPrice: e.target.value })}
                    placeholder="750000"
                    min="0"
                    className="text-sm"
                  />
                </div>

                {/* Mensaje personalizado */}
                <div className="space-y-2">
                  <Label htmlFor="farmerMessage" className="text-sm">
                    Mensaje
                  </Label>
                  <Textarea
                    id="farmerMessage"
                    value={calculation.message}
                    onChange={(e) => setCalculation({ ...calculation, message: e.target.value })}
                    placeholder="Escribe el mensaje..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsCalculateDialogOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button
                  onClick={handleCalculateAndNotify}
                  disabled={isLoading || !calculation.farmerPrice || !calculation.message}
                  className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2 flex-shrink-0" />
                      Notificar a Agricultor
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  )
}
