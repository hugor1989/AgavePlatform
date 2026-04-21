"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { jimaTripService, JimaTrip } from "@/services/jimaTripService"
import { SaleCardsPanel } from "@/components/admin/SaleCardsPanel"

export default function AdminHuertasVendidasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sales, setSales]           = useState<OrchardSale[]>([])
  const [tripsMap, setTripsMap]     = useState<Record<number, JimaTrip[]>>({})
  const [loading, setLoading]       = useState(true)

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

  const handleTripsUpdate = (saleId: number, updatedTrip: JimaTrip) => {
    setTripsMap((prev) => {
      const clone = { ...prev }
      clone[saleId] = (clone[saleId] ?? []).map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
      return clone
    })
  }

  const handleSaleFinished = (updatedSale: OrchardSale) => {
    setSales((prev) => prev.map((s) => (s.id === updatedSale.id ? { ...s, ...updatedSale } : s)))
  }

  const filtered = sales.filter(
    (s) =>
      s.orchard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.company?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.unique_identifier?.includes(searchTerm) ||
      String(s.id).includes(searchTerm) ||
      (s.orchard?.orchard_number ?? '').includes(searchTerm),
  )

  const active         = filtered.filter((s) => s.status !== "jima_terminada")
  const terminated     = filtered.filter((s) => s.status === "jima_terminada")
  const withPending    = active.filter((s) => (tripsMap[s.id] ?? []).some((t) => t.status === "programado"))
  const withoutPending = active.filter((s) => !(tripsMap[s.id] ?? []).some((t) => t.status === "programado"))

  if (loading)
    return (
      <AppLayout type="admin">
        <p className="p-4">Cargando huertas vendidas...</p>
      </AppLayout>
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

        <Tabs defaultValue="activas">
          <TabsList className="mb-4">
            <TabsTrigger value="activas">Activas ({active.length})</TabsTrigger>
            <TabsTrigger value="pendientes">Con viajes pendientes ({withPending.length})</TabsTrigger>
            <TabsTrigger value="sin-pendientes">Sin viajes pendientes ({withoutPending.length})</TabsTrigger>
            <TabsTrigger value="terminadas">Jimas terminadas ({terminated.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="activas">
            <SaleCardsPanel sales={active} tripsMap={tripsMap} onTripsUpdate={handleTripsUpdate} onSaleFinished={handleSaleFinished} />
          </TabsContent>
          <TabsContent value="pendientes">
            <SaleCardsPanel sales={withPending} tripsMap={tripsMap} onTripsUpdate={handleTripsUpdate} onSaleFinished={handleSaleFinished} />
          </TabsContent>
          <TabsContent value="sin-pendientes">
            <SaleCardsPanel sales={withoutPending} tripsMap={tripsMap} onTripsUpdate={handleTripsUpdate} onSaleFinished={handleSaleFinished} />
          </TabsContent>
          <TabsContent value="terminadas">
            <SaleCardsPanel sales={terminated} tripsMap={tripsMap} isTerminatedView onTripsUpdate={handleTripsUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
