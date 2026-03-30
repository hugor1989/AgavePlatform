"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MapPin, FileText, Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { orchardService } from "@/services/orchardService"

export default function CompanyPurchasesPage() {
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
      s.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).includes(searchTerm),
  )

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })

  if (loading) return <AppLayout type="company"><p className="p-4">Cargando compras...</p></AppLayout>

  return (
    <AppLayout type="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Compras</h1>
          <p className="text-gray-600">Huertas que has adquirido a través de la plataforma</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por huerta o agricultor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500">No tienes compras registradas aún.</p>
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
                    <Badge className="bg-blue-600 text-white">Comprada</Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{sale.orchard?.name ?? `Huerta #${sale.orchard_id}`}</h3>
                    <p className="text-sm text-gray-500">Compra #{sale.id}</p>
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
                    <div>
                      <p className="text-xs text-gray-500">Agricultor</p>
                      <p className="text-sm font-medium text-gray-900">{sale.farmer?.full_name ?? "—"}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">Precio de compra</p>
                    <p className="text-xl font-bold text-blue-800">
                      ${Number(sale.company_price).toLocaleString("es-MX")}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{formatDate(sale.sold_at)}</p>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => { setSelectedSale(sale); setShowDialog(true) }}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Detalle Oferta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Oferta — {selectedSale?.orchard?.name}</DialogTitle>
            </DialogHeader>
            {selectedSale?.offer && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agricultor:</span>
                    <span className="font-medium">{selectedSale.farmer?.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de compra:</span>
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
