"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Settings, Check, AlertCircle, DollarSign, Building2, Leaf, Send, TestTube } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

import { AppLayout } from "@/components/layouts/app-layout"


// Datos simulados de notificaciones
const notifications = [
  {
    id: 1,
    title: "Nueva oferta recibida",
    message: "Tequila Premium SA ha hecho una oferta de $850,000 por la Huerta Los Altos",
    type: "offer",
    time: "Hace 5 minutos",
    read: false,
    icon: DollarSign,
  },
  {
    id: 2,
    title: "Empresa registrada",
    message: "Agave Industries México completó su proceso de registro",
    type: "company",
    time: "Hace 1 hora",
    read: false,
    icon: Building2,
  },
  {
    id: 3,
    title: "Huerta vendida",
    message: "La huerta Premium Valley ha sido vendida por $1,200,000",
    type: "sale",
    time: "Hace 2 horas",
    read: true,
    icon: Leaf,
  },
  {
    id: 4,
    title: "Oferta en negociación",
    message: "Contraoferta enviada para la Huerta El Mirador",
    type: "negotiation",
    time: "Hace 3 horas",
    read: true,
    icon: AlertCircle,
  },
]

export default function NotificationsPage() {
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    smtp_user: "admin@productoresagave.com",
    smtp_password: "",
    from_name: "Productores Agave",
    from_email: "admin@productoresagave.com",
  })

  const [preferences, setPreferences] = useState({
    newOffers: true,
    companyRegistrations: true,
    salesCompleted: true,
    systemAlerts: false,
    weeklyReports: true,
    emailNotifications: true,
    pushNotifications: false,
  })

  const [testEmail, setTestEmail] = useState("")
  const [testMessage, setTestMessage] = useState("")

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleEmailSettingChange = (key: string, value: string) => {
    setEmailSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSendTestEmail = () => {
    // Simular envío de email de prueba
    alert(`Email de prueba enviado a: ${testEmail}`)
  }

  const markAsRead = (id: number) => {
    // Lógica para marcar como leída
    console.log(`Marking notification ${id} as read`)
  }

  const markAllAsRead = () => {
    // Lógica para marcar todas como leídas
    console.log("Marking all notifications as read")
  }

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600">Gestiona las notificaciones y configuración de email</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Recent Notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notificaciones Recientes</CardTitle>
                  <CardDescription>Últimas notificaciones del sistema</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        !notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${!notification.read ? "bg-blue-100" : "bg-gray-100"}`}>
                        <notification.icon
                          className={`h-4 w-4 ${!notification.read ? "text-blue-600" : "text-gray-600"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificación</CardTitle>
                <CardDescription>Configura qué tipos de notificaciones deseas recibir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newOffers">Nuevas Ofertas</Label>
                      <p className="text-sm text-gray-500">Recibir notificaciones cuando lleguen nuevas ofertas</p>
                    </div>
                    <Switch
                      id="newOffers"
                      checked={preferences.newOffers}
                      onCheckedChange={(checked) => handlePreferenceChange("newOffers", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="companyRegistrations">Registro de Empresas</Label>
                      <p className="text-sm text-gray-500">Notificar cuando se registren nuevas empresas</p>
                    </div>
                    <Switch
                      id="companyRegistrations"
                      checked={preferences.companyRegistrations}
                      onCheckedChange={(checked) => handlePreferenceChange("companyRegistrations", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="salesCompleted">Ventas Completadas</Label>
                      <p className="text-sm text-gray-500">Recibir notificaciones de ventas finalizadas</p>
                    </div>
                    <Switch
                      id="salesCompleted"
                      checked={preferences.salesCompleted}
                      onCheckedChange={(checked) => handlePreferenceChange("salesCompleted", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemAlerts">Alertas del Sistema</Label>
                      <p className="text-sm text-gray-500">Notificaciones técnicas y de mantenimiento</p>
                    </div>
                    <Switch
                      id="systemAlerts"
                      checked={preferences.systemAlerts}
                      onCheckedChange={(checked) => handlePreferenceChange("systemAlerts", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Reportes Semanales</Label>
                      <p className="text-sm text-gray-500">Recibir resumen semanal de actividad</p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={preferences.weeklyReports}
                      onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Canales de Notificación</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                      <p className="text-sm text-gray-500">Recibir notificaciones en tu correo electrónico</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Notificaciones Push</Label>
                      <p className="text-sm text-gray-500">Recibir notificaciones en el navegador</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            {/* SMTP Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración SMTP</CardTitle>
                <CardDescription>Configura el servidor de correo para envío de notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">Servidor SMTP</Label>
                    <Input
                      id="smtp_host"
                      value={emailSettings.smtp_host}
                      onChange={(e) => handleEmailSettingChange("smtp_host", e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">Puerto</Label>
                    <Input
                      id="smtp_port"
                      value={emailSettings.smtp_port}
                      onChange={(e) => handleEmailSettingChange("smtp_port", e.target.value)}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_user">Usuario SMTP</Label>
                    <Input
                      id="smtp_user"
                      type="email"
                      value={emailSettings.smtp_user}
                      onChange={(e) => handleEmailSettingChange("smtp_user", e.target.value)}
                      placeholder="usuario@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">Contraseña</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => handleEmailSettingChange("smtp_password", e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from_name">Nombre del Remitente</Label>
                    <Input
                      id="from_name"
                      value={emailSettings.from_name}
                      onChange={(e) => handleEmailSettingChange("from_name", e.target.value)}
                      placeholder="Productores Agave"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from_email">Email del Remitente</Label>
                    <Input
                      id="from_email"
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => handleEmailSettingChange("from_email", e.target.value)}
                      placeholder="admin@productoresagave.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Email */}
            <Card>
              <CardHeader>
                <CardTitle>Prueba de Email</CardTitle>
                <CardDescription>Envía un email de prueba para verificar la configuración</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test_email">Email de Destino</Label>
                  <Input
                    id="test_email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test_message">Mensaje de Prueba</Label>
                  <Textarea
                    id="test_message"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Este es un mensaje de prueba del sistema de notificaciones..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendTestEmail} disabled={!testEmail}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Prueba
                  </Button>
                  <Button variant="outline">
                    <TestTube className="h-4 w-4 mr-2" />
                    Probar Conexión
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
