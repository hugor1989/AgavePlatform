"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"

interface JimaStoryVideoModalProps {
  open: boolean
  videoUrl: string | null
  loading: boolean
  onClose: () => void
}

// Popup a pantalla completa para reproducir el video de una historia de
// jima — igual que el visor 360° de huertas: cubre toda la pantalla,
// intenta el fullscreen nativo, bloquea el scroll de fondo (con la técnica
// a prueba de iOS) y solo se cierra con la X, nunca al salir del fullscreen
// nativo por gesto/ESC (eso rompía la reproducción en tablets/móviles).
export function JimaStoryVideoModal({ open, videoUrl, loading, onClose }: JimaStoryVideoModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    onClose()
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

  if (!open) return null

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 text-white shrink-0">
        <span className="text-sm font-medium">Video de Jima</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        ) : videoUrl ? (
          <video
            src={videoUrl}
            className="max-h-full max-w-full"
            controls
            autoPlay
            playsInline
          />
        ) : null}
      </div>
    </div>
  )
}
