"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Play, MapPin, Calendar, Clock, Camera, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function FarmerDashboard() {
  // Mock data for Historias de Jima
  

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Feed de Historias de Jima */}
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
              <div>
                <h3 className="font-semibold text-lg text-gray-900">HUERTA LOS MOLINOS</h3>
                <p className="text-sm text-gray-500">#123455</p>
              </div>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-900">TEQUILA</span>
              </div>

              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                <span className="text-2xl font-bold text-blue-600">400</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-sm font-medium text-gray-900">JALISCO</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-500">Municipio</p>
                    <p className="text-sm font-medium text-gray-900">AMATITAN</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Año</p>
                    <p className="text-sm font-medium text-gray-900">2009</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="text-sm font-medium text-gray-900">2 años</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Ubicación</p>
                    <p className="text-sm font-mono text-green-800">20.8818, -103.8370</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                    <Share2 className="w-4 h-4 text-green-700" />
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
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
              <div>
                <h3 className="font-semibold text-lg text-gray-900">HUERTA LOS MOLINOS</h3>
                <p className="text-sm text-gray-500">#123455</p>
              </div>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Image src="/agave-icon.svg" alt="Agave" width={16} height={16} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-900">TEQUILA</span>
              </div>

              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-1">Cantidad de Plantas</p>
                <span className="text-2xl font-bold text-blue-600">400</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="text-sm font-medium text-gray-900">JALISCO</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-500">Municipio</p>
                    <p className="text-sm font-medium text-gray-900">AMATITAN</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Año</p>
                    <p className="text-sm font-medium text-gray-900">2009</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="text-sm font-medium text-gray-900">2 años</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Ubicación</p>
                    <p className="text-sm font-mono text-green-800">20.8818, -103.8370</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                    <Share2 className="w-4 h-4 text-green-700" />
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>

        {/* Indicador de fin del feed */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Has visto todas las historias recientes</p>
        </div>
      </div>
    </div>
  )
}
