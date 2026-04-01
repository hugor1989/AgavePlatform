"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search, MapPin, FileText, Calendar, Clock, User, Building2,
  DollarSign, Truck, Upload, CheckCircle2, AlertCircle, ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { jimaTripService, JimaTrip } from "@/services/jimaTripService"
import { orchardService } from "@/services/orchardService"

export default function AdminHuertasVendidasPage() {
  const [searchTerm, setSearchTerm]         = useState("")
  const [sales, setSales]                   = useState<OrchardSale[]>([])
  const [tripsMap, setTripsMap]             = useState<Record<number, JimaTrip[]>>({})
  const [loading, setLoading]               = useState(true)
  const [selectedSale, setSelectedSale]     = useState<OrchardSale | null>(null)
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [showTripsDialog, setShowTripsDialog] = useState(false)
  const [uploadingId, setUploadingId]       = useState<number | null>(null)
  const fileInputRefs                        = useRef<Record<number, HTMLInputElement | null>>({})

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

  const tripsOf = (saleId: number) => tripsMap[saleId] ?? []

  const hasPending = (saleId: number) =>
    tripsOf(saleId).some((t) => t.status === "programado")

  const filtered = sales.filter(
    (s) =>
      s.orchard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.company?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.unique_identifier?.includes(searchTerm) ||
      String(s.id).includes(searchTerm),
  )

  const allSales      = filtered
  const withPending   = filtered.filter((s) => hasPending(s.id))
  const withoutPending = filtered.filter((s) => !hasPending(s.id))

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })

  const handleUploadGuide = async (tripId: number, file: File) => {
    setUploadingId(tripId)
    try {
      const updated = await jimaTripService.uploadGuide(tripId, file)
      setTripsMap((prev) => {
        const clone = { ...prev }
        const saleId = updated.sale_id
        clone[saleId] = (clone[saleId] ?? []).map((t) => (t.id === tripId ? updated : t))
        return clone
      })
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingId(null)
    }
  }

  const openTrips = (sale: OrchardSale) => {
    setSelectedSale(sale)
    setShowTripsDialog(true)
  }

  const openOffer = (sale: OrchardSale) => {
    setSelectedSale(sale)
    setShowOfferDialog(true)
  }

  if (loading)
    return (
      <AppLayout type="admin">
        <p className="p-4">Cargando huertas vendidas...</p>
      </AppLayout>
    )

  const SaleCard = ({ sale }: { sale: OrchardSale }) => {
    const trips   = tripsOf(sale.id)
    const pending = trips.filter((t) => t.status === "programado").length

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <Image
            src={orchardService.getPhotoUrl(sale.orchard?.cover_photo ?? null) || "/agave-field-plantation.png"}
            alt={sale.orchard?.name ?? "Huerta"}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className="bg-green-600 text-white">Vendida</Badge>
            {pending > 0 && (
              <Badge className="bg-amber-500 text-white">{pending} viaje{pending !== 1 ? "s" : ""} pendiente{pending !== 1 ? "s" : ""}</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{sale.orchard?.name ?? `Huerta #${sale.orchard_id}`}</h3>
            <p className="text-sm text-gray-500">Venta #{sale.id} · {formatDate(sale.sold_at)}</p>
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

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Agricultor</p>
              <p className="text-sm font-medium text-gray-900 truncate">{sale.farmer?.full_name ?? "—"}</p>
              <p className="text-xs text-gray-400">{sale.farmer?.unique_identifier}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Empresa compradora</p>
              <p className="text-sm font-medium text-gray-900 truncate">{sale.company?.business_name ?? "—"}</p>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="text-xs text-teal-700">Total estimado (precio × plantas)</p>
            <p className="text-lg font-bold text-teal-800">
              ${(Number(sale.company_price) * (sale.orchard?.plant_quantity ?? 0)).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-teal-600 mt-1">
              ${Number(sale.company_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })} × {(sale.orchard?.plant_quantity ?? 0).toLocaleString()} plantas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700">Precio agricultor</p>
              <p className="text-base font-bold text-green-800">
                ${Number(sale.farmer_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-orange-600" />
                <p className="text-xs text-orange-700 font-medium">Comisión</p>
              </div>
              <p className="text-base font-bold text-orange-800 mt-1">
                ${(Number(sale.company_price) * (sale.orchard?.plant_quantity ?? 0) - Number(sale.farmer_price)).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={() => openOffer(sale)}>
              <FileText className="w-4 h-4 mr-2" />
              Ver Oferta
            </Button>
            <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => openTrips(sale)}>
              <Truck className="w-4 h-4 mr-2" />
              Viajes ({trips.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const SaleGrid = ({ list }: { list: OrchardSale[] }) =>
    list.length === 0 ? (
      <p className="text-gray-500 py-4">No hay huertas en esta categoría.</p>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((sale) => (
          <SaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    )

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Huertas Vendidas</h1>
          <p className="text-gray-600">Registro de todas las ventas completadas en la plataforma</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por huerta, empresa, agricultor o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1 whitespace-nowrap">
            {sales.length} {sales.length === 1 ? "venta" : "ventas"}
          </Badge>
        </div>

        <Tabs defaultValue="todas">
          <TabsList className="mb-4">
            <TabsTrigger value="todas">
              Todas ({allSales.length})
            </TabsTrigger>
            <TabsTrigger value="pendientes">
              Con viajes pendientes ({withPending.length})
            </TabsTrigger>
            <TabsTrigger value="sin-pendientes">
              Sin viajes pendientes ({withoutPending.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            <SaleGrid list={allSales} />
          </TabsContent>
          <TabsContent value="pendientes">
            <SaleGrid list={withPending} />
          </TabsContent>
          <TabsContent value="sin-pendientes">
            <SaleGrid list={withoutPending} />
          </TabsContent>
        </Tabs>

        {/* ── Offer Dialog ── */}
        <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Oferta Completa — {selectedSale?.orchard?.name}</DialogTitle>
            </DialogHeader>
            {selectedSale?.offer && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">Agricultor</p>
                    <p className="font-medium">{selectedSale.farmer?.full_name}</p>
                    <p className="text-xs text-gray-400">{selectedSale.farmer?.unique_identifier}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">Empresa</p>
                    <p className="font-medium">{selectedSale.company?.business_name}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <p className="text-xs text-teal-700">Total estimado (precio × plantas)</p>
                    <p className="text-xl font-bold text-teal-800">
                      ${(Number(selectedSale.company_price) * (selectedSale.orchard?.plant_quantity ?? 0)).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-teal-600 mt-1">
                      ${Number(selectedSale.company_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })} × {(selectedSale.orchard?.plant_quantity ?? 0).toLocaleString()} plantas
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700">Precio al agricultor</p>
                    <p className="text-xl font-bold text-green-800">
                      ${Number(selectedSale.farmer_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs text-orange-700 font-medium">Comisión plataforma</p>
                    <p className="text-xl font-bold text-orange-800 mt-1">
                      ${(Number(selectedSale.company_price) * (selectedSale.orchard?.plant_quantity ?? 0) - Number(selectedSale.farmer_price)).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Total estimado − precio agricultor</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Precio ofertado $</Label>
                  <Input type="number" readOnly value={selectedSale.offer.price} />
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
                {selectedSale.offer.admin_notes && (
                  <div className="space-y-2">
                    <Label>Notas del admin</Label>
                    <textarea readOnly value={selectedSale.offer.admin_notes} rows={2}
                      className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50" />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Trips Dialog ── */}
        <Dialog open={showTripsDialog} onOpenChange={setShowTripsDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-600" />
                Viajes programados — {selectedSale?.orchard?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedSale && (() => {
              const trips = tripsOf(selectedSale.id)

              if (trips.length === 0)
                return (
                  <div className="flex flex-col items-center gap-3 py-8 text-gray-500">
                    <AlertCircle className="w-10 h-10 text-gray-300" />
                    <p>No hay viajes programados para esta huerta.</p>
                    <p className="text-xs text-gray-400">La empresa compradora debe programar los viajes desde su panel.</p>
                  </div>
                )

              // Group by date
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
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-sm text-gray-800">{formatDate(date)}</span>
                        <span className="ml-auto text-xs text-gray-500">{dayTrips.length} viaje{dayTrips.length !== 1 ? "s" : ""}</span>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {dayTrips.sort((a, b) => a.trip_number - b.trip_number).map((trip) => (
                          <div key={trip.id} className="px-4 py-3 flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-teal-700">#{trip.trip_number}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">Viaje {trip.trip_number}</span>
                                {trip.status === "completado" ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Completado</Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Programado</Badge>
                                )}
                              </div>

                              {trip.guide_path ? (
                                <div className="flex items-center gap-1 mt-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-600">Guía subida</span>
                                  <button
                                    className="ml-2 text-xs text-teal-600 underline flex items-center gap-1 hover:text-teal-800"
                                    onClick={async () => {
                                      const url = await jimaTripService.getGuideUrl(trip.id)
                                      window.open(url, "_blank")
                                    }}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Ver documento
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 mt-1">Sin guía adjunta</p>
                              )}
                            </div>

                            <div className="flex-shrink-0">
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                ref={(el) => { fileInputRefs.current[trip.id] = el }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleUploadGuide(trip.id, file)
                                  e.target.value = ""
                                }}
                              />
                              <Button
                                size="sm"
                                variant={trip.guide_path ? "outline" : "default"}
                                className={trip.guide_path ? "border-teal-300 text-teal-700 hover:bg-teal-50" : "bg-teal-600 hover:bg-teal-700"}
                                disabled={uploadingId === trip.id}
                                onClick={() => fileInputRefs.current[trip.id]?.click()}
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                {uploadingId === trip.id
                                  ? "Subiendo..."
                                  : trip.guide_path
                                  ? "Reemplazar"
                                  : "Subir guía"}
                              </Button>
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
      </div>
    </AppLayout>
  )
}
