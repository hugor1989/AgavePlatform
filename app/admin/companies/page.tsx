"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { companiService } from "@/services/companiService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogFooter,
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
  EyeOff,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"
import { alert } from "@/lib/alert"

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [isAddingCompany, setIsAddingCompany] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [editOpen, setEditOpen] = useState(false)

  const [selectedCompanyEditar, setSelectedCompanyEditar] = useState<any | null>(null)
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false)

  const [newFarmerCredentials, setNewFarmerCredentials] = useState<FarmerCredentials | null>(null)

  // Estado y funciones para cambiar contraseña
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedCompanyPassword, setSelectedCompanyPassword] = useState<any | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  //Estado OTP
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [otpTargetId, setOtpTargetId] = useState<number | string | null>(null)
  const [resendingOtp, setResendingOtp] = useState(false)

  interface FarmerCredentials {
    email: string
    password: string
    id: string | number
  }


  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    email: "",
    phone: "",
    factoryLocation: "",
    rfc: "",
    address: "",
  })

  //Obtener lista de empresas desde el servicio
  const fetchCompanies = async () => {
    try {
      const data = await companiService.getAll()

      // Mapear status numérico → texto
    const mapped = data.map((c: any) => ({
      ...c,
      status: c.status === 1 ? "active" : "inactive",
    }))

      setCompanies(mapped)
    } catch (error) {
      console.error("Error al obtener empresas:", error)

      await alert.error("No se pudieron cargar las empresas")
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  //Agregar nueva empresa usando el servicio
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingCompany(true)
    try {
      const payload = {
        business_name: newCompanyForm.name,
        email: newCompanyForm.email,
        phone: newCompanyForm.phone,
        factory_location: newCompanyForm.factoryLocation,
        rfc: newCompanyForm.rfc,
        fiscal_address: newCompanyForm.address,
        status: 1,
      }

      const response =  await companiService.create(payload)

      if(response.success){

        const credentials = response?.data?.credentials

        await fetchCompanies()


          //Cierra el diálogo de registro y abre el de credenciales
          setIsAddDialogOpen(false)
          setNewFarmerCredentials(credentials)
          setIsCredentialsDialogOpen(true)


          setNewCompanyForm({
            name: "",
            email: "",
            phone: "",
            factoryLocation: "",
            rfc: "",
            address: "",
          })
      }else{
          
          await fetchCompanies()

          await alert.error("No se pudo registrar la empresa", response.message)


          //Cierra el diálogo de registro y abre el de credenciales
          setIsAddDialogOpen(false)

          setNewCompanyForm({
            name: "",
            email: "",
            phone: "",
            factoryLocation: "",
            rfc: "",
            address: "",
          })
      }

     
      
    } catch (error) {
      console.error("Error al crear empresa:", error)
      
      setIsAddDialogOpen(false)

      await alert.error("No se pudo registrar la empresa")

      setNewCompanyForm({
            name: "",
            email: "",
            phone: "",
            factoryLocation: "",
            rfc: "",
            address: "",
          })
      
    } finally {
      setIsAddingCompany(false)
      setIsAddDialogOpen(false)

       setNewCompanyForm({
            name: "",
            email: "",
            phone: "",
            factoryLocation: "",
            rfc: "",
            address: "",
          })
    }
  }

  //Boton editar
  const handleEditClick = (company: any) => {
  setSelectedCompanyEditar(company)
  setEditOpen(true)
}

const handleUpdateCompany = async () => {
  if (!selectedCompanyEditar) return

  const payload = {
    business_name: selectedCompanyEditar.name, // o selectedCompany.business_name si el backend usa ese campo
    email: selectedCompanyEditar.email,
    rfc: selectedCompanyEditar.rfc,
    phone: selectedCompanyEditar.phone,
    factory_location: selectedCompanyEditar.factory_location,
    fiscal_address: selectedCompanyEditar.fiscal_address

  }

  try {
    await companiService.update(selectedCompanyEditar.id, payload)
    toast.success("Empresa actualizada correctamente")

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyEditar.id ? selectedCompanyEditar : c
      )
    )
    setEditOpen(false)
  } catch (error) {
    console.error("Error al actualizar empresa:", error)
    toast.error("No se pudo actualizar la empresa")
  }
}

//Cammbiar contraseña
const handleOpenPasswordDialog = (company: any) => {
  setSelectedCompanyPassword(company)
  setNewPassword("")
  setIsPasswordDialogOpen(true)
}

const handleChangePassword = async () => {
  if (!selectedCompanyPassword) return

  try {
    setChangingPassword(true)
    const payload = {
      id: selectedCompanyPassword.id,
      new_password: newPassword,
    }

    await companiService.resetPassword(payload)

    await alert.success("Contraseña actualizada correctamente", "El usuario podrá iniciar sesión con la nueva contraseña.")
    setIsPasswordDialogOpen(false)
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    await alert.error("No se pudo actualizar la contraseña", "Verifica la conexión o intenta más tarde.")
  } finally {
    setChangingPassword(false)
  }
}

  // 🔹 Cambiar estado local (puedes integrar API después si se requiere)
