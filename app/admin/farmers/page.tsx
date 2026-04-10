"use client"

import { useEffect, useState } from "react"
import { farmerService } from "@/services/farmerService"
import { orchardService } from "@/services/orchardService"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Building2,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  MoreHorizontal,
  CheckCircle,
  UserPlus,
  XCircle,
  Mail,
  Sprout,
} from "lucide-react"
import { alert } from "@/lib/alert"
import { useRouter } from "next/navigation"


export default function AdminFarmersPage() {
  const router = useRouter()
  const [farmers, setFarmers] = useState<any[]>([])
  const [orchardCount, setOrchardCount] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false)
  const [newFarmerCredentials, setNewFarmerCredentials] = useState<FarmerCredentials | null>(null)

  // 🔹 Estado OTP
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [otpTargetId, setOtpTargetId] = useState<number | string | null>(null)
  const [resendingOtp, setResendingOtp] = useState(false)


  const [selectedFarmer, setSelectedFarmer] = useState<any | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Editar agricultor
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: "", email: "", phone: "", address: "", gender: "" })
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Estado y funciones para cambiar contraseña
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [selectedFarmerPassword, setSelectedFarmerPassword] = useState<any | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [changingPassword, setChangingPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

  interface FarmerCredentials {
    email: string
    password: string
    unique_identifier: string | number
    id: string | number

  }
  const [newFarmerForm, setNewFarmerForm] = useState({
    name: "",
    email: "",  
    phone: "",
    address: "",
    gender: "",
  })
  const [showCredentialsAlert, setShowCredentialsAlert] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 🔹 Cargar agricultores al iniciar
  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    try {
      setIsLoading(true)
      const [farmersList, orchardsData] = await Promise.all([
        farmerService.getAll(),
        orchardService.getAll({ per_page: 1000 }),
      ])
      setFarmers(farmersList)
      const list = Array.isArray(orchardsData) ? orchardsData : (orchardsData as any)?.data ?? []
      const count: Record<number, number> = {}
      list.forEach((o: any) => { count[o.farmer_id] = (count[o.farmer_id] ?? 0) + 1 })
      setOrchardCount(count)
    } catch (err) {
      console.error("Error al cargar agricultores:", err)
      setFarmers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFarmer = async () => {
    const { name, email, phone, address, gender } = newFarmerForm
    if (!name || !email || !phone || !address || !gender) return

    try {
      const payload = {
      full_name: name,
      email,
      phone,
      address,
      gender: gender === "masculino" ? "M" : "F",
      status: 0
    }
      const response = await farmerService.create(payload)
      const credentials = response?.data?.credentials

      await fetchFarmers()

      // 🔹 Cierra el diálogo de registro y abre el de credenciales
      setIsAddDialogOpen(false)

      //Despues se muestra el mensa
      //await alert.success("Agricultor agregado correctamente", "Favor de validar OTP.")

      setNewFarmerCredentials(credentials)
      setIsCredentialsDialogOpen(true)

       setNewFarmerForm({ name: "", email: "", phone: "", address: "", gender: "" })

    } catch (err) {
      console.error("Error al crear agricultor:", err)
      
      await alert.error("No se pudo crear el agricultor.", "")

    }
  }

  //Cammbiar contraseña
const handleOpenPasswordDialog = (farmer: any) => {
  setSelectedFarmerPassword(farmer)
  setNewPassword("")
  setIsPasswordDialogOpen(true)
}

const handleChangePassword = async () => {
  if (!selectedFarmerPassword) return

  try {
    setChangingPassword(true)
    const payload = {
      id: selectedFarmerPassword.id,
      new_password: newPassword,
    }

    console.log(payload);
    const res = await farmerService.resetPassword(payload)

    console.log(res);
    await alert.success("Contraseña actualizada correctamente", "El usuario podrá iniciar sesión con la nueva contraseña.")

    setIsPasswordDialogOpen(false)
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    await alert.error("No se pudo actualizar la contraseña", "Verifica la conexión o intenta más tarde.")
  } finally {
    setChangingPassword(false)
  }
}

  const handleOpenEditDialog = (farmer: any) => {
    setSelectedFarmer(farmer)
    setEditForm({
      full_name: farmer.full_name ?? "",
      email:     farmer.email ?? "",
      phone:     farmer.phone ?? "",
      address:   farmer.address ?? "",
      gender:    farmer.gender ?? "",
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedFarmer) return
    setIsSavingEdit(true)
    try {
      await farmerService.update(selectedFarmer.id, editForm)
      await fetchFarmers()
      setIsEditDialogOpen(false)
      await alert.success("Agricultor actualizado correctamente", "")
    } catch {
      await alert.error("No se pudo actualizar el agricultor", "")
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleResendOtp = async (farmer: any) => {
    setResendingOtp(true)
    try {
      await farmerService.resendOtp(farmer.id)
      await alert.success("Código reenviado", `Se envió un nuevo OTP al correo ${farmer.email}`)
      setOtpTargetId(farmer.id)
      setOtpCode("")
      setIsOtpDialogOpen(true)
    } catch (err: any) {
      await alert.error("No se pudo reenviar el OTP", err?.message || "Intenta más tarde.")
    } finally {
      setResendingOtp(false)
    }
  }

  const filteredFarmers = farmers.filter((farmer) => {
  const name = farmer.full_name ?? ""
  const email = farmer.email ?? ""
  const address = farmer.address ?? ""

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.toLowerCase().includes(searchTerm.toLowerCase())

  return matchesSearch
})

  if (isLoading) return <p className="p-4">Cargando agricultores...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  return (
    <AppLayout type="admin">
      <div className="space-y-6">
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Agricultor</DialogTitle>
                <DialogDescription>
                  Completa la información del agricultor para generarlo en el sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nombre completo"
                  value={newFarmerForm.name}
                  onChange={(e) => setNewFarmerForm({ ...newFarmerForm, name: e.target.value })}
                />
                <Input
                  placeholder="Correo"
                  type="email"
                  value={newFarmerForm.email}
                  onChange={(e) => setNewFarmerForm({ ...newFarmerForm, email: e.target.value })}
                />
                <Input
                  placeholder="Teléfono"
                  value={newFarmerForm.phone}
                  onChange={(e) => setNewFarmerForm({ ...newFarmerForm, phone: e.target.value })}
                />
                <Input
                  placeholder="Dirección"
                  value={newFarmerForm.address}
                  onChange={(e) => setNewFarmerForm({ ...newFarmerForm, address: e.target.value })}
                />
                <select
                  value={newFarmerForm.gender}
                  onChange={(e) => setNewFarmerForm({ ...newFarmerForm, gender: e.target.value })}
                  className="border rounded-md px-3 py-2 w-full"
                >
                  <option value="">Seleccionar género...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddFarmer} className="bg-green-600 hover:bg-green-700">
                    Registrar Agricultor
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 🔹 Segundo diálogo: Mostrar credenciales */}
          <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>✅ Agricultor creado correctamente</DialogTitle>
                <DialogDescription>
                  Aquí están las credenciales del nuevo agricultor:
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 mt-4 border rounded-md p-4 bg-gray-50">
                <p><strong>Email:</strong> {newFarmerCredentials?.email}</p>
                <p><strong>Contraseña:</strong> {newFarmerCredentials?.password}</p>
                <p><strong>Identificador:</strong> {newFarmerCredentials?.unique_identifier}</p>
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

          {/* 🔹 Diálogo para ingresar OTP */}
          <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Verificar Código de Activación</DialogTitle>
                <DialogDescription>
                  Ingresa el código OTP que el agricultor te haya proporcionado.
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
                        user_type: "farmer",
                        user_id: otpTargetId,
                        code: otpCode.trim()
                      }
                      console.log(confirmotp);
                      const res = await farmerService.verifyCode(confirmotp)
                      console.log(res);
                      await alert.success("Código verificado correctamente", "El agricultor ha sido validado con éxito.")
                      setIsOtpDialogOpen(false)
                      await fetchFarmers()
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

          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cambiar contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa una nueva contraseña para la empresa{" "}
                        <strong>{selectedFarmerPassword?.full_name}</strong>
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Agricultor</DialogTitle>
            <DialogDescription>Información completa del agricultor</DialogDescription>
          </DialogHeader>

          {selectedFarmer ? (
            <div className="space-y-6">
              {/* Datos principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Identificador Único</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.unique_identifier}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Nombre Completo</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.full_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Usuario</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Teléfono</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Dirección</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.address}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Sexo</label>
                  <p className="font-semibold text-gray-800 capitalize">{selectedFarmer.gender}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Fecha de Registro</label>
                  <p className="font-semibold text-gray-800">{selectedFarmer.created_at}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Última Actividad</label>
                  <p className="font-semibold text-gray-800">NA</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Estado</label>
                  <p className="font-semibold text-gray-800 capitalize">
                    {selectedFarmer.status === 1 ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>

              {/* Huertas registradas */}
              <div className="border-t pt-4">
                <div>
                  <label className="text-sm text-gray-500">Huertas Registradas</label>
                  <p className="font-semibold text-gray-800">0</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">Cargando datos...</p>
          )}
        </DialogContent>
      </Dialog>
          {/* Dialog editar agricultor */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Editar Agricultor</DialogTitle>
                <DialogDescription>Modifica los datos de {selectedFarmer?.full_name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Input
                  placeholder="Nombre completo"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
                <Input
                  placeholder="Correo"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <Input
                  placeholder="Teléfono"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
                <Input
                  placeholder="Dirección"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="border rounded-md px-3 py-2 w-full text-sm"
                >
                  <option value="">Seleccionar género...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveEdit} disabled={isSavingEdit} className="bg-green-600 hover:bg-green-700">
                  {isSavingEdit ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Listado de Agricultores</CardTitle>
            <CardDescription>Datos obtenidos desde la API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
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
                          <div className="font-medium">{farmer.full_name}</div>
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
                        <div className="text-sm font-medium">
                          {orchardCount[farmer.id] ?? 0}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">NA</TableCell>

                       <TableCell>
                        {farmer.status === 1 ? (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                  setSelectedFarmer(farmer)
                                  setIsViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(farmer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/farmers/${farmer.id}/huertas`)}>
                              <Sprout className="h-4 w-4 mr-2" />
                              Ver Huertas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenPasswordDialog(farmer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Cambiar contraseña
                            </DropdownMenuItem>
                            {farmer.status === 0 && (
                              <DropdownMenuItem onClick={() => handleResendOtp(farmer)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Reenviar OTP y activar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {farmer.status === "active" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(farmer.id, "inactive")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Desactivar
                              </DropdownMenuItem>
                            )}
                            {farmer.status === "inactive" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(farmer.id, "active")}
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
    </AppLayout>
  )
}
