"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import type HlsType from "hls.js"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Play, Pause, Volume2, VolumeX, RotateCcw, Settings, Check, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QualityLevel {
  index: number
  width: number
  height: number
}

interface Video360PlayerProps {
  /** MP4 progresivo — usado si no hay hlsSrc o el navegador no soporta HLS. */
  src: string
  /** Master playlist HLS (adaptativo por calidad de conexión); opcional. */
  hlsSrc?: string | null
  autoPlay?: boolean
  className?: string
  /** Número de cabecera del video actual — se muestra en el óvalo naranja superior. */
  headingNumber?: number
  /** Línea del video actual (número, opcionalmente con letra, ej. "15A") — se muestra en el círculo azul de navegación. Videos de solo cabecera no tienen línea. */
  lineNumber?: number | string
  /** Navegar al video anterior/siguiente (orden cabecera → línea). Omitir oculta los controles. */
  onNavigate?: (direction: "prev" | "next") => void
  hasPrev?: boolean
  hasNext?: boolean
}

export function Video360Player({
  src,
  hlsSrc,
  autoPlay = false,
  className,
  headingNumber,
  lineNumber,
  onNavigate,
  hasPrev = false,
  hasNext = false,
}: Video360PlayerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const frameRef = useRef<number>(0)
  const hlsRef = useRef<HlsType | null>(null)

  // Drag state
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const spherical = useRef({ phi: Math.PI / 2, theta: 0 })
  // Distancia acumulada durante el gesto actual — por debajo del umbral se
  // trata como un tap/click (pausa o reanuda) en vez de un arrastre de cámara.
  const dragDistance = useRef(0)
  const TAP_THRESHOLD = 6

  // Controls state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Icono grande de play/pausa que aparece brevemente al hacer tap/click
  // en el centro del video, igual que en YouTube.
  const [centerIcon, setCenterIcon] = useState<{ icon: "play" | "pause"; key: number } | null>(null)
  const centerIconTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flashCenterIcon = (icon: "play" | "pause") => {
    if (centerIconTimer.current) clearTimeout(centerIconTimer.current)
    setCenterIcon({ icon, key: Date.now() })
    centerIconTimer.current = setTimeout(() => setCenterIcon(null), 500)
  }

  // Selector de calidad (solo disponible cuando se reproduce vía hls.js)
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([])
  const [selectedLevel, setSelectedLevel] = useState(-1) // -1 = Auto
  const [activeLevel, setActiveLevel] = useState(-1) // nivel que realmente se está reproduciendo

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

  // Etiquetas estilo YouTube 360: el sufijo "s" (esférico) se basa en el
  // ancho equirectangular 2:1, no en la altura — p.ej. 3840×1920 es "2160s".
  // Se usa max(ancho, 2×alto) para tolerar fuentes que no sean exactamente 2:1
  // (ej. 3840×2160) y un margen del 10% por redondeos del escalado.
  const QUALITY_TIERS = [
    { width: 5760, label: "2880s", badge: "5.7K" },
    { width: 3840, label: "2160s", badge: "4K" },
    { width: 2880, label: "1440s", badge: "QHD" },
    { width: 2160, label: "1080s", badge: "Full HD" },
    { width: 1440, label: "720s", badge: "HD" },
    { width: 960, label: "480s", badge: null },
  ]

  const qualityTier = (q?: QualityLevel): { label: string; badge: string | null } => {
    if (!q) return { label: "", badge: null }
    const w = Math.max(q.width || 0, q.height * 2)
    return QUALITY_TIERS.find((t) => w >= t.width * 0.9) ?? { label: `${Math.round(w / 2)}s`, badge: null }
  }

  const qualityLabel = (q?: QualityLevel) => qualityTier(q).label

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
    video.crossOrigin = "anonymous"
    video.loop = false
    video.muted = true
    video.playsInline = true
    video.setAttribute("playsinline", "") // iOS Safari legacy attribute
    video.setAttribute("webkit-playsinline", "")
    video.disablePictureInPicture = true
    // iOS Safari sometimes refuses to decode frames into a WebGL texture
    // when the source <video> is never attached to the document, resulting
    // in a black sphere. Keep it in the DOM but visually hidden.
    video.style.position = "absolute"
    video.style.width = "1px"
    video.style.height = "1px"
    video.style.opacity = "0"
    video.style.pointerEvents = "none"
    mount.appendChild(video)
    videoRef.current = video

    video.addEventListener("loadedmetadata", () => setDuration(video.duration))
    video.addEventListener("timeupdate", () =>
      setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
    )
    video.addEventListener("ended", () => setIsPlaying(false))

    const startPlayback = () => {
      if (autoPlay) video.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    // ── Fuente: hls.js (MSE) si el navegador lo soporta —da control real de
    // calidad—, si no HLS nativo del <video> (Safari/iOS viejo sin MSE
    // utilizable), si no MP4 progresivo. canPlayType('application/vnd.apple.mpegurl')
    // no es exclusivo de Safari — algunos Edge/Windows también lo reportan
    // verdadero sin exponer control de niveles por JS, por eso se prueba
    // Hls.isSupported() primero en vez de canPlayType.
    let hls: HlsType | null = null
    let cancelled = false

    if (hlsSrc) {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return
        if (Hls.isSupported()) {
          hls = new Hls()
          hlsRef.current = hls
          hls.loadSource(hlsSrc)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const levels: QualityLevel[] = hls!.levels
              .map((lvl, index) => ({ index, width: lvl.width, height: lvl.height }))
              .sort((a, b) => b.height - a.height)
            setQualityLevels(levels)
            startPlayback()
          })
          hls.on(Hls.Events.LEVEL_SWITCHED, (_evt, data) => {
            setActiveLevel(data.level)
          })
          hls.on(Hls.Events.ERROR, (_evt, data) => {
            // hls.js no loguea sus propios errores por defecto; sin esto,
            // un manifest/segmento que falla (404, CORS, red) queda mudo
            // en consola y el selector de calidad simplemente no aparece.
            console.error("hls.js error", data.type, data.details, data.fatal, data)
          })
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Sin MSE utilizable: HLS nativo del navegador (Safari/iOS viejo).
          // El navegador adapta la calidad solo, sin selector manual.
          video.src = hlsSrc
          startPlayback()
        } else {
          // Sin MSE ni HLS nativo: último recurso, MP4 progresivo fijo
          video.src = src
          startPlayback()
        }
      })
    } else {
      video.src = src
      startPlayback()
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

    // ── Arrastre / tap (Pointer Events: mouse y touch unificados) ──
    // Con touchstart/touchend + mousedown/mouseup por separado, en móviles el
    // navegador dispara además los eventos de mouse emulados tras el touch, y
    // togglePlay() corría dos veces (pausa y vuelve a reproducir al instante).
    // touch-action:none evita que el navegador cancele el gesto para hacer scroll.
    mount.style.touchAction = "none"
    const activePointer = { id: -1 }

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return
      activePointer.id = e.pointerId
      isDragging.current = true
      dragDistance.current = 0
      lastMouse.current = { x: e.clientX, y: e.clientY }
      showControlsTemporarily()
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || e.pointerId !== activePointer.id) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      dragDistance.current += Math.abs(dx) + Math.abs(dy)
      spherical.current.theta -= dx * 0.005
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi - dy * 0.005))
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current || e.pointerId !== activePointer.id) return
      isDragging.current = false
      activePointer.id = -1
      // Sin apenas movimiento: fue un tap/click, no un arrastre de cámara.
      if (dragDistance.current < TAP_THRESHOLD) togglePlay()
    }
    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerId !== activePointer.id) return
      isDragging.current = false
      activePointer.id = -1
    }

    mount.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerCancel)

    // Show controls initially then hide
    showControlsTemporarily()

    return () => {
      cancelled = true
      if (hls) hls.destroy()
      hlsRef.current = null
      setQualityLevels([])
      setSelectedLevel(-1)
      setActiveLevel(-1)
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      mount.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerCancel)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      video.pause()
      video.src = ""
      if (mount.contains(video)) mount.removeChild(video)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [src, hlsSrc])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
      flashCenterIcon("play")
    }
    else { v.pause(); setIsPlaying(false); flashCenterIcon("pause") }
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

  const selectQuality = (level: number) => {
    if (!hlsRef.current) return
    hlsRef.current.currentLevel = level
    setSelectedLevel(level)
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

      {/* Ícono grande de play/pausa: aparece un instante al hacer tap/click
          (sin arrastrar) en el centro del video, como en YouTube. */}
      {centerIcon && (
        <div key={centerIcon.key} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-5 animate-in fade-in zoom-in-75 duration-200">
            {centerIcon.icon === "play" ? (
              <Play className="h-10 w-10 text-white fill-white" />
            ) : (
              <Pause className="h-10 w-10 text-white fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Óvalo de cabecera (centrado, arriba) — solo en videos de cabecera
          (sin línea); en videos de línea solo se muestran las flechas y el
          círculo de línea de la derecha. */}
      {showControls && headingNumber != null && lineNumber == null && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-semibold px-5 py-1.5 rounded-full shadow-md pointer-events-none">
          Cabecera {headingNumber}
        </div>
      )}

      {/* Hint overlay */}
      {showControls && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
          Arrastra para girar la cámara
        </div>
      )}

      {/* Navegación entre videos (centrada, a la derecha): cada flecha en su
          propio recuadro negro. El indicador del centro muestra el círculo
          azul con el número de línea en videos de línea, o una píldora
          naranja "Cabecera" en videos de cabecera (sin línea). */}
      {onNavigate && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white bg-black/50 hover:bg-black/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/20 h-9 w-9 p-0 rounded-lg disabled:opacity-30"
            disabled={!hasNext}
            onClick={() => onNavigate("next")}
            title="Video siguiente"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>

          {lineNumber != null ? (
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-md">
                {lineNumber}
              </div>
              <span className="text-white text-[10px] leading-none drop-shadow">Línea</span>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xs px-3 py-2 shadow-md whitespace-nowrap">
              Cabecera {headingNumber}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white bg-black/50 hover:bg-black/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/20 h-9 w-9 p-0 rounded-lg disabled:opacity-30"
            disabled={!hasPrev}
            onClick={() => onNavigate("prev")}
            title="Video anterior"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
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

          <div className="flex items-center gap-2">
            {qualityLevels.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-white/20 h-8 gap-1 px-2 text-xs"
                    title="Calidad"
                  >
                    <Settings className="h-4 w-4" />
                    {selectedLevel === -1
                      ? `Auto${activeLevel >= 0 ? ` (${qualityLabel(qualityLevels.find((q) => q.index === activeLevel))})` : ""}`
                      : qualityLabel(qualityLevels.find((q) => q.index === selectedLevel))}
                  </Button>
                </DropdownMenuTrigger>
                {/*
                  Sin <DropdownMenuPortal>: un portal a document.body (o incluso al
                  contenedor de pantalla completa) queda detrás del canvas WebGL en
                  fullscreen nativo por cómo Chrome compone el "top layer" con
                  position:fixed portado fuera del árbol. Al no portar, el contenido
                  queda anidado en esta misma barra de controles, que ya se pinta
                  correctamente sobre el video (los demás botones son prueba de eso).
                */}
                <DropdownMenuPrimitive.Content
                  align="end"
                  sideOffset={4}
                  className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                >
                  <DropdownMenuItem onClick={() => selectQuality(-1)} className="justify-between">
                    Auto
                    {selectedLevel === -1 && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  {qualityLevels.map((q) => (
                    <DropdownMenuItem
                      key={q.index}
                      onClick={() => selectQuality(q.index)}
                      className="justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        {qualityTier(q).label}
                        {qualityTier(q).badge && (
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {qualityTier(q).badge}
                          </span>
                        )}
                      </span>
                      {selectedLevel === q.index && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuPrimitive.Content>
              </DropdownMenu>
            )}

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
    </div>
  )
}
