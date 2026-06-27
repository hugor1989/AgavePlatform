"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video360Player } from "@/components/ui/Video360Player"
import { videoService, OrchardVideo } from "@/services/videoService"
import { Play, X, ArrowLeft, Video } from "lucide-react"

interface OrchardVideosModalProps {
  orchardId: number | null
  orchardName: string
  isOpen: boolean
  onClose: () => void
}

export function OrchardVideosModal({ orchardId, orchardName, isOpen, onClose }: OrchardVideosModalProps) {
  const [videos, setVideos] = useState<OrchardVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<OrchardVideo | null>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !orchardId) return
    setSelected(null)
    setLoading(true)
    videoService.getAll({ orchard_id: orchardId })
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }, [isOpen, orchardId])

  const handleSelect = (video: OrchardVideo) => {
    setSelected(video)
    // Fullscreen after render
    setTimeout(() => {
      fullscreenRef.current?.requestFullscreen?.().catch(() => {})
    }, 100)
  }

  const handleBack = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    setSelected(null)
  }

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    setSelected(null)
    onClose()
  }

  // Salir de pantalla completa cuando se presiona ESC desde el fullscreen nativo
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && selected) setSelected(null)
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [selected])

  return (
    <>
      {/* ── Fullscreen player ──────────────────────────────── */}
      {selected && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-[200] bg-black flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-black/80 text-white shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 gap-1"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <span className="text-sm font-medium truncate">{orchardName}</span>
            <div className="flex gap-2 ml-auto">
              <Badge variant="secondary" className="text-xs">
                Cabecera {selected.heading_number}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Línea {selected.line_number}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Player */}
          <div className="flex-1 min-h-0">
            <Video360Player
              src={videoService.streamUrl(selected.id)}
              autoPlay
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* ── Video list dialog ──────────────────────────────── */}
      <Dialog open={isOpen && !selected} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-teal-600" />
              Videos 360° — {orchardName}
            </DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <span className="text-sm">Cargando videos...</span>
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
              <Video className="h-12 w-12 opacity-30" />
              <p className="text-sm">No hay videos 360° disponibles para esta huerta.</p>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleSelect(video)}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  {/* Play icon */}
                  <div className="shrink-0 h-12 w-12 rounded-lg bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                    <Play className="h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-1.5">
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        Cabecera {video.heading_number}
                      </Badge>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        Línea {video.line_number}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
