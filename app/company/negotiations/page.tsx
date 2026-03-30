"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Search, MessageSquare, CheckCircle, XCircle, Clock, Hash } from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"
import { offerService, Offer } from "@/services/offerService"

export default function CompanyNegotiations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    offerService.getAll()
      .then(setOffers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = offers.filter(
    (o) =>
      o.orchard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orchard?.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.id).includes(searchTerm),
  )

  const byStatus = (s: Offer["status"]) => filtered.filter((o) => o.status === s)

  const getStatusColor = (status: Offer["status"]) => {
    switch (status) {
      case "pendiente": return "bg-yellow-100 text-yellow-800"
      case "revisada":  return "bg-blue-100 text-blue-800"
      case "aceptada":  return "bg-green-100 text-green-800"
      case "rechazada": return "bg-red-100 text-red-800"
      default:          return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Offer["status"]) => {
    switch (status) {
      case "pendiente": return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
      case "revisada":  return <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
      case "aceptada":  return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "rechazada": return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      default:          return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  const statusLabel = (status: Offer["status"]) =>
    ({ pendiente: "En Revisión", revisada: "Enviada al Agricultor", aceptada: "Aceptada", rechazada: "Rechazada" }[status] ?? status)

  const OfferCard = ({ offer }: { offer: Offer }) => (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 break-words leading-tight">
              {offer.orchard?.name ?? `Huerta #${offer.orchard_id}`}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">Oferta #{offer.id}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(offer.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
          <Badge className={`${getStatusColor(offer.status)} flex items-center gap-1 text-xs px-2 py-1 flex-shrink-0`}>
            {getStatusIcon(offer.status)}
            {statusLabel(offer.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-900">Detalles de la Oferta</h4>

          <div className="space-y-2">
            <Label>Precio $</Label>
            <Input type="number" readOnly value={offer.price} />
          </div>
          <div className="space-y-2">
            <Label>Cm de Jima</Label>
            <Input type="number" readOnly value={offer.jima_cm} />
          </div>
          <div className="space-y-2">
            <Label>Meses financiado</Label>
            <Input type="number" readOnly value={offer.financing_months} />
          </div>
          <div className="space-y-2">
            <Label>Fecha de mes de jima</Label>
            <Input type="date" readOnly value={offer.harvest_date} />
          </div>
          <div className="space-y-2">
            <Label>Kilos mínimos por viaje</Label>
            <Input type="number" readOnly value={offer.min_kilos} />
          </div>
          <div className="space-y-2">
            <Label>Pagos de viajes jimados</Label>
            <textarea readOnly value={offer.payment_terms} rows={2}
              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label>Logística</Label>
            <textarea readOnly value={offer.logistics} rows={2}
              className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50" />
          </div>

          {offer.farmer_notified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800">Oferta enviada al agricultor para su aprobación</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const EmptyCard = ({ message }: { message: string }) => (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center h-32">
        <p className="text-muted-foreground text-sm sm:text-base">{message}</p>
      </CardContent>
    </Card>
  )

  return (
    <AppLayout type="company">
      <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Negociaciones</h1>
              <p className="text-gray-600">Seguimiento de todas tus ofertas enviadas</p>
            </div>

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por huerta, agricultor o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full text-sm sm:text-base"
              />
            </div>

            {loading ? (
              <p className="text-gray-500">Cargando ofertas...</p>
            ) : (
              <Tabs defaultValue="process" className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 min-w-max">
                    <TabsTrigger value="process" className="text-xs sm:text-sm whitespace-nowrap">
                      En Revisión ({byStatus("pendiente").length})
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="text-xs sm:text-sm whitespace-nowrap">
                      Enviadas ({byStatus("revisada").length})
                    </TabsTrigger>
                    <TabsTrigger value="accepted" className="text-xs sm:text-sm whitespace-nowrap">
                      Aceptadas ({byStatus("aceptada").length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="text-xs sm:text-sm whitespace-nowrap">
                      Rechazadas ({byStatus("rechazada").length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="process" className="w-full">
                  {byStatus("pendiente").length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {byStatus("pendiente").map((o) => <OfferCard key={o.id} offer={o} />)}
                    </div>
                  ) : (
                    <EmptyCard message="No hay ofertas en revisión" />
                  )}
                </TabsContent>

                <TabsContent value="sent" className="w-full">
                  {byStatus("revisada").length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {byStatus("revisada").map((o) => <OfferCard key={o.id} offer={o} />)}
                    </div>
                  ) : (
                    <EmptyCard message="No hay ofertas esperando respuesta" />
                  )}
                </TabsContent>

                <TabsContent value="accepted" className="w-full">
                  {byStatus("aceptada").length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {byStatus("aceptada").map((o) => <OfferCard key={o.id} offer={o} />)}
                    </div>
                  ) : (
                    <EmptyCard message="No hay ofertas aceptadas" />
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="w-full">
                  {byStatus("rechazada").length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {byStatus("rechazada").map((o) => <OfferCard key={o.id} offer={o} />)}
                    </div>
                  ) : (
                    <EmptyCard message="No hay ofertas rechazadas" />
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
