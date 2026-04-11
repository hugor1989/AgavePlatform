"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, MapPin, User, Clock, Video } from "lucide-react"
import Image from "next/image"

interface StoryCardData {
  id: string | number
  orchardName: string
  farmerName: string
  agaveType: string
  state: string
  municipality: string
  daysRemaining: number
  createdAt: string
  expired: boolean
}

interface HuertaVideoCardProps {
  huerta: StoryCardData
  thumbnailUrl?: string
  onPlay?: () => void
}

export default function HuertaVideoCard({ huerta, thumbnailUrl, onPlay }: HuertaVideoCardProps) {
  const daysColor =
    huerta.expired        ? "bg-gray-100 text-gray-600 border-gray-200"
    : huerta.daysRemaining <= 1 ? "bg-red-100 text-red-700 border-red-200"
    : huerta.daysRemaining <= 3 ? "bg-orange-100 text-orange-700 border-orange-200"
    : "bg-green-100 text-green-700 border-green-200"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail / preview */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-10 h-10 text-gray-600 opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center" onClick={onPlay}>
          <Play className="h-12 w-12 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all cursor-pointer" />
        </div>
        <Badge className={`absolute top-2 right-2 text-xs border ${daysColor}`}>
          {huerta.expired ? "Expirada" : `${huerta.daysRemaining}d`}
        </Badge>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Nombre huerta */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{huerta.orchardName}</h3>
          <p className="text-xs text-gray-400">Historia #{huerta.id}</p>
        </div>

        {/* Tipo agave */}
        <div className="flex items-center gap-1.5">
          <Image src="/agave-icon.svg" alt="Agave" width={14} height={14} className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs text-gray-700 font-medium">{huerta.agaveType}</span>
        </div>

        {/* Agricultor */}
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{huerta.farmerName}</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{huerta.state}, {huerta.municipality}</span>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
          <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">{huerta.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