const handleStatusChange = async (companyId: number, newStatus: string) => {
  try {
    // Encuentra la empresa actual
    const company = companies.find((c) => c.id === companyId)
    if (!company) return await alert.error("Empresa no encontrada")

    // Prepara el payload que exige el backend
    const payload = {
      business_name: company.name, // o company.business_name si tu backend lo usa así
      email: company.email,
      status: newStatus === "active" ? 1 : 0,
    }

    // Llama al endpoint de actualización
    const response = await companiService.update(companyId, payload)

    if(response.success){

       // Actualiza estado local
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, status: newStatus } : c
      )
    )

    await alert.success(
      `Empresa marcada como ${newStatus === "active" ? "activa" : "inactiva"}`
    )

    }else{

      await alert.error(response.message)

    }
   
  } catch (error) {

    await alert.error(error.message)
  }
}

  const handleResendOtp = async (company: any) => {
    setResendingOtp(true)
    try {
      await companiService.resendOtp(company.id)
      await alert.success("Código reenviado", `Se envió un nuevo OTP al correo ${company.email}`)
      setOtpTargetId(company.id)
      setOtpCode("")
      setIsOtpDialogOpen(true)
    } catch (err: any) {
      await alert.error("No se pudo reenviar el OTP", err?.message || "Intenta más tarde.")
    } finally {
      setResendingOtp(false)
    }
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.factory_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.rfc?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  {/* Razón social */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Razón Social *</Label>
                    <Input
                      id="companyName"
                      value={newCompanyForm.name}
                      onChange={(e) =>
                        setNewCompanyForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* RFC */}
                  <div className="space-y-2">
                    <Label htmlFor="companyRfc">RFC *</Label>
                    <Input
                      id="companyRfc"
                      value={newCompanyForm.rfc}
                      maxLength={13}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                        setNewCompanyForm((prev) => ({ ...prev, rfc: value }));
                      }}
                      required
                    />
                    <small className="text-gray-500 text-xs">Máx. 13 caracteres (solo letras y números)</small>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email *</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={newCompanyForm.email}
                      onChange={(e) =>
                        setNewCompanyForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Teléfono *</Label>
                    <Input
                      id="companyPhone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={newCompanyForm.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setNewCompanyForm((prev) => ({ ...prev, phone: value }));
                      }}
                      required
                    />
                    <small className="text-gray-500 text-xs">Debe tener 10 dígitos numéricos</small>
                  </div>

                  {/* Ubicación de Fábrica */}
                  <div className="space-y-2">
                    <Label htmlFor="companyFactoryLocation">Ubicación de Fábrica *</Label>
                    <Input
                      id="companyFactoryLocation"
                      value={newCompanyForm.factoryLocation}
                      onChange={(e) =>
                        setNewCompanyForm((prev) => ({
                          ...prev,
                          factoryLocation: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* Dirección Fiscal */}
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Dirección Fiscal *</Label>
                    <Input
                      id="companyAddress"
                      value={newCompanyForm.address}
                      onChange={(e) =>
                        setNewCompanyForm((prev) => ({ ...prev, address: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Botón */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isAddingCompany}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isAddingCompany ? "Registrando..." : "Registrar Empresa"}
                  </Button>
                </div>
              </form>

            </DialogContent>
          </Dialog>

          {/*Segundo diálogo: Mostrar credenciales */}
        <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>✅ Empresa creada correctamente</DialogTitle>
              <DialogDescription>
                Aquí están las credenciales de la nueva empresa:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-4 border rounded-md p-4 bg-gray-50">
              <p><strong>Email:</strong> {newFarmerCredentials?.email}</p>
              <p><strong>Contraseña:</strong> {newFarmerCredentials?.password}</p>
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={() => setIsCredentialsDialogOpen(false)}>
                Cerrar
              </Button>
              <Button
                    onClick={() => {
                      setOtpTargetId(newFarmerCredentials?.id ?? null)
                      setOtpCode("")
                      setIsCredentialsDialogOpen(false)
                      setIsOtpDialogOpen(true)
                    }}
                    className="bg-green-600 hover:bg-green-700">
                  Verificar Código OTP
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

          {/*Diálogo para ingresar OTP */}
          <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Verificar Código de Activación</DialogTitle>
                <DialogDescription>
                  Ingresa el código OTP que la empresa te haya proporcionado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Código OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="text-center text-lg font-mono tracking-widest"
                />
              </div>

              <DialogFooter className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsOtpDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={verifying || otpCode.trim().length === 0}
                  onClick={async () => {
                    try {
                      setVerifying(true)
                      const confirmotp = {
                        user_type: "company",
                        user_id: otpTargetId,
                        code: otpCode.trim()
                      }
                      console.log(confirmotp);
                      const res = await companiService.verifyCode(confirmotp)
                      console.log(res);
                      await alert.success("Código verificado correctamente", "La empresa ha sido validado con éxito.")
                      setIsOtpDialogOpen(false)
                      await fetchCompanies()
                    } catch (err) {
                      console.error(err)
                      await alert.error("Código inválido o expirado", "Por favor verifica e intenta de nuevo.")
                    } finally {
                      setVerifying(false)
                    }
                  }}
                >
                  {verifying ? "Verificando..." : "Verificar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabla */}
        <div className="w-full max-w-[100vw] overflow-x-hidden px-2">
          <Card className="w-full overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Listado de Empresas</CardTitle>
                <CardDescription>
                  Lista completa de empresas registradas en la plataforma
                </CardDescription>
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
          <CardContent className="overflow-x-auto w-full no-scrollbar">
            <div className="w-full min-w-[600px] table-fixed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="hidden md:table-cell">Ubicación Fabrica</TableHead>
                    <TableHead className="hidden lg:table-cell">Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.business_name}</div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {company.factory_location}
                          </div>
                          <div className="text-sm text-gray-500">{company.rfc}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {company.factory_location}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          <div>{company.email}</div>
                          <div className="text-gray-500">{company.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(company.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(company)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenPasswordDialog(company)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Cambiar contraseña
                            </DropdownMenuItem>
                            {company.status === "inactive" && (
                              <DropdownMenuItem onClick={() => handleResendOtp(company)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Reenviar OTP y activar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {company.status === "active" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(company.id, "inactive")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Desactivar
                              </DropdownMenuItem>
                            )}
                            {company.status === "inactive" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(company.id, "active")}
                              >
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
        </div>
        

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar empresa</DialogTitle>
              <DialogDescription>
                Modifica los datos de la empresa seleccionada.
              </DialogDescription>
            </DialogHeader>

            {selectedCompanyEditar && (
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nombre de la empresa</label>
                  <Input
                    value={selectedCompanyEditar.business_name}
                    onChange={(e) =>
                      setSelectedCompanyEditar({
                        ...selectedCompanyEditar,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={selectedCompanyEditar.email}
                    onChange={(e) =>
                      setSelectedCompanyEditar({
                        ...selectedCompanyEditar,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                 <div className="grid gap-2">
                  <label className="text-sm font-medium">Telefono</label>
                  <Input
                    value={selectedCompanyEditar.phone}
                    onChange={(e) =>
                      setSelectedCompanyEditar({
                        ...selectedCompanyEditar,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Ubicacion Fabrica</label>
                  <Input
                    value={selectedCompanyEditar.factory_location}
                    onChange={(e) =>
                      setSelectedCompanyEditar({
                        ...selectedCompanyEditar,
                        factory_location: e.target.value,
                      })
                    }
                  />
                </div>

                 <div className="grid gap-2">
                  <label className="text-sm font-medium">Direccion Fiscal</label>
                  <Input
                    value={selectedCompanyEditar.fiscal_address}
                    onChange={(e) =>
                      setSelectedCompanyEditar({
                        ...selectedCompanyEditar,
                        fiscal_address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">RFC</label>
                  <Input
                    type="text"
                    value={selectedCompanyEditar.rfc}
                    onChange={(e) =>
                      setSelectedCompanyEditar({
                        ...selectedCompanyEditar,
                        rfc: e.target.value,
                      })
                    }
                  />
                </div>

                
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCompany}>Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Modal Detalle */}
        {selectedCompany && (
          <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedCompany.business_name}
                </DialogTitle>
                <DialogDescription>
                  Información detallada de la empresa
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedCompany.status)}
                    <span className="text-sm text-gray-500">
                      Registrada el {selectedCompany.created_at?.split("T")[0]}
                    </span>
                  </div>
                </div>

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
                        <span className="font-medium">Ubicación Fabrica:</span>{" "}
                        {selectedCompany.factory_location}
                      </div>
                      <div>
                        <span className="font-medium">Dirección:</span>{" "}
                        {selectedCompany.fiscal_address}
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

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Ingresa una nueva contraseña para la empresa{" "}
              <strong>{selectedCompanyPassword?.business_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nueva contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/*Mensaje de ayuda */}
              <p className="text-xs text-gray-500">
                La contraseña debe tener al menos <strong>6 caracteres</strong>.
              </p>

              {/*Mensaje de error opcional */}
              {newPassword && newPassword.length < 6 && (
                <p className="text-xs text-red-500">
                  La contraseña es demasiado corta.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={newPassword.length < 6 || changingPassword}
              onClick={handleChangePassword}
              className="bg-green-600 hover:bg-green-700"
            >
              {changingPassword ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      </div>
    </AppLayout>
  )
}
