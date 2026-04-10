"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppLayout } from "@/components/layouts/app-layout"
import { jimaStoryService, JimaStory } from "@/services/jimaStoryService"
import { farmerService } from "@/services/farmerService"
import { orchardService, Orchard } from "@/services/orchardService"
import { toast } from "sonner"
import { Plus, Trash2, Play, Clock, Video, Upload } from "lucide-react"
import Image from "next/image"

export default function AdminHistoriasJimaPage() {
  const [stories, setStories]             = useState<JimaStory[]>([])
  const [farmers, setFarmers]             = useState<any[]>([])
  const [allOrchards, setAllOrchards]     = useState<Orchard[]>([])
  const [loading, setLoading]             = useState(true)

  // Form
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("")
  const [selectedOrchardId, setSelectedOrchardId] = useState<string>("")
  const [videoFile, setVideoFile]         = useState<File | null>(null)
  const [videoPreview, setVideoPreview]   = useState<string | null>(null)
  const [isCreating, setIsCreating]       = useState(false)

  // Video dialog
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl]           = useState<string | null>(null)
  const [loadingVideo, setLoadingVideo]   = useState(false)
  const [deletingId, setDeletingId]       = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      jimaStoryService.getAll(),
      farmerService.getActive(),
      orchardService.getAll({ per_page: 1000 }),
    ]).then(([storiesData, farmersData, orchardsData]) => {
      setStories(storiesData)
      setFarmers(farmersData)
      // getAll devuelve el paginador de Laravel; el array real está en .data
      const list = Array.isArray(orchardsData) ? orchardsData : (orchardsData as any)?.data ?? []
      setAllOrchards(list)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const orchardsByFarmer = allOrchards.filter(
    (o) => o.farmer_id === Number(selectedFarmerId)
  )

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const handleCreate = async () => {
    if (!selectedOrchardId || !videoFile) return
    setIsCreating(true)
    try {
      const story = await jimaStoryService.create(Number(selectedOrchardId), videoFile)
      setStories(prev => [story, ...prev])
      setSelectedFarmerId("")
      setSelectedOrchardId("")
      setVideoFile(null)
      setVideoPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      toast.success("Historia creada correctamente. Expira en 7 días.")
    } catch {
      toast.error("No se pudo crear la historia.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await jimaStoryService.delete(id)
      setStories(prev => prev.filter(s => s.id !== id))
      toast.success("Historia eliminada.")
    } catch {
      toast.error("No se pudo eliminar la historia.")
    } finally {
      setDeletingId(null)
    }
  }

  const handlePlayVideo = async (story: JimaStory) => {
    setVideoUrl(null)
    setVideoDialogOpen(true)
    setLoadingVideo(true)
    try {
      const url = await jimaStoryService.getVideoUrl(story.id)
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

  if (loading) return <AppLayout type="admin"><p className="p-4">Cargando historias...</p></AppLayout>

  const active  = stories.filter(s => !s.is_expired)
  const expired = stories.filter(s => s.is_expired)

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historias de Jima</h1>
          <p className="text-gray-600">Crea y gestiona videos de jima. Cada historia expira a los 7 días.</p>
        </div>

        {/* ── Formulario crear ── */}
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-5 space-y-4">
            <h2 className="font-semibold text-teal-900 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Historia
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Seleccionar agricultor */}
              <div className="space-y-2">
                <Label>Agricultor *</Label>
                <Select
                  value={selectedFarmerId}
                  onValueChange={(v) => { setSelectedFarmerId(v); setSelectedOrchardId("") }}
                >
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

              {/* Seleccionar huerta */}
              <div className="space-y-2">
                <Label>Huerta *</Label>
                <Select
                  value={selectedOrchardId}
                  onValueChange={setSelectedOrchardId}
                  disabled={!selectedFarmerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedFarmerId ? "Selecciona una huerta" : "Primero selecciona agricultor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {orchardsByFarmer.length === 0 ? (
                      <SelectItem value="none" disabled>Sin huertas registradas</SelectItem>
                    ) : (
                      orchardsByFarmer.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.name} — {o.agave_type?.name ?? "—"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload video */}
            <div className="space-y-2">
              <Label>Video *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/mov,video/avi,video/webm"
                className="hidden"
                onChange={handleVideoSelect}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-300 rounded-lg p-4 text-center cursor-pointer hover:bg-teal-100 transition"
              >
                {videoPreview ? (
                  <div className="space-y-2">
                    <video
                      src={videoPreview}
                      className="mx-auto max-h-48 rounded-lg"
                      controls
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-xs text-teal-700">{videoFile?.name}</p>
                    <p className="text-xs text-gray-500">Clic para cambiar</p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <Upload className="w-8 h-8 text-teal-400 mx-auto" />
                    <p className="text-sm text-teal-700 font-medium">Clic para seleccionar video</p>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI, WEBM — máx. 100 MB</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={!selectedOrchardId || !videoFile || isCreating}
              onClick={handleCreate}
            >
              {isCreating ? "Subiendo video..." : (
                <><Plus className="w-4 h-4 mr-2" />Crear Historia (expira en 7 días)</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ── Historias activas ── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Activas
            <Badge className="ml-2 bg-green-100 text-green-800">{active.length}</Badge>
          </h2>
          {active.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay historias activas.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {active.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  daysRemaining={getDaysRemaining(story.expires_at)}
                  formatDate={formatDate}
                  onPlay={() => handlePlayVideo(story)}
                  onDelete={() => handleDelete(story.id)}
                  isDeleting={deletingId === story.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Historias expiradas ── */}
        {expired.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Expiradas
              <Badge className="ml-2 bg-gray-200 text-gray-600">{expired.length}</Badge>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {expired.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  daysRemaining={0}
                  formatDate={formatDate}
                  onPlay={() => handlePlayVideo(story)}
                  onDelete={() => handleDelete(story.id)}
                  isDeleting={deletingId === story.id}
                  expired
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Dialog reproducir video ── */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video de Jima</DialogTitle>
          </DialogHeader>
          {loadingVideo ? (
            <p className="text-center text-gray-500 py-8">Cargando video...</p>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              className="w-full rounded-lg"
              controls
              autoPlay
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

function StoryCard({
  story,
  daysRemaining,
  formatDate,
  onPlay,
  onDelete,
  isDeleting,
  expired = false,
}: {
  story: JimaStory
  daysRemaining: number
  formatDate: (d: string) => string
  onPlay: () => void
  onDelete: () => void
  isDeleting: boolean
  expired?: boolean
}) {
  return (
    <Card className={`overflow-hidden ${expired ? "opacity-60" : ""}`}>
      {/* Thumbnail / placeholder */}
      <div
        className="relative w-full h-40 bg-gray-900 flex items-center justify-center cursor-pointer group"
        onClick={onPlay}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </div>
        <Video className="w-10 h-10 text-gray-600 absolute opacity-20" />
        {expired && (
          <Badge className="absolute top-2 right-2 bg-gray-700 text-white">Expirada</Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-gray-900">{story.orchard?.name ?? `Huerta #${story.orchard_id}`}</p>
          <p className="text-xs text-gray-500">{story.orchard?.agave_type?.name ?? "—"} · {story.orchard?.state}</p>
        </div>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Agricultor:</span> {story.farmer?.full_name ?? "—"}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {expired ? (
            <span className="text-gray-500">Expiró el {formatDate(story.expires_at)}</span>
          ) : (
            <span className={`font-medium ${daysRemaining <= 1 ? "text-red-600" : daysRemaining <= 3 ? "text-orange-500" : "text-teal-700"}`}>
              {daysRemaining} día{daysRemaining !== 1 ? "s" : ""} restante{daysRemaining !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400">Creada el {formatDate(story.created_at)}</p>

        <div className="flex gap-2 pt-1">
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700" size="sm" onClick={onPlay}>
            <Play className="w-3 h-3 mr-1" />
            Ver video
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
