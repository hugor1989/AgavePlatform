"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MapPin, FileText, Calendar, Clock, Images, CheckCircle2, ExternalLink, AlertCircle, Truck } from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { orchardService } from "@/services/orchardService"
import { jimaTripService, JimaTrip } from "@/services/jimaTripService"

export default function FarmerSoldPage() {
  const [searchTerm, setSearchTerm]       = useState("")
  const [sales, setSales]                 = useState<OrchardSale[]>([])
  const [tripsMap, setTripsMap]           = useState<Record<number, JimaTrip[]>>({})
  const [loading, setLoading]             = useState(true)
  const [selectedSale, setSelectedSale]   = useState<OrchardSale | null>(null)
  const [showDialog, setShowDialog]       = useState(false)
  const [showTripsDialog, setShowTripsDialog] = useState(false)

  useEffect(() => {
    Promise.all([saleService.getAll(), jimaTripService.getAll()])
      .then(([salesData, tripsData]) => {
        setSales(salesData)
        const map: Record<number, JimaTrip[]> = {}
        tripsData.forEach((t) => {
          if (!map[t.sale_id]) map[t.sale_id] = []
          map[t.sale_id].push(t)
        })
        setTripsMap(map)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = sales.filter(
    (s) =>
      s.orchard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.company?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).includes(searchTerm),
  )

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })

  if (loading) return <AppLayout type="farmer"><p className="p-4">Cargando huertas vendidas...</p></AppLayout>

  return (
    <AppLayout type="farmer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Huertas Vendidas</h1>
          <p className="text-muted-foreground">Historial de todas tus huertas vendidas exitosamente</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre de huerta, empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500">No tienes huertas vendidas aún.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sale) => (
              <Card key={sale.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-orange-50 border-orange-200">
                <div className="relative">
                  <Image
                    src={orchardService.getPhotoUrl(sale.orchard?.cover_photo ?? null) || "/agave-field-plantation.png"}
                    alt={sale.orchard?.name ?? "Huerta"}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-600 text-white">Vendida</Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{sale.orchard?.name ?? `Huerta #${sale.orchard_id}`}</h3>
                    <p className="text-sm text-gray-500">Venta #{sale.id}</p>
                  </div>

                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-900">{sale.orchard?.agave_type?.name ?? "—"}</span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                    <span className="text-2xl font-bold text-blue-600">
                      {(sale.orchard?.plant_quantity ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="text-sm font-medium text-gray-900">{sale.orchard?.state ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Municipio</p>
                        <p className="text-sm font-medium text-gray-900">{sale.orchard?.municipality ?? "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Año</p>
                        <p className="text-sm font-medium text-gray-900">{sale.orchard?.year ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Edad</p>
                        <p className="text-sm font-medium text-gray-900">{sale.orchard?.age ?? "—"} años</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700">Tu precio de venta</p>
                    <p className="text-xl font-bold text-green-800">
                      ${Number(sale.farmer_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Vendida a {sale.company?.business_name} · {formatDate(sale.sold_at)}
                    </p>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => { setSelectedSale(sale); setShowDialog(true) }}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Detalles de Oferta
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-teal-300 text-teal-700 hover:bg-teal-50"
                    onClick={() => { setSelectedSale(sale); setShowTripsDialog(true) }}
                  >
                    <Images className="w-4 h-4 mr-2" />
                    Ver fotos de guías y pesadas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Dialog guías y pesadas ── */}
        <Dialog open={showTripsDialog} onOpenChange={setShowTripsDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Guías y pesadas — {selectedSale?.orchard?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedSale && (() => {
              const trips = (tripsMap[selectedSale.id] ?? []).sort(
                (a, b) => a.scheduled_date.localeCompare(b.scheduled_date) || a.trip_number - b.trip_number
              )
              if (trips.length === 0)
                return (
                  <div className="flex flex-col items-center gap-3 py-8 text-gray-500">
                    <AlertCircle className="w-10 h-10 text-gray-300" />
                    <p>No hay viajes registrados para esta huerta.</p>
                  </div>
                )
              const byDate: Record<string, JimaTrip[]> = {}
              trips.forEach((t) => {
                if (!byDate[t.scheduled_date]) byDate[t.scheduled_date] = []
                byDate[t.scheduled_date].push(t)
              })
              return (
                <div className="space-y-4">
                  {Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, dayTrips]) => (
                    <div key={date} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-gray-800">
                          {new Date(date).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">{dayTrips.length} viaje{dayTrips.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {dayTrips.map((trip) => (
                          <div key={trip.id} className="px-4 py-3 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-blue-700">#{trip.trip_number}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-800">Viaje {trip.trip_number}</span>
                              <Badge className={trip.status === "completado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                                {trip.status === "completado" ? "Completado" : "Programado"}
                              </Badge>
                            </div>
                            {/* Guía */}
                            <div className="pl-11 flex items-center gap-2">
                              {trip.guide_path ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  <span className="text-xs text-green-700">Guía disponible</span>
                                  <button
                                    className="ml-2 text-xs text-teal-600 underline flex items-center gap-1 hover:text-teal-800"
                                    onClick={async () => { const url = await jimaTripService.getGuideUrl(trip.id); window.open(url, "_blank") }}
                                  >
                                    <ExternalLink className="w-3 h-3" /> Ver guía
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">Sin guía adjunta</span>
                              )}
                            </div>
                            {/* Pesada */}
                            <div className="pl-11 flex items-center gap-2">
                              {trip.weigh_path ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                  <span className="text-xs text-blue-700">Pesada disponible</span>
                                  <button
                                    className="ml-2 text-xs text-blue-600 underline flex items-center gap-1 hover:text-blue-800"
                                    onClick={async () => { const url = await jimaTripService.getWeighUrl(trip.id); window.open(url, "_blank") }}
                                  >
                                    <ExternalLink className="w-3 h-3" /> Ver pesada
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">Sin pesada adjunta</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </DialogContent>
        </Dialog>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles de la Oferta Aceptada — {selectedSale?.orchard?.name}</DialogTitle>
            </DialogHeader>
            {selectedSale?.offer && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Empresa:</span>
                    <span className="font-medium">{selectedSale.company?.business_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de venta:</span>
                    <span className="font-medium">{formatDate(selectedSale.sold_at)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cm de Jima</Label>
                  <Input type="number" readOnly value={selectedSale.offer.jima_cm} />
                </div>
                <div className="space-y-2">
                  <Label>Meses financiado</Label>
                  <Input type="number" readOnly value={selectedSale.offer.financing_months} />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de mes de jima</Label>
                  <Input type="date" readOnly value={selectedSale.offer.harvest_date} />
                </div>
                <div className="space-y-2">
                  <Label>Kilos mínimos por viaje</Label>
                  <Input type="number" readOnly value={selectedSale.offer.min_kilos} />
                </div>
                <div className="space-y-2">
                  <Label>Pagos de viajes jimados</Label>
                  <textarea readOnly value={selectedSale.offer.payment_terms} rows={2}
                    className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Logística</Label>
                  <textarea readOnly value={selectedSale.offer.logistics} rows={2}
                    className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50" />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">Tu precio de venta</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${Number(selectedSale.farmer_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                  {selectedSale.offer.admin_notes && (
                    <p className="text-xs text-green-600 mt-2">{selectedSale.offer.admin_notes}</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
