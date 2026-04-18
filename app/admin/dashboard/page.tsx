'use client'

import { useEffect, useRef, useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Play, Upload, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useAuth } from "@/hooks/useAuth"
import { jimaStoryService, JimaStory } from "@/services/jimaStoryService"
import { farmerService } from "@/services/farmerService"
import { orchardService, Orchard } from "@/services/orchardService"
import { toast } from "sonner"
import HuertaVideoCard from "@/components/huertas/HuertaVideoCard"

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useRequireAuth()
  const { user } = useAuth()

  const [stories, setStories]           = useState<JimaStory[]>([])
  const [farmers, setFarmers]           = useState<any[]>([])
  const [allOrchards, setAllOrchards]   = useState<Orchard[]>([])
  const [loadingData, setLoadingData]   = useState(true)

  // Dialog upload
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFarmerId, setSelectedFarmerId]     = useState("")
  const [selectedOrchardId, setSelectedOrchardId]   = useState("")
  const [videoFile, setVideoFile]                   = useState<File | null>(null)
  const [isUploading, setIsUploading]               = useState(false)
  const fileInputRef                                = useRef<HTMLInputElement>(null)

  // Video playback dialog
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl]               = useState<string | null>(null)
  const [loadingVideo, setLoadingVideo]       = useState(false)
  const [deletingId, setDeletingId]           = useState<number | null>(null)
  const [thumbnails, setThumbnails]           = useState<Record<number, string>>({})
  const blobUrlCache                          = useRef<Record<number, string>>({})

  useEffect(() => {
    Promise.all([
      jimaStoryService.getAll(),
      farmerService.getActive(),
      orchardService.getAll({ per_page: 1000 }),
    ]).then(([storiesData, farmersData, orchardsData]) => {
      setStories(storiesData)
      setFarmers(farmersData)
      const list = Array.isArray(orchardsData) ? orchardsData : (orchardsData as any)?.data ?? []
      setAllOrchards(list)
    }).catch(console.error)
      .finally(() => setLoadingData(false))
  }, [])

  const orchardsByFarmer = allOrchards.filter(o => o.farmer_id === Number(selectedFarmerId))

  // Genera el frame de preview de un video y lo guarda en thumbnails
  const generateThumbnail = async (story: JimaStory) => {
    if (thumbnails[story.id]) return
    try {
      const blobUrl = await jimaStoryService.getVideoUrl(story.id)
      blobUrlCache.current[story.id] = blobUrl

      await new Promise<void>((resolve) => {
        const video = document.createElement("video")
        video.muted = true
        video.preload = "metadata"
        video.src = blobUrl
        video.currentTime = 1

        const capture = () => {
          const canvas = document.createElement("canvas")
          canvas.width  = video.videoWidth  || 640
          canvas.height = video.videoHeight || 360
          canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height)
          setThumbnails(prev => ({ ...prev, [story.id]: canvas.toDataURL("image/jpeg", 0.8) }))
          resolve()
        }

        video.addEventListener("seeked", capture, { once: true })
        video.addEventListener("error",  () => resolve(), { once: true })
      })
    } catch { /* sin thumbnail */ }
  }

  // Genera thumbnails en secuencia cuando llegan las historias
  useEffect(() => {
    if (stories.length === 0) return
    const queue = [...stories]
    const next = async () => {
      const story = queue.shift()
      if (!story) return
      await generateThumbnail(story)
      next()
    }
    next()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories])

  const resetDialog = () => {
    setSelectedFarmerId("")
    setSelectedOrchardId("")
    setVideoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleUploadStory = async () => {
    if (!selectedOrchardId || !videoFile) return
    setIsUploading(true)
    try {
      const story = await jimaStoryService.create(Number(selectedOrchardId), videoFile)
      setStories(prev => [story, ...prev])
      toast.success("Historia subida. Expira en 7 días.")
      setIsUploadDialogOpen(false)
      resetDialog()
    } catch {
      toast.error("No se pudo subir la historia.")
    } finally {
      setIsUploading(false)
    }
  }

  const handlePlay = async (story: JimaStory) => {
    setVideoDialogOpen(true)
    // Reutiliza el blob URL ya cacheado por el thumbnail
    const cached = blobUrlCache.current[story.id]
    if (cached) {
      setVideoUrl(cached)
      setLoadingVideo(false)
      return
    }
    setVideoUrl(null)
    setLoadingVideo(true)
    try {
      const url = await jimaStoryService.getVideoUrl(story.id)
      blobUrlCache.current[story.id] = url
      setVideoUrl(url)
    } catch {
      toast.error("No se pudo cargar el video.")
      setVideoDialogOpen(false)
    } finally {
      setLoadingVideo(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await jimaStoryService.delete(id)
      setStories(prev => prev.filter(s => s.id !== id))
      toast.success("Historia eliminada.")
    } catch {
      toast.error("No se pudo eliminar.")
    } finally {
      setDeletingId(null)
    }
  }

  const getDaysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const activeStories  = stories.filter(s => !s.is_expired)
  const expiredStories = stories.filter(s => s.is_expired)

  return (
    <AppLayout type="admin">
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900">
              <Play className="h-5 w-5 text-green-600" />
              Historias de Jimas
            </h1>
            <p className="text-sm text-gray-600">
              Bienvenido {user?.name ?? "Administrador"}, aquí puedes gestionar tus videos.
            </p>
          </div>

          <Dialog open={isUploadDialogOpen} onOpenChange={(open) => { setIsUploadDialogOpen(open); if (!open) resetDialog() }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Subir Historia
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Subir Nueva Historia</DialogTitle>
                <DialogDescription>Agrega un nuevo video del proceso de jima. Expira en 7 días.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Selector agricultor */}
                <div className="space-y-2">
                  <Label>Agricultor *</Label>
                  <Select value={selectedFarmerId} onValueChange={(v) => { setSelectedFarmerId(v); setSelectedOrchardId("") }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un agricultor" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((f) => (
                        <SelectItem key={f.id} value={String(f.id)}>
                          {f.full_name} — {f.unique_identifier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector huerta */}
                <div className="space-y-2">
                  <Label>Huerta *</Label>
                  <Select value={selectedOrchardId} onValueChange={setSelectedOrchardId} disabled={!selectedFarmerId}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedFarmerId ? "Selecciona una huerta" : "Primero selecciona agricultor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {orchardsByFarmer.length === 0 ? (
                        <SelectItem value="none" disabled>Sin huertas registradas</SelectItem>
                      ) : orchardsByFarmer.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.name} — {o.agave_type?.name ?? "—"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Upload video */}
                <div className="space-y-2">
                  <Label>Video *</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/webm"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                  {videoFile && (
                    <p className="text-xs text-gray-500">{videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsUploadDialogOpen(false); resetDialog() }}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleUploadStory}
                  disabled={!selectedOrchardId || !videoFile || isUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUploading ? "Subiendo..." : "Subir"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de historias */}
        {loadingData ? (
          <p className="text-gray-500 text-sm">Cargando historias...</p>
        ) : stories.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay historias creadas aún.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeStories.map((story) => (
                <div key={story.id} className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(story.id) }}
                    disabled={deletingId === story.id}
                    className="absolute top-2 right-2 z-10 bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-full transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div onClick={() => handlePlay(story)} className="cursor-pointer">
                    <HuertaVideoCard
                      thumbnailUrl={thumbnails[story.id]}
                      huerta={{
                        id: story.id,
                        orchardName: story.orchard?.name ?? `Huerta #${story.orchard_id}`,
                        farmerName: story.farmer?.full_name ?? "—",
                        agaveType: story.orchard?.agave_type?.name ?? "—",
                        state: story.orchard?.state ?? "—",
                        municipality: story.orchard?.municipality ?? "—",
                        daysRemaining: getDaysRemaining(story.expires_at),
                        createdAt: formatDate(story.created_at),
                        expired: false,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {expiredStories.length > 0 && (
              <>
                <p className="text-sm font-medium text-gray-500">Expiradas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                  {expiredStories.map((story) => (
                    <div key={story.id} className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(story.id) }}
                        disabled={deletingId === story.id}
                        className="absolute top-2 right-2 z-10 bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-full transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <HuertaVideoCard
                        thumbnailUrl={thumbnails[story.id]}
                        huerta={{
                          id: story.id,
                          orchardName: story.orchard?.name ?? `Huerta #${story.orchard_id}`,
                          farmerName: story.farmer?.full_name ?? "—",
                          agaveType: story.orchard?.agave_type?.name ?? "—",
                          state: story.orchard?.state ?? "—",
                          municipality: story.orchard?.municipality ?? "—",
                          daysRemaining: 0,
                          createdAt: formatDate(story.created_at),
                          expired: true,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Dialog reproducir video */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Video de Jima</DialogTitle></DialogHeader>
          {loadingVideo ? (
            <p className="text-center text-gray-500 py-8">Cargando video...</p>
          ) : videoUrl ? (
            <video src={videoUrl} className="w-full rounded-lg" controls autoPlay />
          ) : null}
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
