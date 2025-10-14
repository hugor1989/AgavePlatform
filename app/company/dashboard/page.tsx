"use client"

import { Card, CardContent} from "@/components/ui/card"
import { Play, MapPin, Calendar, Clock, Camera, Share2 } from "lucide-react"
import { CompanyLayout } from "@/components/company-layout"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/layouts/app-layout"
import HuertaVideoCard from "@/components/huertas/HuertaVideoCard"


interface JimaStory {
  id: number | string
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

const jimaStories: JimaStory[] = [
  {
    id: 1,
    name: "Jima en Los Altos de Jalisco",
    videoUrl: "/videos/jima-los-altos.mp4",
    videos: 3,
    featured: true,
    status: "Activa",
    type: "Agave Azul",
    plants: 4200,
    state: "Jalisco",
    municipality: "Arandas",
    year: 2024,
    age: "3 años",
    location: "20.705°N, -102.346°W",
  },
  {
    id: 2,
    name: "Cosecha Premium en Tequila",
    videoUrl: "/videos/cosecha-premium.mp4",
    videos: 2,
    featured: false,
    status: "Activa",
    type: "Agave Tequilana",
    plants: 5200,
    state: "Jalisco",
    municipality: "Tequila",
    year: 2023,
    age: "4 años",
    location: "20.883°N, -103.833°W",
  }
]
export default function CompanyDashboard() {
  

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activa":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactiva":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <AppLayout type="company">
      <div className="min-w-0 overflow-x-hidden">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          {/* Feed de Historias de Jima */}
           {/* Feed vertical con HuertaVideoCard */}
                  <div className="flex justify-center">
                     <div className="w-full max-w-3xl flex flex-col gap-6">
                        {jimaStories.map((story) => (
                          <HuertaVideoCard
                            key={story.id}
                            huerta={story}
                            getStatusColor={getStatusColor}
                            
                          />
                        ))}
                     </div>
                  </div>

          {/* Indicador de fin del feed */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Has visto todas las historias recientes</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
