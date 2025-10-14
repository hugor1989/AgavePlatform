"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Plus,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

import { AppLayout } from "@/components/layouts/app-layout"


export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [isAddingCompany, setIsAddingCompany] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Tequila Premium SA de CV",
      email: "contacto@tequilapremium.com",
      phone: "+52 33 1234 5678",
      factoryLocation: "Guadalajara, Jalisco",
      rfc: "TPR123456789",
      address: "Av. Tequila 123, Guadalajara, Jalisco",
      status: "active",
      registeredAt: "2024-01-10",
      lastActivity: "2024-01-20",
      totalPurchases: 12,
      totalSpent: 8900000,
      activeOffers: 3,
      website: "https://tequilapremium.com",
    },
    {
      id: 2,
      name: "Agave Industries México",
      email: "info@agaveindustries.mx",
      phone: "+52 33 9876 5432",
      factoryLocation: "Zapopan, Jalisco",
      rfc: "AIM987654321",
      address: "Blvd. Agave 456, Zapopan, Jalisco",
      status: "active",
      registeredAt: "2024-01-08",
      lastActivity: "2024-01-19",
      totalPurchases: 9,
      totalSpent: 6700000,
      activeOffers: 2,
      website: "https://agaveindustries.mx",
    },
    {
      id: 3,
      name: "Destilería El Mirador",
      email: "ventas@elmirador.com",
      phone: "+52 33 5555 1234",
      factoryLocation: "Tequila, Jalisco",
      rfc: "DEM555123456",
      address: "Carretera Nacional Km 15, Tequila, Jalisco",
      status: "inactive",
      registeredAt: "2023-12-15",
      lastActivity: "2024-01-05",
      totalPurchases: 7,
      totalSpent: 5400000,
      activeOffers: 0,
      website: "https://elmirador.com",
    },
    {
      id: 4,
      name: "Grupo Agavero Nacional",
      email: "compras@grupoagavero.mx",
      phone: "+52 33 7777 8888",
      factoryLocation: "Guadalajara, Jalisco",
      rfc: "GAN777888999",
      address: "Torre Corporativa, Guadalajara, Jalisco",
      status: "inactive",
      registeredAt: "2024-01-18",
      lastActivity: "2024-01-18",
      totalPurchases: 0,
      totalSpent: 0,
      activeOffers: 0,
      website: "https://grupoagavero.mx",
    },
  ])

  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    email: "",
    phone: "",
    factoryLocation: "",
    rfc: "",
    address: "",
  })

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.factoryLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.rfc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingCompany(true)

    setTimeout(() => {
      const newCompany = {
        id: companies.length + 1,
        ...newCompanyForm,
        representative: newCompanyForm.factoryLocation, // Map to existing data structure
        status: "active" as const,
        registeredAt: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0],
        totalPurchases: 0,
        totalSpent: 0,
        activeOffers: 0,
      }

      setCompanies((prev) => [newCompany, ...prev])
      setNewCompanyForm({
        name: "",
        email: "",
        phone: "",
        factoryLocation: "",
        rfc: "",
        address: "",
      })
      setIsAddingCompany(false)
    }, 1500)
  }

  const handleStatusChange = (companyId: number, newStatus: string) => {
    setCompanies((prev) =>
      prev.map((company) => (company.id === companyId ? { ...company, status: newStatus } : company)),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activa
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Inactiva
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Empresas</h1>
            <p className="text-gray-600">Administra las empresas registradas en la plataforma</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Empresa</DialogTitle>
                <DialogDescription>
                  Completa la información de la empresa después de verificar su documentación
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCompany} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Razón Social *</Label>
                    <Input
                      id="companyName"
                      value={newCompanyForm.name}
                      onChange={(e) => setNewCompanyForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyRfc">RFC *</Label>
                    <Input
                      id="companyRfc"
                      value={newCompanyForm.rfc}
                      onChange={(e) => setNewCompanyForm((prev) => ({ ...prev, rfc: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email *</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={newCompanyForm.email}
                      onChange={(e) => setNewCompanyForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Teléfono *</Label>
                    <Input
                      id="companyPhone"
                      value={newCompanyForm.phone}
                      onChange={(e) => setNewCompanyForm((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyFactoryLocation">Ubicación de Fábrica *</Label>
                    <Input
                      id="companyFactoryLocation"
                      value={newCompanyForm.factoryLocation}
                      onChange={(e) => setNewCompanyForm((prev) => ({ ...prev, factoryLocation: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Dirección Fiscal *</Label>
                    <Input
                      id="companyAddress"
                      value={newCompanyForm.address}
                      onChange={(e) => setNewCompanyForm((prev) => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isAddingCompany} className="bg-green-600 hover:bg-green-700">
                    {isAddingCompany ? "Registrando..." : "Registrar Empresa"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Listado de Empresas</CardTitle>
                <CardDescription>Lista completa de empresas registradas en la plataforma</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar empresas..."
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
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="inactive">Inactivas</SelectItem>
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
                    <TableHead>Empresa</TableHead>
                    <TableHead className="hidden md:table-cell">Ubicación</TableHead>
                    <TableHead className="hidden lg:table-cell">Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden sm:table-cell">Compras</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500 md:hidden">{company.factoryLocation}</div>
                          <div className="text-sm text-gray-500">{company.rfc}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{company.factoryLocation}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          <div>{company.email}</div>
                          <div className="text-gray-500">{company.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(company.status)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm">
                          <div className="font-medium">{company.totalPurchases} compras</div>
                          <div className="text-gray-500">${(company.totalSpent / 1000000).toFixed(1)}M</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedCompany(company)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsEditingCompany(true)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {company.status === "active" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(company.id, "inactive")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Desactivar
                              </DropdownMenuItem>
                            )}
                            {company.status === "inactive" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(company.id, "active")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Company Details Modal */}
        {selectedCompany && (
          <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedCompany.name}
                </DialogTitle>
                <DialogDescription>Información detallada de la empresa</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Status and Basic Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedCompany.status)}
                    <span className="text-sm text-gray-500">Registrada el {selectedCompany.registeredAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedCompany.totalPurchases}</div>
                      <div className="text-sm text-gray-500">Compras Realizadas</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">${(selectedCompany.totalSpent / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-500">Total Invertido</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedCompany.activeOffers}</div>
                      <div className="text-sm text-gray-500">Ofertas Activas</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Información de Contacto</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Email:</span> {selectedCompany.email}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span> {selectedCompany.phone}
                      </div>
                      <div>
                        <span className="font-medium">Ubicación de Fábrica:</span> {selectedCompany.factoryLocation}
                      </div>
                      <div>
                        <span className="font-medium">Dirección:</span> {selectedCompany.address}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Información Empresarial</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">RFC:</span> {selectedCompany.rfc}
                      </div>
                      <div>
                        <span className="font-medium">Última actividad:</span> {selectedCompany.lastActivity}
                      </div>
                      <div>
                        <span className="font-medium">Estado:</span>{" "}
                        {selectedCompany.status === "active" ? "Activa" : "Inactiva"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  )
}
