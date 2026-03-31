"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Search, Building2, CheckCircle, XCircle, Calendar, Users, Send, Bell,
  Calculator, DollarSign, Mail, Phone, User, Clock,
} from "lucide-react"
import { toast } from "sonner"
import { offerService, Offer } from "@/services/offerService"

export default function AdminOfertasPage() {
  const [offers, setOffers]               = useState<Offer[]>([])
  const [loading, setLoading]             = useState(true)
  const [searchTerm, setSearchTerm]       = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [activeTab, setActiveTab]         = useState("all")
  const [isLoading, setIsLoading]         = useState(false)
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false)
  const [selectedOffer, setSelectedOffer]           = useState<Offer | null>(null)
  const [farmerPrice, setFarmerPrice]               = useState("")
  const [adminNotes, setAdminNotes]                 = useState("")

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const data = await offerService.getAll()
      setOffers(data)
    } catch (err) {
      console.error(err)
      toast.error("No se pudieron cargar las ofertas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOffers() }, [])

  const companies = Array.from(new Set(offers.map((o) => o.company?.business_name).filter(Boolean)))

  const filtered = offers.filter((o) => {
    const matchSearch =
      o.orchard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.company?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orchard?.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orchard?.farmer?.unique_identifier?.includes(searchTerm)
    const matchCompany = selectedCompany === "all" || o.company?.business_name === selectedCompany
    const matchTab =
      activeTab === "all" ||
      (activeTab === "pending"   && o.status === "pendiente") ||
      (activeTab === "reviewed"  && o.status === "revisada")  ||
      (activeTab === "accepted"  && o.status === "aceptada")  ||
      (activeTab === "rejected"  && o.status === "rechazada")
    return matchSearch && matchCompany && matchTab
  })

  const countByStatus = (s: Offer["status"]) => offers.filter((o) => o.status === s).length

  const statusColor = (s: Offer["status"]) =>
    ({ pendiente: "bg-yellow-100 text-yellow-800", revisada: "bg-blue-100 text-blue-800", aceptada: "bg-green-100 text-green-800", rechazada: "bg-red-100 text-red-800" }[s] ?? "bg-gray-100 text-gray-800")

  const statusLabel = (s: Offer["status"]) =>
    ({ pendiente: "Pendiente", revisada: "Revisada", aceptada: "Aceptada", rechazada: "Rechazada" }[s] ?? s)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  const handleNotifyFarmer = async () => {
    if (!selectedOffer || !farmerPrice) { toast.error("Ingresa el precio para el agricultor."); return }
    setIsLoading(true)
    try {
      const updated = await offerService.notifyFarmer(selectedOffer.id, parseFloat(farmerPrice), adminNotes)
      setOffers(prev => prev.map(o => o.id === updated.id ? updated : o))
      toast.success(`Agricultor notificado con el precio $${Number(farmerPrice).toLocaleString("es-MX")}`)
      setIsNotifyDialogOpen(false)
      setFarmerPrice("")
      setAdminNotes("")
    } catch { toast.error("No se pudo notificar al agricultor.") }
    finally { setIsLoading(false) }
  }

  return (
    <AppLayout type="admin">
      <div className="w-full overflow-x-hidden max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Ofertas</h1>
            <p className="text-sm sm:text-base text-gray-600">Administra todas las ofertas recibidas de las empresas</p>
          </div>

          {/* Filtros */}
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
                {companies.map((c) => (
                  <SelectItem key={c} value={c!}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-gray-500">Cargando ofertas...</p>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto no-scrollbar w-full">
                <TabsList className="flex w-max sm:w-full h-auto">
                  <TabsTrigger value="all"      className="text-xs sm:text-sm px-2 py-2">Todas ({offers.length})</TabsTrigger>
                  <TabsTrigger value="pending"  className="text-xs sm:text-sm px-2 py-2">Pendientes ({countByStatus("pendiente")})</TabsTrigger>
                  <TabsTrigger value="reviewed" className="text-xs sm:text-sm px-2 py-2">Revisadas ({countByStatus("revisada")})</TabsTrigger>
                  <TabsTrigger value="accepted" className="text-xs sm:text-sm px-2 py-2">Aceptadas ({countByStatus("aceptada")})</TabsTrigger>
                  <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 py-2">Rechazadas ({countByStatus("rechazada")})</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="space-y-4 mt-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No se encontraron ofertas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filtered.map((offer) => (
                      <div key={offer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

                        {/* Header tarjeta */}
                        <div className="p-4 sm:p-6 border-b border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words leading-tight">
                                {offer.orchard?.name ?? `Huerta #${offer.orchard_id}`}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4 flex-shrink-0" />
                                  <span>{offer.company?.business_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 flex-shrink-0" />
                                  <span>{formatDate(offer.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <Badge className={`${statusColor(offer.status)} whitespace-nowrap`}>
                                {statusLabel(offer.status)}
                              </Badge>
                              {offer.status === "pendiente" && (
                                <Badge className="bg-orange-100 text-orange-800 whitespace-nowrap">
                                  <Bell className="h-3 w-3 mr-1" />Sin calcular
                                </Badge>
                              )}
                              {offer.status === "revisada" && (
                                <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">
                                  <Clock className="h-3 w-3 mr-1" />Esperando agricultor
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detalle oferta */}
                        <div className="p-4 sm:p-6 space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-gray-600 flex-shrink-0" />
                              Información de la Oferta
                            </h4>
                            {offer.orchard?.plant_quantity && (
                              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-teal-700 font-medium mb-1">Total estimado de la oferta</p>
                                <p className="text-2xl font-bold text-teal-800">
                                  ${(offer.price * offer.orchard.plant_quantity).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-teal-600 mt-1">
                                  ${Number(offer.price).toLocaleString("es-MX", { minimumFractionDigits: 2 })} × {offer.orchard.plant_quantity.toLocaleString()} plantas
                                </p>
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div><span className="font-medium text-gray-600">Precio por planta:</span> ${Number(offer.price).toLocaleString("es-MX")}</div>
                              <div><span className="font-medium text-gray-600">Cm Jima:</span> {offer.jima_cm} cm</div>
                              <div><span className="font-medium text-gray-600">Financiamiento:</span> {offer.financing_months} meses</div>
                              <div><span className="font-medium text-gray-600">Fecha jima:</span> {offer.harvest_date}</div>
                              <div><span className="font-medium text-gray-600">Kilos mín.:</span> {offer.min_kilos?.toLocaleString()}</div>
                            </div>
                            <div className="mt-3 space-y-2 text-sm">
                              <div><span className="font-medium text-gray-600">Pagos:</span> <span className="text-gray-700">{offer.payment_terms}</span></div>
                              <div><span className="font-medium text-gray-600">Logística:</span> <span className="text-gray-700">{offer.logistics}</span></div>
                            </div>
                            {offer.farmer_notified && offer.farmer_price !== null && (
                              <div className="mt-3 bg-orange-50 border border-orange-200 rounded p-3">
                                <p className="text-sm font-medium text-orange-800">Precio comunicado al agricultor</p>
                                <p className="text-lg font-bold text-orange-900">${Number(offer.farmer_price).toLocaleString("es-MX")}</p>
                                {offer.admin_notes && <p className="text-xs text-orange-700 mt-1">{offer.admin_notes}</p>}
                              </div>
                            )}
                          </div>

                          {/* Info agricultor */}
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <User className="h-5 w-5 text-green-600 flex-shrink-0" />
                              <h4 className="font-medium text-gray-900">Información del Agricultor</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{offer.orchard?.farmer?.full_name ?? "—"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">ID:</span>
                                <span>{offer.orchard?.farmer?.unique_identifier ?? "—"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{offer.orchard?.farmer?.email ?? "—"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{offer.orchard?.farmer?.phone ?? "—"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                            {offer.status === "pendiente" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedOffer(offer); setFarmerPrice(""); setAdminNotes(""); setIsNotifyDialogOpen(true) }}
                                className="text-orange-600 border-orange-600 hover:bg-orange-50 w-full sm:w-auto"
                              >
                                <Calculator className="h-4 w-4 mr-2 flex-shrink-0" />
                                Revisar oferta
                              </Button>
                            )}

                            {offer.status === "revisada" && (
                              <div className="flex items-center gap-2 text-blue-600 text-sm">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                Esperando respuesta del agricultor
                              </div>
                            )}
                            {offer.status === "aceptada" && (
                              <div className="flex items-center gap-2 text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                Venta completada
                              </div>
                            )}
                            {offer.status === "rechazada" && (
                              <div className="flex items-center gap-2 text-red-600 text-sm">
                                <XCircle className="h-4 w-4 flex-shrink-0" />
                                Oferta rechazada
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
          )}

          {/* Dialog notificar agricultor */}
          <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle>Revisar oferta</DialogTitle>
                <DialogDescription>
                  Establece el precio para el agricultor {selectedOffer?.orchard?.farmer?.full_name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between gap-1">
                    <strong>Huerta:</strong>
                    <span>{selectedOffer?.orchard?.name}</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <strong>Precio por planta:</strong>
                    <span className="text-blue-600 font-bold">${Number(selectedOffer?.price ?? 0).toLocaleString("es-MX")}</span>
                  </div>
                  {selectedOffer?.orchard?.plant_quantity && (
                    <div className="flex justify-between gap-1">
                      <strong>Total estimado:</strong>
                      <span className="text-teal-700 font-bold">
                        ${((selectedOffer.price ?? 0) * selectedOffer.orchard.plant_quantity).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Precio a Agricultor (MXN) *</Label>
                  <Input
                    type="number"
                    value={farmerPrice}
                    onChange={(e) => setFarmerPrice(e.target.value)}
                    placeholder="750000"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notas (opcional)</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Observaciones internas..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button
                  onClick={handleNotifyFarmer}
                  disabled={isLoading || !farmerPrice}
                  className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                >
                  {isLoading ? "Guardando..." : <><Send className="h-4 w-4 mr-2" />Confirmar</>}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </AppLayout>
  )
}
