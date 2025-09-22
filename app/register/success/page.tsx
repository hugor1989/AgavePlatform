import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Mail } from "lucide-react"
import { Logo } from "@/components/logo"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo size="md" className="justify-center mb-4" />
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-800">¡Solicitud Enviada!</CardTitle>
          <CardDescription>Tu registro ha sido recibido correctamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">¿Qué sigue ahora?</h3>
              <div className="text-sm text-green-700 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Revisión de tu solicitud (1-3 días hábiles)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Notificación por email del resultado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Activación de tu cuenta una vez aprobada</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Información Importante</h3>
              <p className="text-sm text-blue-700">
                Nuestro equipo revisará tu información y se pondrá en contacto contigo si necesita documentación
                adicional. Mantén tu email y teléfono disponibles.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">¿Necesitas ayuda?</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>📧 soporte@productoresagave.com</p>
                <p>📞 +52 (33) 1234-5678</p>
                <p>🕒 Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
            <Button className="flex-1 bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/login">Ir a Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
