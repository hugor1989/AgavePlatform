"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Info, Building2 } from "lucide-react"
import { Logo } from "@/components/logo"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    experience: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const typeFromUrl = searchParams.get("type")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de registro - en producción conectar con backend
    if (formData.name && formData.email && formData.password) {
      // Simular delay de envío
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push("/register/success")
    }
    setIsSubmitting(false)
  }

  // Si intentan registrar una empresa, mostrar información de contacto
  if (typeFromUrl === "company") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="md" className="justify-center mb-4" />
            <Building2 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Registro de Empresas</CardTitle>
            <CardDescription>El registro de empresas requiere un proceso especial de verificación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Para registrar tu empresa en nuestra plataforma, necesitas contactar directamente con nuestro equipo de
                administración para iniciar el proceso de verificación.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Proceso de Registro para Empresas:</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Contacto inicial con administración</li>
                  <li>• Envío de documentación legal</li>
                  <li>• Verificación de antecedentes</li>
                  <li>• Revisión de capacidad financiera</li>
                  <li>• Aprobación y creación de cuenta</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Información de Contacto:</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>📧 Email: empresas@productoresagave.com</p>
                  <p>📞 Teléfono: +52 (33) 1234-5678</p>
                  <p>🕒 Horario: Lun-Vie 9:00-18:00</p>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-800 mb-2">Documentos Requeridos:</h3>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>• Acta constitutiva</li>
                  <li>• RFC vigente</li>
                  <li>• Comprobante de domicilio fiscal</li>
                  <li>• Estados financieros recientes</li>
                  <li>• Identificación del representante legal</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                <a href="mailto:empresas@productoresagave.com">Contactar Ahora</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo size="md" className="justify-center mb-4" />
          <CardTitle className="text-2xl">Registro de Agricultor</CardTitle>
          <CardDescription>Únete a nuestra plataforma como productor de agave</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Tu registro será revisado por nuestro equipo de administración. Recibirás una confirmación por email una
              vez aprobado.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                placeholder="Juan Pérez García"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+52 123 456 7890"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación de las Huertas *</Label>
              <Input
                id="location"
                placeholder="Municipio, Estado"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Años de Experiencia *</Label>
              <Input
                id="experience"
                type="number"
                placeholder="10"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción de tu Actividad</Label>
              <Textarea
                id="description"
                placeholder="Describe tu experiencia como agricultor, tipos de agave que cultivas, extensión de tus terrenos, etc."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
              {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud de Registro"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link href="/login" className="text-teal-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
