"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  MapPin, FileText, Calendar, Clock, Truck, Upload,
  CheckCircle2, AlertCircle, ExternalLink, Flag, Building2, IdCard, Mail, Phone, Eye,
} from "lucide-react"
import Image from "next/image"
import { OrchardSale } from "@/services/saleService"
import { JimaTrip, jimaTripService } from "@/services/jimaTripService"
import { orchardService } from "@/services/orchardService"
import { saleService } from "@/services/saleService"

interface SaleCardsPanelProps {
  sales: OrchardSale[]
  tripsMap: Record<number, JimaTrip[]>
  isTerminatedView?: boolean
  onTripsUpdate?: (saleId: number, updatedTrip: JimaTrip) => void
  onSaleFinished?: (updatedSale: OrchardSale) => void
}

export function SaleCardsPanel({
  sales,
  tripsMap,
  isTerminatedView = false,
  onTripsUpdate,
  onSaleFinished,
}: SaleCardsPanelProps) {
  const [selectedSale, setSelectedSale]           = useState<OrchardSale | null>(null)
  const [showOfferDialog, setShowOfferDialog]     = useState(false)
  const [showTripsDialog, setShowTripsDialog]     = useState(false)
  const [showFinishDialog, setShowFinishDialog]   = useState(false)
  const [showPhotoIdDialog, setShowPhotoIdDialog] = useState(false)
  const [finishingId, setFinishingId]             = useState<number | null>(null)
  const [uploadingId, setUploadingId]             = useState<number | null>(null)
  const [uploadingWeighId, setUploadingWeighId]   = useState<number | null>(null)
  const fileInputRefs                              = useRef<Record<number, HTMLInputElement | null>>({})
  const weighInputRefs                             = useRef<Record<number, HTMLInputElement | null>>({})

  const tripsOf = (saleId: number) => tripsMap[saleId] ?? []

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })

  const handleUploadGuide = async (tripId: number, saleId: number, file: File) => {
    setUploadingId(tripId)
    try {
      const updated = await jimaTripService.uploadGuide(tripId, file)
      onTripsUpdate?.(saleId, updated)
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingId(null)
    }
  }

  const handleUploadWeigh = async (tripId: number, saleId: number, file: File) => {
    setUploadingWeighId(tripId)
    try {
      const updated = await jimaTripService.uploadWeigh(tripId, file)
      onTripsUpdate?.(saleId, updated)
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingWeighId(null)
    }
  }

  const handleConfirmFinish = async () => {
    if (!selectedSale) return
    setFinishingId(selectedSale.id)
    try {
      const updated = await saleService.finish(selectedSale.id)
      onSaleFinished?.(updated)
      setShowFinishDialog(false)
    } catch (err) {
      console.error(err)
    } finally {
      setFinishingId(null)
    }
  }

  const finishPending = selectedSale
    ? tripsOf(selectedSale.id).filter((t) => t.status === "programado").length
    : 0

  if (sales.length === 0)
    return <p className="text-gray-500 py-4">No hay huertas en esta categoría.</p>

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sales.map((sale) => {
          const trips   = tripsOf(sale.id)
          const pending = trips.filter((t) => t.status === "programado").length

          return (
            <Card
              key={sale.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                isTerminatedView ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="relative">
                <Image
                  src={orchardService.getPhotoUrl(sale.orchard?.cover_photo ?? null) || "/agave-field-plantation.png"}
                  alt={sale.orchard?.name ?? "Huerta"}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {isTerminatedView ? (
                    <Badge className="bg-gray-600 text-white">Jima terminada</Badge>
                  ) : (
                    <Badge className="bg-green-600 text-white">Vendida</Badge>
                  )}
                  {!isTerminatedView && pending > 0 && (
                    <Badge className="bg-amber-500 text-white">
                      {pending} viaje{pending !== 1 ? "s" : ""} pendiente{pending !== 1 ? "s" : ""}
                    </Badge>
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

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700">Precio por kg agricultor</p>
                    <p className="text-base font-bold text-green-800">
                      ${Number(sale.farmer_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <p className="text-xs text-teal-700">Precio por kg empresa</p>
                    <p className="text-base font-bold text-teal-800">
                      ${Number(sale.company_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-purple-700 font-medium">Comisión plataforma por kg</p>
                  <p className="text-base font-bold text-purple-800">
                    ${(Number(sale.company_price) - Number(sale.farmer_price)).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Empresa compradora</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{sale.company?.business_name ?? "—"}</p>
                  </div>
                </div>

                {isTerminatedView && sale.finished_at && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-red-500">Jima terminada el</p>
                    <p className="text-sm font-semibold text-red-700">{formatDate(sale.finished_at)}</p>
                  </div>
                )}

                {isTerminatedView ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => { setSelectedSale(sale); setShowTripsDialog(true) }}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Ver programa de jima ({trips.length})
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver huerta
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { setSelectedSale(sale); setShowOfferDialog(true) }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver detalle oferta
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-40"
                      disabled={!sale.orchard?.photo_id}
                      onClick={() => { setSelectedSale(sale); setShowPhotoIdDialog(true) }}
                    >
                      <IdCard className="w-4 h-4 mr-2" />
                      Ver foto ID
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-40"
                        disabled={!sale.orchard?.photo_id}
                        onClick={() => { setSelectedSale(sale); setShowPhotoIdDialog(true) }}
                      >
                        <IdCard className="w-4 h-4 mr-2" />
                        Ver Foto ID
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => { setSelectedSale(sale); setShowOfferDialog(true) }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Oferta
                      </Button>
                    </div>
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => { setSelectedSale(sale); setShowTripsDialog(true) }}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Ver viajes ({trips.length})
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => { setSelectedSale(sale); setShowFinishDialog(true) }}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Terminar jima
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Photo ID Dialog ── */}
      <Dialog open={showPhotoIdDialog} onOpenChange={setShowPhotoIdDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IdCard className="w-5 h-5 text-blue-600" />
              Foto ID — {selectedSale?.orchard?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedSale?.orchard?.photo_id && (
            <div className="flex justify-center">
              <Image
                src={orchardService.getPhotoUrl(selectedSale.orchard.photo_id) || ""}
                alt="Foto ID de la huerta"
                width={500}
                height={400}
                className="rounded-lg object-contain max-h-[60vh] w-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                  <p className="text-gray-500 font-medium mb-1">Agricultor</p>
                  <p className="font-medium">{selectedSale.farmer?.full_name}</p>
                  <p className="text-xs text-gray-400">{selectedSale.farmer?.unique_identifier}</p>
                  {selectedSale.farmer?.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{selectedSale.farmer.email}</p>
                    </div>
                  )}
                  {selectedSale.farmer?.phone && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{selectedSale.farmer.phone}</p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 font-medium mb-1">Empresa</p>
                  <p className="font-medium">{selectedSale.company?.business_name}</p>
                  {selectedSale.company?.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{selectedSale.company.email}</p>
                    </div>
                  )}
                  {selectedSale.company?.phone && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{selectedSale.company.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700">Precio por kg al agricultor</p>
                  <p className="text-xl font-bold text-green-800">
                    ${Number(selectedSale.farmer_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p className="text-xs text-teal-700">Precio por kg empresa</p>
                  <p className="text-xl font-bold text-teal-800">
                    ${Number(selectedSale.company_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-purple-700 font-medium">Comisión plataforma por kg</p>
                  <p className="text-xl font-bold text-purple-800">
                    ${(Number(selectedSale.company_price) - Number(selectedSale.farmer_price)).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
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
                        <div key={trip.id} className="px-4 py-3 space-y-3">
                          <div className="flex items-center gap-4">
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
                            </div>
                          </div>

                          {/* Guía */}
                          <div className="flex items-center justify-between gap-3 pl-12">
                            <div className="flex-1 min-w-0">
                              {trip.guide_path ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-600">Guía subida</span>
                                  <button
                                    className="ml-2 text-xs text-teal-600 underline flex items-center gap-1 hover:text-teal-800"
                                    onClick={async () => {
                                      const url = await jimaTripService.getGuideUrl(trip.id)
                                      window.open(url, "_blank")
                                    }}
                                  >
                                    <ExternalLink className="w-3 h-3" /> Ver
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">Sin guía adjunta</p>
                              )}
                            </div>
                            {!isTerminatedView && (
                              <div className="flex-shrink-0">
                                <input
                                  type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                                  ref={(el) => { fileInputRefs.current[trip.id] = el }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleUploadGuide(trip.id, selectedSale.id, file)
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
                                  {uploadingId === trip.id ? "Subiendo..." : trip.guide_path ? "Reemplazar guía" : "Subir guía"}
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Pesada */}
                          <div className="flex items-center justify-between gap-3 pl-12">
                            <div className="flex-1 min-w-0">
                              {trip.weigh_path ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                  <span className="text-xs text-blue-600">Pesada subida</span>
                                  <button
                                    className="ml-2 text-xs text-blue-600 underline flex items-center gap-1 hover:text-blue-800"
                                    onClick={async () => {
                                      const url = await jimaTripService.getWeighUrl(trip.id)
                                      window.open(url, "_blank")
                                    }}
                                  >
                                    <ExternalLink className="w-3 h-3" /> Ver
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">Sin pesada adjunta</p>
                              )}
                            </div>
                            {!isTerminatedView && (
                              <div className="flex-shrink-0">
                                <input
                                  type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                                  ref={(el) => { weighInputRefs.current[trip.id] = el }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleUploadWeigh(trip.id, selectedSale.id, file)
                                    e.target.value = ""
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant={trip.weigh_path ? "outline" : "default"}
                                  className={trip.weigh_path ? "border-blue-300 text-blue-700 hover:bg-blue-50" : "bg-blue-600 hover:bg-blue-700"}
                                  disabled={uploadingWeighId === trip.id}
                                  onClick={() => weighInputRefs.current[trip.id]?.click()}
                                >
                                  <Upload className="w-3 h-3 mr-1" />
                                  {uploadingWeighId === trip.id ? "Subiendo..." : trip.weigh_path ? "Reemplazar pesada" : "Subir pesada de viaje"}
                                </Button>
                              </div>
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

      {/* ── Finish Jima Dialog ── */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              Terminar jima — {selectedSale?.orchard?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {finishPending > 0 && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Hay viajes pendientes</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Esta venta tiene <strong>{finishPending} viaje{finishPending !== 1 ? "s" : ""} programado{finishPending !== 1 ? "s" : ""}</strong> que aún no se han completado. Si terminas la jima, esos viajes quedarán sin cerrar.
                  </p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600">
              ¿Estás seguro de que deseas marcar esta jima como terminada? Esta acción moverá la huerta a <strong>Jimas terminadas</strong> y no podrá revertirse.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={finishingId === selectedSale?.id}
              onClick={handleConfirmFinish}
            >
              <Flag className="w-4 h-4 mr-2" />
              {finishingId === selectedSale?.id ? "Procesando..." : "Sí, terminar jima"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
