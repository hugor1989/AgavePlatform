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
import { Download, Share, SquarePlus } from "lucide-react"

// No es un tipo estándar del DOM lib de TS todavía.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

function isStandalone() {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS() {
  if (typeof navigator === "undefined") return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

// Botón flotante para instalar la app como PWA. En Android/Chrome/Edge usa el
// prompt nativo (beforeinstallprompt); en iOS Safari no existe esa API, así
// que se muestran instrucciones manuales (Compartir → Agregar a inicio).
export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    setIos(isIOS())

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    const onInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onInstalled)

    // En iOS no hay beforeinstallprompt: mostramos el botón directamente.
    if (isIOS()) setVisible(true)

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  if (!visible) return null

  const handleClick = async () => {
    if (ios) {
      setShowIosHelp(true)
      return
    }
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setVisible(false)
    setDeferredPrompt(null)
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className="fixed bottom-4 right-4 z-40 h-11 gap-2 rounded-full bg-teal-600 px-4 text-white shadow-lg hover:bg-teal-700"
      >
        <Download className="h-4 w-4" />
        Instalar app
      </Button>

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
