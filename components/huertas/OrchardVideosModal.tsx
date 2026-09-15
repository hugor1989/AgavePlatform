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

// Videos de solo cabecera (line_number null) se ordenan antes que sus líneas.
function sortByHeadingAndLine(videos: OrchardVideo[]) {
  return [...videos].sort((a, b) =>
    a.heading_number - b.heading_number ||
    (a.line_number ?? -1) - (b.line_number ?? -1) ||
    (a.line_letter ?? "").localeCompare(b.line_letter ?? "")
  )
}

// "15" o "15A" — vacío si el video es de solo cabecera (sin línea).
function lineLabel(video: OrchardVideo): string | undefined {
  if (video.line_number == null) return undefined
  return `${video.line_number}${video.line_letter ?? ""}`
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

  // Bloquear el scroll de la página de fondo mientras el popup está abierto.
  // overflow:hidden en el body no basta en iOS Safari (el "rubber-banding"
  // sigue moviendo el fondo con gestos táctiles) — hay que fijar el body con
  // position:fixed y restaurar el scroll exacto al cerrar.
  useEffect(() => {
    if (!isOpen) return
    const scrollY = window.scrollY
    const { style } = document.body
    const original = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
    }
    style.position = "fixed"
    style.top = `-${scrollY}px`
    style.left = "0"
    style.right = "0"
    style.width = "100%"
    style.overflow = "hidden"

    return () => {
      style.position = original.position
      style.top = original.top
      style.left = original.left
      style.right = original.right
      style.width = original.width
      style.overflow = original.overflow
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  if (!isOpen || !orchardId) return null

  // Listas independientes para los dos selectores: uno solo ve videos de
  // cabecera (sin línea), el otro solo videos de línea.
  const cabeceraVideos = videos.filter((v) => v.line_number == null)
  const lineVideos = videos.filter((v) => v.line_number != null)

  return (
    <div ref={setFullscreenRef} className="fixed inset-0 z-[200] bg-black flex flex-col">
      {selected ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-black/80 text-white shrink-0">
            <span className="text-sm font-medium truncate">{orchardName}</span>

            {/* Dos selectores independientes: elegir una cabecera navega al
                video de esa cabecera, elegir una línea navega al video de esa
                línea — no dependen entre sí. */}
            <div className="ml-auto flex items-center gap-2">
              <Select
                value={selected.line_number == null ? String(selected.id) : ""}
                onValueChange={(value) => {
                  const video = cabeceraVideos.find((v) => v.id === Number(value))
                  if (video) handleSelect(video)
                }}
              >
                <SelectTrigger className="w-32 h-8 bg-white/10 border-white/20 text-white text-xs focus:ring-white/40 focus:ring-offset-0">
                  <SelectValue placeholder={`Cabecera ${selected.heading_number}`} />
                </SelectTrigger>
                <SelectContent container={fullscreenNode}>
                  {cabeceraVideos.map((video) => {
                    const watched = watchedIds.has(video.id)
                    return (
                      <SelectItem
                        key={video.id}
                        value={String(video.id)}
                        className={watched ? "text-purple-600 font-medium" : ""}
                      >
                        <span className="flex items-center gap-1.5">
                          Cabecera {video.heading_number}
                          {watched && <Check className="h-3 w-3 text-purple-600" />}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <Select
                value={selected.line_number != null ? String(selected.id) : ""}
                onValueChange={(value) => {
                  const video = lineVideos.find((v) => v.id === Number(value))
                  if (video) handleSelect(video)
                }}
              >
                <SelectTrigger className="w-36 h-8 bg-white/10 border-white/20 text-white text-xs focus:ring-white/40 focus:ring-offset-0">
                  <SelectValue placeholder="Línea" />
                </SelectTrigger>
                <SelectContent container={fullscreenNode}>
                  {lineVideos.map((video) => {
                    const watched = watchedIds.has(video.id)
                    return (
                      <SelectItem
                        key={video.id}
                        value={String(video.id)}
                        className={watched ? "text-purple-600 font-medium" : ""}
                      >
                        <span className="flex items-center gap-1.5">
                          Línea {lineLabel(video)}
                          {watched && <Check className="h-3 w-3 text-purple-600" />}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
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
              hlsSrc={selected.hls_path ? videoService.hlsUrl(selected.id) : null}
              autoPlay
              className="h-full"
              headingNumber={selected.heading_number}
              lineNumber={lineLabel(selected)}
              hasPrev={videos.findIndex((v) => v.id === selected.id) > 0}
              hasNext={videos.findIndex((v) => v.id === selected.id) < videos.length - 1}
              onNavigate={(direction) => {
                const currentIndex = videos.findIndex((v) => v.id === selected.id)
                const target = videos[currentIndex + (direction === "next" ? 1 : -1)]
                if (target) handleSelect(target)
              }}
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
