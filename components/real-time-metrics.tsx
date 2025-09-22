"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, Users, Eye } from "lucide-react"

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    activeUsers: 24,
    newOffers: 3,
    pendingApprovals: 7,
    systemLoad: 85,
  })

  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        newOffers: prev.newOffers + (Math.random() > 0.8 ? 1 : 0),
        pendingApprovals: Math.max(0, prev.pendingApprovals + Math.floor(Math.random() * 2) - 1),
        systemLoad: Math.max(60, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10) - 5)),
      }))
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          Métricas en Tiempo Real
          <Badge variant="outline" className="ml-auto">
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-xl font-bold">{metrics.activeUsers}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nuevas Ofertas</p>
              <p className="text-xl font-bold">{metrics.newOffers}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Eye className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-xl font-bold">{metrics.pendingApprovals}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Carga del Sistema</p>
              <p className="text-xl font-bold">{metrics.systemLoad}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
