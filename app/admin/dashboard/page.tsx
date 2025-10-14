'use client'

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Play, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import HuertaVideoCard from "@/components/huertas/HuertaVideoCard"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useAuth } from "@/hooks/useAuth"

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

export default function AdminDashboard() {
  // 🚀 Protección de ruta
  const { isLoading } = useRequireAuth()
  const { user } = useAuth()

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [newStory, setNewStory] = useState({
    title: "",
    farmer: "",
    location: "",
    video: null as File | null,
  })

  const handleUploadStory = async () => {
    if (!newStory.title || !newStory.farmer || !newStory.location || !newStory.video) {
      alert("Por favor completa todos los campos")
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Historia subida exitosamente")
    setIsUploadDialogOpen(false)
    setNewStory({ title: "", farmer: "", location: "", video: null })
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

  // ⏳ Muestra un loader mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    )
  }

  return (
    <AppLayout type="admin">
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
              <Play className="h-5 w-5 text-green-600" />
              Historias de Jimas
            </h1>
            <p className="text-sm text-gray-600">
              Bienvenido {user?.name ?? "Administrador"}, aquí puedes gestionar tus videos.
            </p>
          </div>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Subir Historia
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Subir Nueva Historia</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo video del proceso de jima.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newStory.title}
                    onChange={(e) =>
                      setNewStory({ ...newStory, title: e.target.value })
                    }
                    placeholder="Ej: Jima en Los Altos"
                  />
                </div>
                <div>
                  <Label htmlFor="farmer">Agricultor</Label>
                  <Input
                    id="farmer"
                    value={newStory.farmer}
                    onChange={(e) =>
                      setNewStory({ ...newStory, farmer: e.target.value })
                    }
                    placeholder="Nombre del agricultor"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={newStory.location}
                    onChange={(e) =>
                      setNewStory({ ...newStory, location: e.target.value })
                    }
                    placeholder="Ej: Arandas, Jalisco"
                  />
                </div>
                <div>
                  <Label htmlFor="video">Video</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setNewStory({
                        ...newStory,
                        video: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUploadStory}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Subir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
      </div>
    </AppLayout>
  )
}
