"use client"

import { useEffect, useState } from "react"
import { farmerService } from "@/services/farmerService"
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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { UserPlus, Copy, Info, CheckCircle, XCircle, Search, Eye } from "lucide-react"
import { toast } from "sonner"


export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false)
  const [newFarmerCredentials, setNewFarmerCredentials] = useState<FarmerCredentials | null>(null)

  interface FarmerCredentials {
    email: string
    password: string
    unique_identifier: string | number
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
    const farmersList = await farmerService.getAll()
    setFarmers(farmersList)
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
      status: 1
    }
      const response = await farmerService.create(payload)
      const credentials = response?.data?.credentials

      await fetchFarmers()

      toast.success("Agricultor agregado correctamente", {
        description: `${payload.full_name} se registró con éxito.`,
      })

      // 🔹 Cierra el diálogo de registro y abre el de credenciales
      setIsAddDialogOpen(false)
      setNewFarmerCredentials(credentials)
      setIsCredentialsDialogOpen(true)

    setNewFarmerForm({ name: "", email: "", phone: "", address: "", gender: "" })

    } catch (err) {
      console.error("Error al crear agricultor:", err)
      alert("No se pudo crear el agricultor.")
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
                        <div className="text-sm">
                          <div className="font-medium">0</div>
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
                                  <p className="font-medium">{farmer.unique_identifier}</p>
                                </div>
                                <div>
                                  <label>Nombre Completo</label>
                                  <p className="font-medium">{farmer.full_name}</p>
                                </div>
                                <div>
                                  <label>Usuario</label>
                                  <p className="font-medium">{farmer.email}</p>
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
                                  <p className="font-medium">{farmer.created_at}</p>
                                </div>
                                <div>
                                  <label>Última Actividad</label>
                                  <p className="font-medium">NA</p>
                                </div>
                                <div>
                                  <label>Estado</label>
                                  <p className="font-medium capitalize">
                                    {farmer.status === 1 ? "Activo" : "Inactivo"}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label>Huertas Registradas</label>
                                  <p className="font-medium">0</p>
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
    </AppLayout>
  )
}
