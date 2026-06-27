"use client"

import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Upload, Trash2, Play, Search, Video, Info, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { videoService, OrchardVideo } from "@/services/videoService"
import { Video360Player } from "@/components/ui/Video360Player"

const NOMENCLATURE_EXAMPLE = "HRT-001_2_15.mp4"
const NOMENCLATURE_PATTERN = /^(.+)_(\d+)_(\d+)\.(mp4|mov|webm)$/i

function parseFilename(name: string) {
  const m = name.match(NOMENCLATURE_PATTERN)
  if (!m) return null
  return { orchardNumber: m[1], heading: m[2], line: m[3] }
}

export default function VideosPage() {
  const [videos, setVideos] = useState<OrchardVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OrchardVideo | null>(null)
  const [playTarget, setPlayTarget] = useState<OrchardVideo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filePreview = selectedFile ? parseFilename(selectedFile.name) : null
  const fileValid = selectedFile ? filePreview !== null : null

  const loadVideos = async () => {
    try {
      setIsLoading(true)
      const data = await videoService.getAll()
      setVideos(data)
    } catch {
      toast.error("Error al cargar los videos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  const handleUpload = async () => {
    if (!selectedFile || !fileValid) return
    setIsUploading(true)
    try {
      await videoService.upload(selectedFile)
      toast.success("Video subido correctamente")
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      await loadVideos()
    } catch (err: any) {
      const msg = err?.message || err?.errors?.video?.[0] || "Error al subir el video"
      toast.error(msg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await videoService.delete(deleteTarget.id)
      toast.success("Video eliminado")
      setDeleteTarget(null)
      await loadVideos()
    } catch {
      toast.error("Error al eliminar el video")
    }
  }

  const filtered = videos.filter((v) => {
    const term = searchTerm.toLowerCase()
    return (
      v.orchard_number.toLowerCase().includes(term) ||
      v.original_filename.toLowerCase().includes(term) ||
      (v.orchard?.name || "").toLowerCase().includes(term)
    )
  })

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos 360°</h1>
          <p className="text-gray-600">Gestión de videos panorámicos de huertas</p>
        </div>

        {/* Nomenclatura */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-blue-800">
              <Info className="h-4 w-4" />
              Nomenclatura obligatoria para los archivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-900">
            <p>
              El nombre del archivo debe seguir exactamente este formato:
            </p>
            <code className="block bg-white border border-blue-200 rounded px-3 py-2 font-mono text-base text-blue-800">
              {"{id_huerta}"}_{"{cabecera}"}_{"{linea}"}.mp4
            </code>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-semibold text-blue-700">ID de Huerta</p>
                <p className="text-gray-600 mt-1">
                  El <code className="bg-gray-100 px-1 rounded">orchard_number</code> exacto de la huerta registrada en el sistema.
                </p>
                <p className="text-gray-500 mt-1 text-xs">Ej: <code>HRT-001</code>, <code>FINCA-23</code></p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-semibold text-blue-700">Número de Cabecera</p>
                <p className="text-gray-600 mt-1">
                  Número entero que identifica la cabecera del surco filmado.
                </p>
                <p className="text-gray-500 mt-1 text-xs">Ej: <code>1</code>, <code>2</code>, <code>3</code></p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-semibold text-blue-700">Número de Línea</p>
                <p className="text-gray-600 mt-1">
                  Número entero que identifica la línea dentro de la cabecera.
                </p>
                <p className="text-gray-500 mt-1 text-xs">Ej: <code>1</code>, <code>42</code>, <code>423</code></p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="font-medium">Ejemplo válido:</p>
              <code className="bg-white border border-blue-200 rounded px-2 py-1 font-mono text-blue-800">
                {NOMENCLATURE_EXAMPLE}
              </code>
              <span className="text-gray-500 text-xs">→ Huerta HRT-001, Cabecera 2, Línea 15</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Formatos aceptados: <strong>MP4, MOV, WEBM</strong>. Tamaño máximo: <strong>2 GB</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Subir video */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subir Video 360°</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Archivo de video</Label>
              <div className="flex gap-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !fileValid || isUploading}
                  className="bg-green-600 hover:bg-green-700 shrink-0"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Subiendo..." : "Subir"}
                </Button>
              </div>
            </div>

            {/* Validación del nombre en tiempo real */}
            {selectedFile && (
              <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${fileValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                {fileValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${fileValid ? "text-green-800" : "text-red-800"}`}>
                    {selectedFile.name}
                  </p>
                  {fileValid && filePreview ? (
                    <p className="text-green-700 mt-0.5">
                      Huerta: <strong>{filePreview.orchardNumber}</strong> · Cabecera: <strong>{filePreview.heading}</strong> · Línea: <strong>{filePreview.line}</strong>
                    </p>
                  ) : (
                    <p className="text-red-700 mt-0.5">
                      El nombre no sigue la nomenclatura. Formato esperado: <code className="font-mono">{"{id_huerta}_{cabecera}_{linea}.mp4"}</code>
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Listado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Videos registrados ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar huerta o archivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-gray-500 py-8">Cargando videos...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Video className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>{searchTerm ? "Sin resultados" : "No hay videos registrados"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Archivo</th>
                      <th className="pb-3 font-medium">Huerta</th>
                      <th className="pb-3 font-medium text-center">Cabecera</th>
                      <th className="pb-3 font-medium text-center">Línea</th>
                      <th className="pb-3 font-medium">Subido</th>
                      <th className="pb-3 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="font-mono text-xs text-gray-700 break-all">{v.original_filename}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-gray-900">{v.orchard?.name || "—"}</p>
                            <Badge variant="outline" className="text-xs font-mono mt-0.5">{v.orchard_number}</Badge>
                          </div>
                        </td>
                        <td className="py-3 text-center font-semibold">{v.heading_number}</td>
                        <td className="py-3 text-center font-semibold">{v.line_number}</td>
                        <td className="py-3 pr-4 text-gray-500 text-xs">
                          {new Date(v.created_at).toLocaleDateString("es-MX", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPlayTarget(v)}
                            >
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:border-red-300"
                              onClick={() => setDeleteTarget(v)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reproductor */}
      <Dialog open={!!playTarget} onOpenChange={() => setPlayTarget(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="font-mono text-sm">{playTarget?.original_filename}</DialogTitle>
          </DialogHeader>
          {playTarget && (
            <div className="space-y-2">
              <Video360Player
                src={videoService.streamUrl(playTarget.id)}
                autoPlay
              />
              <div className="flex gap-4 text-sm text-gray-600 px-4 pb-2 pt-1">
                <span>Huerta: <strong>{playTarget.orchard?.name || playTarget.orchard_number}</strong></span>
                <span>Cabecera: <strong>{playTarget.heading_number}</strong></span>
                <span>Línea: <strong>{playTarget.line_number}</strong></span>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => setPlayTarget(null)}>Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminación */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar video?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente <strong>{deleteTarget?.original_filename}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
