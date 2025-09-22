"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Eye, Search, UserPlus, Copy, Info, XCircle } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

export default function AdminFarmersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFarmerCredentials, setNewFarmerCredentials] = useState<{ username: string; password: string } | null>(null)
  const [showCredentialsAlert, setShowCredentialsAlert] = useState(false)

  const [farmers, setFarmers] = useState([
    {
      id: 1,
      uniqueId: "1704931200",
      name: "Ana Martínez Silva",
      email: "ana@email.com",
      phone: "+52 333 987 6543",
      address: "Av. Patria 1234, Col. Jardines del Bosque, Zapopan, Jalisco",
      gender: "femenino",
      huertas: 4,
      status: "active",
      registeredAt: "2024-01-10",
      lastActivity: "2024-01-19",
      username: "523339876543",
    },
    {
      id: 2,
      uniqueId: "1704844800",
      name: "Roberto Hernández",
      email: "roberto@email.com",
      phone: "+52 444 555 6666",
      address: "Calle Morelos 567, Centro, Arandas, Jalisco",
      gender: "masculino",
      huertas: 2,
      status: "active",
      registeredAt: "2024-01-08",
      lastActivity: "2024-01-18",
      username: "524445556666",
    },
    {
      id: 3,
      uniqueId: "1705017600",
      name: "Juan Pérez García",
      email: "juan@email.com",
      phone: "+52 123 456 7890",
      address: "Calle Hidalgo 123, Centro, Tequila, Jalisco",
      gender: "masculino",
      huertas: 3,
      status: "inactive",
      registeredAt: "2024-01-15",
      lastActivity: "2024-01-17",
      username: "521234567890",
    },
  ])

  const [newFarmerForm, setNewFarmerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  })

  const generateCredentials = (phone: string) => {
    // Remove any non-numeric characters from phone and use as username
    const username = phone.replace(/[^\d]/g, "")

    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase()

    return { username, password }
  }

  const handleAddFarmer = () => {
    if (
      !newFarmerForm.name ||
      !newFarmerForm.email ||
      !newFarmerForm.phone ||
      !newFarmerForm.address ||
      !newFarmerForm.gender
    ) {
      return
    }

    const credentials = generateCredentials(newFarmerForm.phone)

    // Generate numeric unique identifier
    const uniqueId = Date.now().toString()

    const newFarmer = {
      id: farmers.length + 1,
      uniqueId: uniqueId,
      ...newFarmerForm,
      huertas: 0,
      status: "active",
      registeredAt: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      username: credentials.username,
    }

    setFarmers([...farmers, newFarmer])
    setNewFarmerCredentials(credentials)
    setShowCredentialsAlert(true)
    setIsAddDialogOpen(false)
    setNewFarmerForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || farmer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Agricultores</h1>
            <p className="text-gray-600">Administra y registra nuevos agricultores</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Agricultor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Agricultor</DialogTitle>
                <DialogDescription>
                  Completa la información del agricultor para generar sus credenciales de acceso
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name">Nombre Completo *</label>
                    <Input
                      id="name"
                      value={newFarmerForm.name}
                      onChange={(e) => setNewFarmerForm({ ...newFarmerForm, name: e.target.value })}
                      placeholder="Ej: Juan Pérez García"
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email *</label>
                    <Input
                      id="email"
                      type="email"
                      value={newFarmerForm.email}
                      onChange={(e) => setNewFarmerForm({ ...newFarmerForm, email: e.target.value })}
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">Teléfono *</label>
                    <Input
                      id="phone"
                      value={newFarmerForm.phone}
                      onChange={(e) => setNewFarmerForm({ ...newFarmerForm, phone: e.target.value })}
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                  <div>
                    <label htmlFor="address">Dirección *</label>
                    <Input
                      id="address"
                      value={newFarmerForm.address}
                      onChange={(e) => setNewFarmerForm({ ...newFarmerForm, address: e.target.value })}
                      placeholder="Calle, Número, Colonia, Ciudad"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender">Sexo *</label>
                    <select
                      id="gender"
                      value={newFarmerForm.gender}
                      onChange={(e) => setNewFarmerForm({ ...newFarmerForm, gender: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddFarmer} className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar Agricultor
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Credentials Alert */}
        {showCredentialsAlert && newFarmerCredentials && (
          <Alert className="border-green-200 bg-green-50">
            <Info className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">¡Agricultor registrado exitosamente!</AlertTitle>
            <AlertDescription className="text-green-700">
              <div className="mt-2 space-y-2">
                <p className="font-medium">Credenciales generadas para el agricultor:</p>
                <div className="bg-white p-3 rounded border space-y-2">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Usuario:</strong> {newFarmerCredentials.username}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(newFarmerCredentials.username)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Contraseña:</strong> {newFarmerCredentials.password}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(newFarmerCredentials.password)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm">
                  <strong>Importante:</strong> Comparte estas credenciales con el agricultor para que pueda acceder a la
                  plataforma.
                </p>
                <Button size="sm" variant="outline" onClick={() => setShowCredentialsAlert(false)} className="mt-2">
                  Entendido
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Listado de Agricultores</CardTitle>
                <CardDescription>Lista de todos los agricultores registrados en la plataforma</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar agricultores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agricultor</TableHead>
                    <TableHead className="hidden md:table-cell">Contacto</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Huertas</TableHead>
                    <TableHead className="hidden xl:table-cell">Última Actividad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFarmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{farmer.name}</div>
                          <div className="text-sm text-gray-500 md:hidden">{farmer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <div>{farmer.email}</div>
                          <div className="text-gray-500">{farmer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{farmer.address}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{farmer.huertas}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">{farmer.lastActivity}</TableCell>
                      <TableCell>
                        {farmer.status === "active" ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Agricultor</DialogTitle>
                              <DialogDescription>Información completa del agricultor</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label>Identificador Único</label>
                                  <p className="font-medium">{farmer.uniqueId}</p>
                                </div>
                                <div>
                                  <label>Nombre Completo</label>
                                  <p className="font-medium">{farmer.name}</p>
                                </div>
                                <div>
                                  <label>Usuario</label>
                                  <p className="font-medium">{farmer.username}</p>
                                </div>
                                <div>
                                  <label>Email</label>
                                  <p className="font-medium">{farmer.email}</p>
                                </div>
                                <div>
                                  <label>Teléfono</label>
                                  <p className="font-medium">{farmer.phone}</p>
                                </div>
                                <div>
                                  <label>Dirección</label>
                                  <p className="font-medium">{farmer.address}</p>
                                </div>
                                <div>
                                  <label>Sexo</label>
                                  <p className="font-medium capitalize">{farmer.gender}</p>
                                </div>
                                <div>
                                  <label>Fecha de Registro</label>
                                  <p className="font-medium">{farmer.registeredAt}</p>
                                </div>
                                <div>
                                  <label>Última Actividad</label>
                                  <p className="font-medium">{farmer.lastActivity}</p>
                                </div>
                                <div>
                                  <label>Estado</label>
                                  <p className="font-medium capitalize">
                                    {farmer.status === "active" ? "Activo" : "Inactivo"}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label>Huertas Registradas</label>
                                  <p className="font-medium">{farmer.huertas}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
