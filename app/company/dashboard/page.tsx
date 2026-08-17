"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import HuertaVideoCard from "@/components/huertas/HuertaVideoCard"
import { AppLayout } from "@/components/layouts/app-layout"
import { jimaStoryService, JimaStory } from "@/services/jimaStoryService"
import { toast } from "sonner"

export default function CompanyDashboard() {
  const [stories, setStories] = useState<JimaStory[]>([])
  const [loading, setLoading] = useState(true)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({})
  const blobUrlCache = useRef<Record<number, string>>({})

  useEffect(() => {
    jimaStoryService.getAll()
      .then(setStories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

  const handlePlay = async (story: JimaStory) => {
    setVideoUrl(null)
    setVideoDialogOpen(true)
    setLoadingVideo(true)
    // Reutiliza el blob URL ya cacheado por el thumbnail
    const cached = blobUrlCache.current[story.id]
    if (cached) {
      setVideoUrl(cached)
      setLoadingVideo(false)
      return
    }
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

  const getDaysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })

  const active = stories.filter(s => !s.is_expired)

  return (
    <AppLayout type="company">
      <div className="min-w-0 overflow-x-hidden">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historias de Jima</h1>
            <p className="text-gray-500 text-sm">Videos recientes de jimas activas</p>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Cargando historias...</p>
          ) : active.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay historias activas por el momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {active.map((story) => (
                  <HuertaVideoCard
                    key={story.id}
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
                      expired: story.is_expired,
                      companyName: story.company?.business_name ?? null,
                      plantQuantity: story.plant_quantity ?? null,
                    }}
                    onPlay={() => handlePlay(story)}
                  />
                ))}
            </div>
          )}

          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Has visto todas las historias recientes</p>
          </div>
        </div>
      </div>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video de Jima</DialogTitle>
          </DialogHeader>
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
