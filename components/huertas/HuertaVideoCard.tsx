"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import {
  Play,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Edit,
  Share2,
  Video,
} from "lucide-react"

interface Huerta {
  id: string | number
  name: string
  videoUrl?: string
  videos: number
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

interface HuertaVideoCardProps {
  huerta: Huerta
  getStatusColor: (status: string) => string
}

export default function HuertaVideoCard({
  huerta,
  getStatusColor,
}: HuertaVideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
       <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                  <Play className="h-12 w-12 sm:h-16 sm:w-16 text-white bg-black bg-opacity-50 rounded-full p-3 sm:p-4 hover:bg-opacity-70 transition-all cursor-pointer" />

                  {/* Duración del video */}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    5
                  </div>
                </div>
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

       
      </CardContent>
    </Card>
  )
}
