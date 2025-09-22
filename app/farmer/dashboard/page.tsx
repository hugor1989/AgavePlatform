"use client"

import { Card } from "@/components/ui/card"
import { Play, MapPin } from "lucide-react"

export default function FarmerDashboard() {
  // Mock data for Historias de Jima
  const jimaStories = [
    {
      id: 1,
      title: "Jima en Los Altos de Jalisco",
      description:
        "Proceso de jima tradicional en huerta premium. Los jimadores expertos seleccionan cuidadosamente cada piña de agave, asegurando la máxima calidad para la producción de tequila. Este proceso ancestral se ha transmitido de generación en generación.",
      location: "Jalisco, México",
      date: "2024-01-14",
      videoUrl: "/agave-field-plantation.png",
      duration: "5:30",
      author: "Administrador",
    },
    {
      id: 2,
      title: "Técnicas Ancestrales de Cosecha",
      description:
        "Métodos tradicionales transmitidos por generaciones. La sabiduría de nuestros antepasados se combina con técnicas modernas para obtener los mejores resultados en cada cosecha. Cada jimador es un artista que conoce su oficio a la perfección.",
      location: "Nayarit, México",
      date: "2024-01-10",
      videoUrl: "/agave-field-plantation.png",
      duration: "7:15",
      author: "Administrador",
    },
    {
      id: 3,
      title: "La Jima del Agave Azul",
      description:
        "Proceso completo desde la selección hasta la cosecha. Observa cómo los expertos evalúan cada planta, determinan el momento perfecto para la jima y ejecutan el corte con precisión milimétrica para preservar la calidad del agave.",
      location: "Michoacán, México",
      date: "2024-01-08",
      videoUrl: "/agave-field-plantation.png",
      duration: "6:45",
      author: "Administrador",
    },
    {
      id: 4,
      title: "Herramientas Tradicionales de Jima",
      description:
        "Conoce las herramientas especializadas que utilizan los jimadores. La coa de jima, instrumento fundamental en este proceso, ha evolucionado a lo largo de los años pero mantiene su esencia tradicional para garantizar cortes precisos.",
      location: "Guanajuato, México",
      date: "2024-01-05",
      videoUrl: "/agave-field-plantation.png",
      duration: "4:20",
      author: "Administrador",
    },
  ]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `hace ${diffInHours} horas`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `hace ${diffInDays} días`
    }
  }

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Feed de Historias de Jima */}
        {jimaStories.map((story) => (
          <Card key={story.id} className="overflow-hidden bg-white shadow-sm border border-gray-200">
            {/* Header del post */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 font-semibold text-sm">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{story.author}</h3>
                    <span className="text-gray-500 text-xs sm:text-sm">•</span>
                    <span className="text-gray-500 text-xs sm:text-sm">{formatTimeAgo(story.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 text-xs sm:text-sm break-words">{story.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del post */}
            <div className="px-4 sm:px-6 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words leading-tight">
                {story.title}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base break-words leading-relaxed">{story.description}</p>
            </div>

            {/* Video */}
            <div className="relative">
              <div className="aspect-video bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${story.videoUrl})` }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <Play className="relative h-12 w-12 sm:h-16 sm:w-16 text-white bg-black bg-opacity-50 rounded-full p-3 sm:p-4 hover:bg-opacity-70 transition-all cursor-pointer z-10" />

                {/* Duración del video */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded z-10">
                  {story.duration}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Indicador de fin del feed */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Has visto todas las historias recientes</p>
        </div>
      </div>
    </div>
  )
}
