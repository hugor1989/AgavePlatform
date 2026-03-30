"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MapPin, FileText, Calendar, Clock, User, Building2, DollarSign } from "lucide-react"
import Image from "next/image"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { orchardService } from "@/services/orchardService"

export default function AdminHuertasVendidasPage() {
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
      s.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.unique_identifier?.includes(searchTerm) ||
      String(s.id).includes(searchTerm),
  )

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })

  if (loading) return <AppLayout type="admin"><p className="p-4">Cargando huertas vendidas...</p></AppLayout>

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

        {filtered.length === 0 ? (
          <p className="text-gray-500">No hay ventas registradas aún.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sale) => (
              <Card key={sale.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-700">Precio empresa</p>
                      <p className="text-sm font-bold text-blue-800">
                        ${Number(sale.company_price).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-700">Precio agricultor</p>
                      <p className="text-sm font-bold text-green-800">
                        ${Number(sale.farmer_price).toLocaleString("es-MX")}
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-orange-700 font-medium">Comisión plataforma</p>
                    </div>
                    <p className="text-lg font-bold text-orange-800 mt-1">
                      ${(Number(sale.company_price) - Number(sale.farmer_price)).toLocaleString("es-MX")}
                    </p>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => { setSelectedSale(sale); setShowDialog(true) }}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Oferta Completa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
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

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-700">Precio empresa</p>
                    <p className="font-bold text-blue-800">${Number(selectedSale.company_price).toLocaleString("es-MX")}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-700">Precio agricultor</p>
                    <p className="font-bold text-green-800">${Number(selectedSale.farmer_price).toLocaleString("es-MX")}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-orange-700">Comisión</p>
                    <p className="font-bold text-orange-800">
                      ${(Number(selectedSale.company_price) - Number(selectedSale.farmer_price)).toLocaleString("es-MX")}
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
      </div>
    </AppLayout>
  )
}
