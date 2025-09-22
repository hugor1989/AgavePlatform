"use client"

import { Card } from "@/components/ui/card"
import { Play, MapPin } from "lucide-react"
import { CompanyLayout } from "@/components/company-layout"

export default function CompanyDashboard() {
  // Datos de ejemplo para historias de jima
  const jimaStories = [
    {
      id: 1,
      title: "Jima en Los Altos de Jalisco",
      description:
        "Proceso de jima tradicional en huerta premium. Los jimadores expertos seleccionan cuidadosamente cada piña de agave, asegurando la máxima calidad para la producción de tequila. Este proceso ancestral se ha transmitido de generación en generación.",
      videoUrl: "/placeholder.svg?height=400&width=600",
      date: "2024-01-15",
      location: "Jalisco, México",
      author: "Administrador",
      duration: "5:30",
    },
    {
      id: 2,
      title: "Cosecha de Temporada 2024",
      description:
        "Técnicas modernas de jima para máxima calidad. La combinación perfecta entre tradición e innovación permite obtener agaves de la más alta calidad. Nuestros jimadores utilizan herramientas especializadas para garantizar un corte preciso.",
      videoUrl: "/placeholder.svg?height=400&width=600",
      date: "2024-01-10",
      location: "Guanajuato, México",
      author: "Administrador",
      duration: "7:15",
    },
    {
      id: 3,
      title: "Jima Nocturna Especializada",
      description:
        "Proceso de jima en condiciones óptimas durante las primeras horas del día. La temperatura fresca de la madrugada permite mantener la calidad de las piñas y facilita el trabajo de los jimadores experimentados.",
      videoUrl: "/placeholder.svg?height=400&width=600",
      date: "2024-01-05",
      location: "Nayarit, México",
      author: "Administrador",
      duration: "6:45",
    },
    {
      id: 4,
      title: "Selección de Agaves Maduros",
      description:
        "El arte de identificar el momento perfecto para la cosecha. Los expertos evalúan cada planta considerando factores como la edad, el tamaño y las condiciones climáticas para determinar el momento óptimo de la jima.",
      videoUrl: "/placeholder.svg?height=400&width=600",
      date: "2024-01-02",
      location: "Michoacán, México",
      author: "Administrador",
      duration: "8:20",
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
    <CompanyLayout>
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
                <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                  <Play className="h-12 w-12 sm:h-16 sm:w-16 text-white bg-black bg-opacity-50 rounded-full p-3 sm:p-4 hover:bg-opacity-70 transition-all cursor-pointer" />

                  {/* Duración del video */}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
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
    </CompanyLayout>
  )
}
