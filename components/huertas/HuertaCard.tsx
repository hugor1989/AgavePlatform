// components/HuertaCard.tsx
"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Camera,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Edit,
  Share2,
  ImageIcon,
} from "lucide-react"

interface Huerta {
  id: string | number
  name: string
  photoId?: string
  photos: number
  featured?: boolean
  status: string
  type: string
  plants: number
  state: string
  municipality: string
  year: number
  age: string
  location: string
}

interface HuertaCardProps {
  huerta: Huerta
  onViewPhoto?: (photoId?: string) => void
  onEdit?: (huerta: Huerta) => void
  onViewDetails?: (huerta: Huerta) => void
  getStatusColor: (status: string) => string
}

export default function HuertaCard({
  huerta,
  onViewPhoto,
  onEdit,
  onViewDetails,
  getStatusColor,
}: HuertaCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={huerta.photoId || "/placeholder.svg"}
          alt={huerta.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
            <Camera className="w-3 h-3 mr-1" />
            {huerta.photos} fotos
          </Badge>
        </div>
        {huerta.featured && (
          <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">Destacada</Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{huerta.name}</h3>
            <p className="text-sm text-gray-500">#{huerta.id}</p>
          </div>
          <Badge className={getStatusColor(huerta.status)}>{huerta.status}</Badge>
        </div>

        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-900">{huerta.type}</span>
        </div>

        <div className="text-center py-2">
          <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
          <span className="text-2xl font-bold text-blue-600">{huerta.plants.toLocaleString()}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Estado</span>
            </div>
            <span className="text-sm font-medium text-gray-900 ml-6">{huerta.state}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-500">Municipio</span>
            </div>
            <span className="text-sm font-medium text-gray-900 ml-6">{huerta.municipality}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Año</p>
              <p className="text-sm font-medium text-gray-900">{huerta.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Edad</p>
              <p className="text-sm font-medium text-gray-900">{huerta.age}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Ubicación</p>
              <p className="text-sm font-mono text-green-800">{huerta.location}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
              <Share2 className="w-4 h-4 text-green-700" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onViewPhoto?.(huerta.photoId)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Ver Foto ID
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onViewDetails?.(huerta)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Huerta
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit?.(huerta)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
