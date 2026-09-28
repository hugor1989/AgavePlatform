"use client"

import { toast } from "@/hooks/use-toast"

// Asegura que el enlace sea absoluto (ej. "maps.app.goo.gl/xyz" -> "https://maps.app.goo.gl/xyz")
const normalizeUrl = (url: string) => {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Respaldo para contextos sin navigator.clipboard (HTTP, navegadores viejos)
const legacyCopy = (text: string) => {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      /* usar respaldo */
    }
  }
  return legacyCopy(text)
}

export const shareLocation = async (rawUrl: string) => {
  if (!rawUrl) return
  const url = normalizeUrl(rawUrl)
  const data = {
    title: "Ubicación de la huerta",
    text: "Mira la ubicación de esta huerta",
    url,
  }

  if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
    try {
      await navigator.share(data)
      return
    } catch (error) {
      // El usuario cerró el menú de compartir
      if (error instanceof DOMException && error.name === "AbortError") return
      console.error("Error al compartir ubicación:", error)
    }
  }

  if (await copyToClipboard(url)) {
    toast({ title: "Enlace copiado", description: "La ubicación se copió al portapapeles." })
    return
  }

  // Último recurso: mostrar el enlace para copiarlo manualmente
  window.prompt("Copia el enlace de la ubicación:", url)
}
