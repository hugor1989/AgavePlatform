"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Eye,
  EyeOff,
  Save,
  Smartphone,
  Mail,
  Lock,
  Trash2,
} from "lucide-react"

export default function FarmerSettings() {
  const [activeSection, setActiveSection] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const sections = [
    { id: "profile", name: "Perfil", icon: User },
    { id: "notifications", name: "Notificaciones", icon: Bell },
    { id: "privacy", name: "Privacidad", icon: Shield },
    { id: "payments", name: "Pagos", icon: CreditCard },
    { id: "account", name: "Cuenta", icon: Settings },
  ]

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Información Personal</h3>
        <p className="text-sm text-muted-foreground">Actualiza tu información personal y de contacto</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" defaultValue="Juan" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos</Label>
          <Input id="lastName" defaultValue="Pérez García" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" type="email" defaultValue="juan.perez@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" defaultValue="+52 123 456 7890" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Ubicación Principal</Label>
        <Input id="location" defaultValue="Tequila, Jalisco" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Años de Experiencia</Label>
        <Input id="experience" type="number" defaultValue="15" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Descripción</Label>
        <Textarea
          id="bio"
          rows={4}
          defaultValue="Agricultor con 15 años de experiencia en el cultivo de agave azul tequilana. Especializado en técnicas sustentables y producción de alta calidad."
        />
      </div>

      <Button>
        <Save className="h-4 w-4 mr-2" />
        Guardar Cambios
      </Button>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferencias de Notificaciones</h3>
        <p className="text-sm text-muted-foreground">Configura cómo y cuándo quieres recibir notificaciones</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Notificaciones por Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Nuevas ofertas</Label>
              <p className="text-sm text-muted-foreground">Recibir email cuando lleguen nuevas ofertas</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cambios de estado</Label>
              <p className="text-sm text-muted-foreground">Notificar cambios en ofertas y huertas</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Recordatorios</Label>
              <p className="text-sm text-muted-foreground">Recordatorios de documentación y tareas</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Newsletter</Label>
              <p className="text-sm text-muted-foreground">Noticias y actualizaciones de la plataforma</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Notificaciones Push
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Ofertas urgentes</Label>
              <p className="text-sm text-muted-foreground">Ofertas con fecha límite próxima</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Mensajes importantes</Label>
              <p className="text-sm text-muted-foreground">Comunicaciones críticas del administrador</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frecuencia de Resúmenes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Resumen de actividad</Label>
            <Select defaultValue="weekly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="never">Nunca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button>
        <Save className="h-4 w-4 mr-2" />
        Guardar Preferencias
      </Button>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuración de Privacidad</h3>
        <p className="text-sm text-muted-foreground">Controla la visibilidad de tu información y huertas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visibilidad del Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar información de contacto</Label>
              <p className="text-sm text-muted-foreground">Las empresas pueden ver tu teléfono y email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar años de experiencia</Label>
              <p className="text-sm text-muted-foreground">Visible en el perfil público</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar ubicación exacta</Label>
              <p className="text-sm text-muted-foreground">Mostrar municipio específico de las huertas</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comunicaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir contacto directo</Label>
              <p className="text-sm text-muted-foreground">Las empresas pueden contactarte directamente</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar estado en línea</Label>
              <p className="text-sm text-muted-foreground">Indicar cuando estás activo en la plataforma</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos y Analíticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Compartir datos de uso</Label>
              <p className="text-sm text-muted-foreground">Ayudar a mejorar la plataforma</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cookies de marketing</Label>
              <p className="text-sm text-muted-foreground">Personalizar contenido y anuncios</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Button>
        <Save className="h-4 w-4 mr-2" />
        Guardar Configuración
      </Button>
    </div>
  )

  const renderPaymentsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Información de Pagos</h3>
        <p className="text-sm text-muted-foreground">Configura tu información bancaria para recibir pagos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cuenta Bancaria Principal</CardTitle>
          <CardDescription>Esta información se utilizará para transferir los pagos de las ventas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bankName">Banco</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bbva">BBVA</SelectItem>
                  <SelectItem value="banamex">Banamex</SelectItem>
                  <SelectItem value="santander">Santander</SelectItem>
                  <SelectItem value="banorte">Banorte</SelectItem>
                  <SelectItem value="hsbc">HSBC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Tipo de Cuenta</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Cuenta de Cheques</SelectItem>
                  <SelectItem value="savings">Cuenta de Ahorros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Número de Cuenta</Label>
            <Input id="accountNumber" placeholder="0123456789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clabe">CLABE Interbancaria</Label>
            <Input id="clabe" placeholder="012345678901234567" maxLength={18} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Titular de la Cuenta</Label>
            <Input id="accountHolder" defaultValue="Juan Pérez García" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información Fiscal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC</Label>
              <Input id="rfc" placeholder="PEGJ800101ABC" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRegime">Régimen Fiscal</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar régimen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Persona Física</SelectItem>
                  <SelectItem value="actividad">Actividad Empresarial</SelectItem>
                  <SelectItem value="agricola">Actividad Agrícola</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiscalAddress">Domicilio Fiscal</Label>
            <Textarea id="fiscalAddress" rows={2} placeholder="Calle, número, colonia, CP, ciudad, estado" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Venta Hacienda Agave Real</p>
                <p className="text-sm text-muted-foreground">15 de enero, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">$980,000 MXN</p>
                <Badge className="bg-green-100 text-green-800">Completado</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Venta Plantación Norte</p>
                <p className="text-sm text-muted-foreground">28 de diciembre, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">$750,000 MXN</p>
                <Badge className="bg-green-100 text-green-800">Completado</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button>
        <Save className="h-4 w-4 mr-2" />
        Guardar Información
      </Button>
    </div>
  )

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuración de Cuenta</h3>
        <p className="text-sm text-muted-foreground">Gestiona la seguridad y configuración de tu cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <div className="relative">
              <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input id="newPassword" type={showNewPassword ? "text" : "password"} placeholder="••••••••" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" />
          </div>
          <Button>
            <Lock className="h-4 w-4 mr-2" />
            Cambiar Contraseña
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Autenticación de Dos Factores</CardTitle>
          <CardDescription>Agrega una capa extra de seguridad a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Autenticación por SMS</Label>
              <p className="text-sm text-muted-foreground">Recibir códigos por mensaje de texto</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>App de Autenticación</Label>
              <p className="text-sm text-muted-foreground">Usar Google Authenticator o similar</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sesiones Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Navegador actual</p>
                <p className="text-sm text-muted-foreground">Chrome en Windows • Guadalajara, Jalisco</p>
                <p className="text-sm text-muted-foreground">Activo ahora</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Actual</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Dispositivo móvil</p>
                <p className="text-sm text-muted-foreground">Safari en iPhone • Tequila, Jalisco</p>
                <p className="text-sm text-muted-foreground">Hace 2 horas</p>
              </div>
              <Button variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Zona de Peligro</CardTitle>
          <CardDescription>Acciones irreversibles que afectan permanentemente tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-red-600">Eliminar Cuenta</Label>
              <p className="text-sm text-muted-foreground">
                Eliminar permanentemente tu cuenta y todos los datos asociados
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection()
      case "notifications":
        return renderNotificationsSection()
      case "privacy":
        return renderPrivacySection()
      case "payments":
        return renderPaymentsSection()
      case "account":
        return renderAccountSection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Gestiona tu cuenta y preferencias de la plataforma</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-teal-100 text-teal-700 border-r-2 border-teal-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">{renderContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
