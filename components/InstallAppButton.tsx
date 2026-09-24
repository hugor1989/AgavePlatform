"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"
import { Download, Share, SquarePlus, X } from "lucide-react"

// No es un tipo estándar del DOM lib de TS todavía.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type WindowWithPrompt = Window & { __deferredInstallPrompt?: BeforeInstallPromptEvent | null }

function isStandalone() {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS() {
  if (typeof navigator === "undefined") return false
  // iPadOS se identifica como "Macintosh"; se distingue por la pantalla táctil.
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (/macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  )
}

// Si el usuario cierra el botón con la ×, no se vuelve a mostrar en 1 día.
const DISMISS_KEY = "agave_install_dismissed_at"
const DISMISS_MS = 24 * 60 * 60 * 1000

// Lo escribe useAuth().login al iniciar sesión; se consume al mostrar el aviso.
const AFTER_LOGIN_KEY = "agave_install_after_login"

function wasDismissedRecently() {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY))
    return !!at && Date.now() - at < DISMISS_MS
  } catch {
    return false
  }
}

function consumeAfterLoginFlag() {
  try {
    if (window.sessionStorage.getItem(AFTER_LOGIN_KEY) !== "1") return false
    window.sessionStorage.removeItem(AFTER_LOGIN_KEY)
    return true
  } catch {
    return false
  }
}

// Instalación de la app como PWA: un botón flotante discreto (solo ícono) y,
// justo después de iniciar sesión, un aviso con botón "Instalar". En
// Android/Chrome/Edge usa el prompt nativo (beforeinstallprompt, que solo se
// puede abrir con un toque del usuario); en iOS Safari no existe esa API, así
// que se muestran instrucciones manuales (Compartir → Agregar a inicio).
export function InstallAppButton() {
  const { user } = useAuth()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [installed, setInstalled] = useState(true)
  const [buttonDismissed, setButtonDismissed] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    setInstalled(false)
    setIos(isIOS())
    setButtonDismissed(wasDismissedRecently())

    // El evento lo captura el script inline de layout.tsx (puede llegar antes
    // de la hidratación); aquí se toma el guardado o se espera al aviso.
    const w = window as WindowWithPrompt
    const takePrompt = () => {
      if (w.__deferredInstallPrompt) setDeferredPrompt(w.__deferredInstallPrompt)
    }
    const onInstalled = () => {
      w.__deferredInstallPrompt = null
      setDeferredPrompt(null)
      setInstalled(true)
    }

    takePrompt()
    window.addEventListener("installpromptready", takePrompt)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("installpromptready", takePrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  const canInstall = !installed && (ios || !!deferredPrompt)

  // Aviso tras iniciar sesión: se muestra una sola vez por login, en cuanto la
  // instalación esté disponible (el evento de Chrome puede llegar después).
  useEffect(() => {
    if (user && canInstall && consumeAfterLoginFlag()) setShowBanner(true)
  }, [user, canInstall])

  const handleInstall = async () => {
    setShowBanner(false)
    if (ios) {
      setShowIosHelp(true)
      return
    }
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    // Un prompt solo se puede usar una vez: el botón se oculta hasta que el
    // navegador vuelva a ofrecer la instalación (al recargar o en otra visita).
    ;(window as WindowWithPrompt).__deferredInstallPrompt = null
    setDeferredPrompt(null)
  }

  const handleDismissButton = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // localStorage no disponible — solo se oculta en esta visita
    }
    setButtonDismissed(true)
  }

  if (!canInstall && !showIosHelp) return null

  return (
    <>
      {canInstall && showBanner && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-xl border bg-white p-4 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4">
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Cerrar"
            className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 pr-5">
            <img src="/icon-192x192.png" alt="" className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Instala Productores Agave</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Accede más rápido desde tu pantalla de inicio, como una app.
              </p>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowBanner(false)}>
              Ahora no
            </Button>
            <Button size="sm" className="bg-teal-600 text-white hover:bg-teal-700" onClick={handleInstall}>
              <Download className="h-4 w-4" />
              Instalar
            </Button>
          </div>
        </div>
      )}

      {canInstall && !showBanner && !buttonDismissed && (
        <div className="group fixed bottom-4 left-4 z-40">
          <button
            onClick={handleInstall}
            aria-label="Instalar app"
            title="Instalar app"
            className="flex h-10 items-center gap-2 rounded-full border border-teal-600/30 bg-white/90 px-2.5 text-teal-700 shadow-md backdrop-blur transition-all [@media(hover:hover)]:hover:bg-white"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="hidden pr-1 text-xs font-medium [@media(hover:hover)]:group-hover:inline">
              Instalar app
            </span>
          </button>
          <button
            onClick={handleDismissButton}
            aria-label="Ocultar botón de instalar"
            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-white shadow"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      )}

      <Dialog open={showIosHelp} onOpenChange={setShowIosHelp}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Instalar la app</DialogTitle>
            <DialogDescription>
              Safari no permite instalar apps con un botón — sigue estos pasos para
              agregar Productores Agave a tu pantalla de inicio.
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-4 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <Share className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Toca el botón <strong>Compartir</strong> en la barra del navegador.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <SquarePlus className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Selecciona <strong>&quot;Agregar a pantalla de inicio&quot;</strong>.
              </span>
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  )
}
