"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video360Player } from "@/components/ui/Video360Player"
import { videoService, OrchardVideo } from "@/services/videoService"
import { X, Video, Check, Loader2 } from "lucide-react"

interface OrchardVideosModalProps {
  orchardId: number | null
  orchardName: string
  isOpen: boolean
  onClose: () => void
}

const WATCHED_STORAGE_KEY = "agave_watched_orchard_videos"

function getWatchedIds(): Set<number> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = window.localStorage.getItem(WATCHED_STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as number[]) : [])
  } catch {
    return new Set()
  }
}

function sortByHeadingAndLine(videos: OrchardVideo[]) {
  return [...videos].sort((a, b) =>
    a.heading_number - b.heading_number || a.line_number - b.line_number
  )
}

export function OrchardVideosModal({ orchardId, orchardName, isOpen, onClose }: OrchardVideosModalProps) {
  const [videos, setVideos] = useState<OrchardVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<OrchardVideo | null>(null)
  const [watchedIds, setWatchedIds] = useState<Set<number>>(new Set())
  const fullscreenRef = useRef<HTMLDivElement | null>(null)
  // Estado (no solo ref) para que el Select re-renderice con el contenedor real:
  // el dropdown se porta a este nodo en vez de document.body, porque cuando el
  // reproductor está en pantalla completa nativa el navegador solo pinta el
  // subárbol del elemento fullscreen — un portal a document.body quedaría oculto.
  const [fullscreenNode, setFullscreenNode] = useState<HTMLDivElement | null>(null)
  const setFullscreenRef = (node: HTMLDivElement | null) => {
    fullscreenRef.current = node
    setFullscreenNode(node)
  }

  useEffect(() => {
    if (!isOpen || !orchardId) return
    setSelected(null)
    setWatchedIds(getWatchedIds())
    setLoading(true)
    videoService.getAll({ orchard_id: orchardId })
      .then((data) => {
        // Ocultar videos que aún se están comprimiendo/procesando en el
        // servidor o que fallaron — solo mostrar los reproducibles.
        const ready = data.filter((v) => v.status === 'ready')
        const sorted = sortByHeadingAndLine(ready)
        setVideos(sorted)
        // Abrir directamente el primer video en orden (cabecera, luego línea)
        if (sorted.length > 0) handleSelect(sorted[0])
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orchardId])

  const handleSelect = (video: OrchardVideo) => {
    setSelected(video)
    setWatchedIds((prev) => {
      if (prev.has(video.id)) return prev
      const next = new Set(prev).add(video.id)
      try {
        window.localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(Array.from(next)))
      } catch {
        // localStorage no disponible (modo privado, etc.) — se ignora
      }
      return next
    })
    // Fullscreen after render
    setTimeout(() => {
      fullscreenRef.current?.requestFullscreen?.().catch(() => {})
    }, 100)
  }

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    setSelected(null)
    onClose()
  }

  // Cerrar todo cuando se sale de pantalla completa (ESC, gesto del navegador, etc.)
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && selected) handleClose()
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  if (!isOpen || !orchardId) return null

  return (
    <div ref={setFullscreenRef} className="fixed inset-0 z-[200] bg-black flex flex-col">
      {selected ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-black/80 text-white shrink-0">
            <span className="text-sm font-medium truncate">{orchardName}</span>

            {/* Selector de video: navega a cualquier video de la huerta */}
            <Select
              value={String(selected.id)}
              onValueChange={(value) => {
                const video = videos.find((v) => v.id === Number(value))
                if (video) handleSelect(video)
              }}
            >
              <SelectTrigger className="ml-auto w-52 h-8 bg-white/10 border-white/20 text-white text-xs focus:ring-white/40 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent container={fullscreenNode}>
                {videos.map((video) => {
                  const watched = watchedIds.has(video.id)
                  return (
                    <SelectItem
                      key={video.id}
                      value={String(video.id)}
                      className={watched ? "text-purple-600 font-medium" : ""}
                    >
                      <span className="flex items-center gap-1.5">
                        Cabecera {video.heading_number} · Línea {video.line_number}
                        {watched && <Check className="h-3 w-3 text-purple-600" />}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

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
              hlsSrc={selected.hls_path ? videoService.hlsUrl(selected.id) : null}
              autoPlay
              className="h-full"
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 text-white hover:bg-white/20 h-8 w-8 p-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Cargando videos...</p>
            </>
          ) : (
            <>
              <Video className="h-12 w-12 opacity-30" />
              <p className="text-sm">No hay videos 360° disponibles para esta huerta.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
