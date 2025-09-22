"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LayoutDashboard, Search, MessageSquare, ShoppingCart, LogOut, Bell, Menu, X, User } from "lucide-react"
import { Logo } from "@/components/logo"
import { useState } from "react"

const navigation = [
  { name: "Historias de Jima", href: "/company/dashboard", icon: LayoutDashboard },
  { name: "Comprar Huertas", href: "/company/catalog", icon: Search },
  { name: "Mis Ofertas", href: "/company/negotiations", icon: MessageSquare },
  { name: "Mis Compras", href: "/company/purchases", icon: ShoppingCart },
]

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Notificaciones simuladas
  const notifications = [
    {
      id: 1,
      title: "Contraoferta recibida",
      message: "El administrador envió una contraoferta por Huerta Los Altos",
      time: "Hace 10 min",
      type: "negotiation",
      unread: true,
    },
    {
      id: 2,
      title: "Oferta aceptada",
      message: "Tu oferta por Plantación El Mirador fue aceptada",
      time: "Hace 1 hora",
      type: "accepted",
      unread: true,
    },
    {
      id: 3,
      title: "Nueva huerta disponible",
      message: "Se agregó una nueva huerta en Jalisco",
      time: "Hace 2 horas",
      type: "catalog",
      unread: false,
    },
    {
      id: 4,
      title: "Documentación requerida",
      message: "Se requiere documentación adicional para tu compra",
      time: "Hace 3 horas",
      type: "document",
      unread: false,
    },
    {
      id: 5,
      title: "Jima programada",
      message: "Tu jima para Huerta Premium está programada",
      time: "Hace 4 horas",
      type: "harvest",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 h-16 px-6 border-b bg-white">
          <Logo />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Productores Agave</h1>
            <p className="text-xs text-gray-600">Portal Empresa</p>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b h-16">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">Portal de Empresa</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notificaciones</h3>
                    <p className="text-sm text-gray-600">{unreadCount} nuevas notificaciones</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Ver todas las notificaciones
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      E
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">Empresa Demo</p>
                      <p className="text-sm text-gray-600">empresa@demo.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/company/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Ver Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
