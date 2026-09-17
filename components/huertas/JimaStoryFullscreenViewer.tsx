"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"

export interface JimaStoryViewerItem {
  id: number
  orchardName: string
  farmerName: string
  daysRemaining: number
}

interface JimaStoryFullscreenViewerProps {
  open: boolean
  stories: JimaStoryViewerItem[]
  startIndex: number
  getVideoUrl: (id: number) => Promise<string>
  onClose: () => void
}

// Visor de historias estilo Instagram/TikTok: pantalla completa, una historia
// a la vez, con barras de progreso arriba, avance automático al terminar el
// video y toques a los lados para navegar. Reutiliza la misma técnica de
// fullscreen nativo + bloqueo de scroll a prueba de iOS que el visor 360°.
export function JimaStoryFullscreenViewer({
  open,
  stories,
  startIndex,
  getVideoUrl,
  onClose,
}: JimaStoryFullscreenViewerProps) {
  const [index, setIndex] = useState(startIndex)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cacheRef = useRef<Record<number, string>>({})
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (open) setIndex(startIndex)
  }, [open, startIndex])

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    onClose()
  }

  const goNext = () => {
    setIndex((i) => {
      if (i >= stories.length - 1) {
        handleClose()
        return i
      }
      return i + 1
    })
  }

  const goPrev = () => {
    setIndex((i) => (i > 0 ? i - 1 : i))
  }

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      containerRef.current?.requestFullscreen?.().catch(() => {})
    }, 100)
    return () => clearTimeout(timer)
  }, [open])

  // overflow:hidden en el body no basta en iOS Safari (el "rubber-banding"
  // sigue moviendo el fondo con gestos táctiles) — hay que fijar el body con
  // position:fixed y restaurar el scroll exacto al cerrar.
  useEffect(() => {
    if (!open) return
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
  }, [open])

  // Carga el video de la historia activa (reutiliza cache local si ya se pidió)
  useEffect(() => {
    if (!open) return
    const story = stories[index]
    if (!story) return

    const requestId = ++requestIdRef.current
    setProgress(0)
    setVideoUrl(null)

    const cached = cacheRef.current[story.id]
    if (cached) {
      setVideoUrl(cached)
      return
    }

    setLoading(true)
    getVideoUrl(story.id)
      .then((url) => {
        cacheRef.current[story.id] = url
        if (requestIdRef.current === requestId) setVideoUrl(url)
      })
      .catch(() => {
        if (requestIdRef.current === requestId) goNext()
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index])

  // Precarga la siguiente historia para que el avance sea instantáneo
  useEffect(() => {
    if (!open) return
    const next = stories[index + 1]
    if (next && !cacheRef.current[next.id]) {
      getVideoUrl(next.id)
        .then((url) => { cacheRef.current[next.id] = url })
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index])

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress(v.currentTime / v.duration)
  }

  if (!open) return null

  const story = stories[index]

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-black flex flex-col select-none">
      {/* Barras de progreso */}
      <div className="flex gap-1 px-3 pt-3 shrink-0">
        {stories.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${i < index ? 100 : i === index ? progress * 100 : 0}%` }}
            />
          </div>
        ))}
      </div>

      {/* Encabezado */}
      <div className="flex items-center justify-between px-4 py-3 text-white shrink-0">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{story?.orchardName}</p>
          <p className="text-xs text-white/70 truncate">
            {story?.farmerName}
            {story && ` · ${story.daysRemaining} día${story.daysRemaining !== 1 ? "s" : ""} restante${story.daysRemaining !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 rounded-full hover:bg-white/20 transition shrink-0"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Video + zonas de toque */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        {loading || !videoUrl ? (
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        ) : (
          <video
            key={story?.id}
            ref={videoRef}
            src={videoUrl}
            className="max-h-full max-w-full"
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={goNext}
          />
        )}

        <button
          aria-label="Historia anterior"
          onClick={goPrev}
          className="absolute left-0 top-0 h-full w-1/3 cursor-pointer"
        />
        <button
          aria-label="Siguiente historia"
          onClick={goNext}
          className="absolute right-0 top-0 h-full w-1/3 cursor-pointer"
        />
      </div>
    </div>
  )
}
