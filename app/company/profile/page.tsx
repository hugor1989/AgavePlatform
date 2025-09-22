"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CompanyLayout } from "@/components/company-layout"
import { Building2, Mail, Save, Edit, Camera } from "lucide-react"

// Icono de Agave con el SVG proporcionado
const AgaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path
      fill="#91CC04"
      d="M217.081,418.866c23.418,7.837,48.756-4.794,56.594-28.213c7.837-23.419-4.794-48.756-28.213-56.594
      c-23.419-7.837-229.718-55.766-237.555-32.348C0.07,325.129,193.662,411.029,217.081,418.866z"
    />
    <path
      fill="#85BB04"
      d="M245.462,334.059c-14.861-4.973-103.365-26.091-168.066-34.876
      c6.584,7.874,72.569,80.301,91.733,99.441c23.381,10.518,41.712,18.152,47.953,20.24c23.418,7.837,48.756-4.794,56.594-28.213
      C281.512,367.235,268.881,341.897,245.462,334.059z"
    />
    <path
      fill="#9CDD05"
      d="M294.891,418.866c-23.418,7.837-48.756-4.794-56.594-28.213
      c-7.837-23.418,4.794-48.756,28.213-56.594c23.419-7.837,229.718-55.767,237.556-32.349
      C511.903,325.129,318.309,411.029,294.891,418.866z"
    />
    <path
      fill="#91CC04"
      d="M434.577,299.183c-64.702,8.786-153.206,29.903-168.066,34.876
      c-23.418,7.837-36.049,33.175-28.213,56.593c7.837,23.418,33.175,36.049,56.594,28.213c6.241-2.089,24.571-9.723,47.953-20.24
      C362.008,379.484,427.993,307.058,434.577,299.183z"
    />
    <path
      fill="#85BB04"
      d="M198.507,350.579c10.667,22.273,37.369,31.681,59.642,21.015
      c22.273-10.667,31.681-37.369,21.015-59.642c-10.667-22.273-119.792-203.79-142.064-193.124S187.84,328.306,198.507,350.579z"
    />
    <path
      fill="#85BB04"
      d="M319.087,350.579c-10.667,22.273-37.369,31.681-59.642,21.015
      c-22.273-10.667-31.681-37.369-21.015-59.642c10.667-22.273,119.792-203.79,142.064-193.124
      C402.767,129.495,329.752,328.306,319.087,350.579z"
    />
    <path
      fill="#91CC04"
      d="M214.084,326.516c-0.201,24.694,19.654,44.876,44.348,45.077
      c24.694,0.201,44.876-19.654,45.077-44.348S285.411,91.549,260.718,91.348S214.285,301.821,214.084,326.516z"
    />
    <path
      fill="#9CDD05"
      d="M210.663,395.976c18.87,15.93,47.081,13.547,63.011-5.323c15.93-18.87,13.547-47.081-5.323-63.011
      c-18.87-15.93-192.895-136.646-208.825-117.776S191.793,380.046,210.663,395.976z"
    />
    <path
      fill="#C2FB3B"
      d="M301.309,395.976c-18.87,15.93-47.081,13.547-63.011-5.323c-15.93-18.87-13.547-47.081,5.323-63.011
      c18.87-15.93,192.895-136.646,208.825-117.776C468.375,228.736,320.179,380.046,301.309,395.976z"
    />
  </svg>
)

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Tequilera Premium S.A. de C.V.",
    email: "contacto@tequilerapremium.com",
    phone: "+52 33 1234 5678",
    address: "Av. Tequila 123, Col. Centro, Guadalajara, Jalisco",
    website: "www.tequilerapremium.com",
    description:
      "Empresa líder en la producción de tequila premium con más de 25 años de experiencia en el mercado nacional e internacional.",
    rfc: "TPR850315ABC",
    legalName: "Tequilera Premium S.A. de C.V.",
    industry: "Producción de Bebidas Alcohólicas",
    employees: "150-200",
    founded: "1985",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Aquí iría la lógica para guardar los datos
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil de la Empresa</h1>
            <p className="text-muted-foreground">Gestiona la información de tu empresa</p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium">{profileData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalName">Razón Social</Label>
                {isEditing ? (
                  <Input
                    id="legalName"
                    value={profileData.legalName}
                    onChange={(e) => handleInputChange("legalName", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{profileData.legalName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfc">RFC</Label>
                {isEditing ? (
                  <Input id="rfc" value={profileData.rfc} onChange={(e) => handleInputChange("rfc", e.target.value)} />
                ) : (
                  <p className="text-sm font-mono">{profileData.rfc}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Giro</Label>
                {isEditing ? (
                  <Input
                    id="industry"
                    value={profileData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{profileData.industry}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="founded">Año de Fundación</Label>
                  {isEditing ? (
                    <Input
                      id="founded"
                      value={profileData.founded}
                      onChange={(e) => handleInputChange("founded", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{profileData.founded}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Empleados</Label>
                  {isEditing ? (
                    <Input
                      id="employees"
                      value={profileData.employees}
                      onChange={(e) => handleInputChange("employees", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{profileData.employees}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{profileData.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{profileData.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{profileData.website}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm">{profileData.address}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Descripción de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Descripción de la Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={profileData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                placeholder="Describe tu empresa, sus servicios y experiencia..."
              />
            ) : (
              <p className="text-sm leading-relaxed">{profileData.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas de Compras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AgaveIcon className="w-5 h-5 text-green-600" />
              Estadísticas de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">Huertas Compradas</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">70,978</p>
                <p className="text-sm text-gray-600">Total de Plantas</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">45 ha</p>
                <p className="text-sm text-gray-600">Área Total</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">$9M</p>
                <p className="text-sm text-gray-600">Inversión Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Logo de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Sube el logo de tu empresa para personalizar tu perfil</p>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Subir Logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CompanyLayout>
  )
}
