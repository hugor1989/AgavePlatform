"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { farmerService } from "@/services/farmerService"
import { orchardService, Orchard } from "@/services/orchardService"
import { ArrowLeft, MapPin, Calendar, Clock, Search } from "lucide-react"
import Image from "next/image"

export default function FarmerOrchardsPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()

  const [farmer, setFarmer]     = useState<any | null>(null)
  const [orchards, setOrchards] = useState<Orchard[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState("")

  useEffect(() => {
    Promise.all([
      farmerService.getById(id),
      orchardService.getAll({ per_page: 1000 }),
    ]).then(([farmerData, orchardsData]) => {
      setFarmer(farmerData?.data ?? farmerData)
      const list: Orchard[] = Array.isArray(orchardsData)
        ? orchardsData
        : (orchardsData as any)?.data ?? []
      setOrchards(list.filter((o) => o.farmer_id === Number(id)))
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const filtered = orchards.filter((o) =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.state?.toLowerCase().includes(search.toLowerCase()) ||
    o.municipality?.toLowerCase().includes(search.toLowerCase())
  )

  const statusLabel: Record<string, { label: string; className: string }> = {
    disponible: { label: "Disponible",  className: "bg-green-100 text-green-800" },
    vendida:    { label: "Vendida",     className: "bg-blue-100 text-blue-800" },
    negociando: { label: "Negociando",  className: "bg-yellow-100 text-yellow-800" },
  }

  if (loading) return <AppLayout type="admin"><p className="p-4">Cargando...</p></AppLayout>

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Huertas de {farmer?.full_name ?? `Agricultor #${id}`}
            </h1>
            <p className="text-sm text-gray-500">
              ID: {farmer?.unique_identifier} · {orchards.length} huerta{orchards.length !== 1 ? "s" : ""} registrada{orchards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, estado o municipio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-500">
            {orchards.length === 0 ? "Este agricultor no tiene huertas registradas." : "Sin resultados para tu búsqueda."}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((orchard) => {
              const st = statusLabel[orchard.status] ?? { label: orchard.status, className: "bg-gray-100 text-gray-700" }
              return (
                <Card key={orchard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={orchardService.getPhotoUrl(orchard.cover_photo) || "/agave-field-plantation.png"}
                      alt={orchard.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={st.className}>{st.label}</Badge>
                      {orchard.is_featured && (
                        <Badge className="bg-yellow-500 text-white">Destacada</Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{orchard.name}</h3>
                      <p className="text-sm text-gray-500">#{orchard.id}</p>
                    </div>

                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                      <span className="text-sm font-medium text-gray-900">{orchard.agave_type?.name ?? "—"}</span>
                    </div>

                    <div className="text-center py-1">
                      <p className="text-xs text-gray-500 mb-0.5">Cantidad de Plantas</p>
                      <span className="text-2xl font-bold text-blue-600">{orchard.plant_quantity.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Estado</p>
                          <p className="text-sm font-medium text-gray-900">{orchard.state ?? "—"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Municipio</p>
                        <p className="text-sm font-medium text-gray-900">{orchard.municipality ?? "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Año</p>
                          <p className="text-sm font-medium text-gray-900">{orchard.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Edad</p>
                          <p className="text-sm font-medium text-gray-900">{orchard.age ?? "—"} años</p>
                        </div>
                      </div>
                    </div>

                    {orchard.price != null && (
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                        <p className="text-xs text-teal-700">Precio por kg</p>
                        <p className="text-lg font-bold text-teal-800">
                          ${Number(orchard.price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
