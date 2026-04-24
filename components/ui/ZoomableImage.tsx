"use client"

import { useRef, useState, useEffect, useCallback } from "react"

interface ZoomableImageProps {
  src: string
  alt: string
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isGesturing, setIsGesturing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const g = useRef({
    scale: 1,
    translate: { x: 0, y: 0 },
    pinchDist: null as number | null,
    panAnchor: null as { x: number; y: number } | null,
  })

  function getDist(t: TouchList): number {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
  }

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      g.current.pinchDist = getDist(e.touches)
      g.current.panAnchor = null
      setIsGesturing(true)
    } else if (e.touches.length === 1 && g.current.scale > 1) {
      g.current.panAnchor = {
        x: e.touches[0].clientX - g.current.translate.x,
        y: e.touches[0].clientY - g.current.translate.y,
      }
    }
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && g.current.pinchDist !== null) {
      e.preventDefault()
      const newDist = getDist(e.touches)
      const newScale = Math.min(Math.max(g.current.scale * (newDist / g.current.pinchDist), 1), 5)
      g.current.pinchDist = newDist
      g.current.scale = newScale
      setScale(newScale)
    } else if (e.touches.length === 1 && g.current.panAnchor && g.current.scale > 1) {
      e.preventDefault()
      const tx = e.touches[0].clientX - g.current.panAnchor.x
      const ty = e.touches[0].clientY - g.current.panAnchor.y
      g.current.translate = { x: tx, y: ty }
      setTranslate({ x: tx, y: ty })
    }
  }, [])

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) g.current.pinchDist = null
    if (e.touches.length === 0) {
      g.current.panAnchor = null
      setIsGesturing(false)
      if (g.current.scale <= 1.05) {
        g.current.scale = 1
        g.current.translate = { x: 0, y: 0 }
        setScale(1)
        setTranslate({ x: 0, y: 0 })
      }
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("touchstart", onTouchStart, { passive: false })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd)
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])

  const handleClick = () => {
    if (g.current.scale > 1) {
      g.current.scale = 1
      g.current.translate = { x: 0, y: 0 }
      setScale(1)
      setTranslate({ x: 0, y: 0 })
    } else {
      g.current.scale = 2
      setScale(2)
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-hidden max-h-[70vh] w-full"
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[70vh] object-contain rounded-lg"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isGesturing ? "none" : "transform 0.2s ease",
          cursor: scale > 1 ? "zoom-out" : "zoom-in",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        } as React.CSSProperties}
        onClick={handleClick}
        draggable={false}
      />
    </div>
  )
}
