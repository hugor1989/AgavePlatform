"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Video360PlayerProps {
  src: string
  autoPlay?: boolean
  className?: string
}

export function Video360Player({ src, autoPlay = false, className }: Video360PlayerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const frameRef = useRef<number>(0)

  // Drag state
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const spherical = useRef({ phi: Math.PI / 2, theta: 0 })

  // Controls state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

  const resetView = () => {
    spherical.current = { phi: Math.PI / 2, theta: 0 }
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Video element ──────────────────────────────────────────
    const video = document.createElement("video")
    video.src = src
    video.crossOrigin = "anonymous"
    video.loop = false
    video.muted = true
    video.playsInline = true
    videoRef.current = video

    video.addEventListener("loadedmetadata", () => setDuration(video.duration))
    video.addEventListener("timeupdate", () =>
      setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
    )
    video.addEventListener("ended", () => setIsPlaying(false))

    if (autoPlay) {
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    // ── Three.js setup ─────────────────────────────────────────
    const w = mount.clientWidth
    const h = mount.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 0.01)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Sphere with video texture (inside-facing)
    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // invert to show texture on inside
    const material = new THREE.MeshBasicMaterial({ map: texture })
    scene.add(new THREE.Mesh(geometry, material))

    // ── Animation loop ─────────────────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      texture.needsUpdate = true

      // Apply spherical coordinates to camera look-at
      const { phi, theta } = spherical.current
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      )

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize observer ────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      renderer.setSize(nw, nh)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
    })
    ro.observe(mount)

    // ── Mouse drag ─────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      showControlsTemporarily()
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      spherical.current.theta -= dx * 0.005
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi - dy * 0.005))
    }
    const onMouseUp = () => { isDragging.current = false }

    // ── Touch drag ─────────────────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      showControlsTemporarily()
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      const dx = e.touches[0].clientX - lastMouse.current.x
      const dy = e.touches[0].clientY - lastMouse.current.y
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      spherical.current.theta -= dx * 0.005
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi - dy * 0.005))
    }
    const onTouchEnd = () => { isDragging.current = false }

    mount.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    mount.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd)

    // Show controls initially then hide
    showControlsTemporarily()

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      mount.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      mount.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      video.pause()
      video.src = ""
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [src])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setIsPlaying(true) }
    else { v.pause(); setIsPlaying(false) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }

  const seek = (val: number[]) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    v.currentTime = (val[0] / 100) * v.duration
  }

  const skip = (seconds: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + seconds))
  }

  // Flecha izquierda/derecha: pausa el video y avanza o retrocede 0.5 s
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      e.preventDefault()
      const v = videoRef.current
      if (!v) return
      if (!v.paused) { v.pause(); setIsPlaying(false) }
      skip(e.key === "ArrowLeft" ? -0.5 : 0.5)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      className={`relative w-full bg-black select-none ${className ?? "h-[65vh]"}`}
      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Hint overlay */}
      {showControls && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
          Arrastra para girar la cámara
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress bar */}
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={seek}
          className="mb-3"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <span className="text-white/50 text-xs hidden sm:inline">← → 0.5 s</span>

            <span className="text-white text-xs tabular-nums">
              {fmtTime((progress / 100) * duration)} / {fmtTime(duration)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
            title="Restablecer vista"
            onClick={resetView}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
