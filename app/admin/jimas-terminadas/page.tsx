"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle } from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"
import { saleService, OrchardSale } from "@/services/saleService"
import { jimaTripService, JimaTrip } from "@/services/jimaTripService"
import { SaleCardsPanel } from "@/components/admin/SaleCardsPanel"

export default function AdminJimasTerminadasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sales, setSales]           = useState<OrchardSale[]>([])
  const [tripsMap, setTripsMap]     = useState<Record<number, JimaTrip[]>>({})
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([saleService.getAll(), jimaTripService.getAll()])
      .then(([salesData, tripsData]) => {
        setSales(salesData.filter((s) => s.status === "jima_terminada"))
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
      s.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.unique_identifier?.includes(searchTerm) ||
      String(s.id).includes(searchTerm),
  )

  if (loading)
    return (
      <AppLayout type="admin">
        <p className="p-4">Cargando jimas terminadas...</p>
      </AppLayout>
    )

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-gray-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jimas Terminadas</h1>
            <p className="text-gray-600">Huertas cuyo proceso de jima ha sido completado</p>
          </div>
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
            {sales.length} {sales.length === 1 ? "jima terminada" : "jimas terminadas"}
          </Badge>
        </div>

        <SaleCardsPanel
          sales={filtered}
          tripsMap={tripsMap}
          isTerminatedView
        />
      </div>
    </AppLayout>
  )
}
