"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MapPin, Eye, FileText, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { orchardService } from "@/services/orchardService"

export default function FarmerSoldPage() {
  const [searchTerm, setSearchTerm]       = useState("")
  const [sales, setSales]                 = useState<OrchardSale[]>([])
  const [loading, setLoading]             = useState(true)
  const [selectedSale, setSelectedSale]   = useState<OrchardSale | null>(null)
  const [showDialog, setShowDialog]       = useState(false)

  useEffect(() => {
    saleService.getAll()
      .then(setSales)
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
                      ${Number(sale.farmer_price).toLocaleString("es-MX")}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Vendida a {sale.company?.business_name} · {formatDate(sale.sold_at)}
                    </p>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => { setSelectedSale(sale); setShowDialog(true) }}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Detalles de Oferta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">Tu precio de venta</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${Number(selectedSale.farmer_price).toLocaleString("es-MX")}
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
