"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Menu,
  Building2,
  Sprout,
  DollarSign,
  CheckCircle,
  Bell,
  Settings,
  LogOut,
  User,
  X,
  LayoutDashboard,
  MessageSquare,
  Search,
  ShoppingCart,
  Video,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { useAuth } from '@/hooks/useAuth'

type LayoutType = "admin" | "company" | "farmer"

interface AppLayoutProps {
  type: LayoutType
  children: React.ReactNode
}

// --- Navegaciones por tipo ---
const NAVIGATION: Record<LayoutType, { name: string; href: string; icon: any }[]> = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Agricultores", href: "/admin/farmers", icon: User },
    { name: "Empresas", href: "/admin/companies", icon: Building2 },
    { name: "Huertas", href: "/admin/huertas", icon: Sprout },
    { name: "Ofertas", href: "/admin/ofertas", icon: DollarSign },
    { name: "Huertas Vendidas", href: "/admin/huertas-vendidas", icon: CheckCircle },
    { name: "Jimas Terminada", href: "/admin/jimas-terminadas", icon: CheckCircle },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
  ],
  company: [
    { name: "Historias de Jima", href: "/company/dashboard", icon: LayoutDashboard },
    { name: "Comprar Huertas", href: "/company/catalog", icon: Search },
    { name: "Mis Ofertas", href: "/company/negotiations", icon: MessageSquare },
    { name: "Jimas Terminada", href: "/company/jimas-terminadas", icon: CheckCircle },
    { name: "Mis Compras", href: "/company/purchases", icon: ShoppingCart },

  ],
  farmer: [
    { name: "Historias de Jima", href: "/farmer/dashboard", icon: Home },
    { name: "Catálogo Huertas", href: "/farmer/catalog", icon: Search },
    { name: "Mis Huertas", href: "/farmer/huertas", icon: Sprout },
    { name: "Ofertas", href: "/farmer/offers", icon: DollarSign },
    { name: "Huertas Vendidas", href: "/farmer/sold", icon: ShoppingCart },
    { name: "Jimas Terminada", href: "/farmer/jimas-terminadas", icon: CheckCircle },

  ],
}

// --- Config visual por tipo ---
const TITLES: Record<LayoutType, string> = {
  admin: "Panel de Administración",
  company: "Portal de Empresa",
  farmer: "Portal de Agricultor",
}

const SUBTITLES: Record<LayoutType, string> = {
  admin: "",
  company: "",
  farmer: "",
}

const ACTIVE_COLOR: Record<LayoutType, string> = {
  admin: "bg-green-50 text-green-700 border-green-600",
  company: "bg-teal-50 text-teal-700 border-teal-600",
  farmer: "bg-teal-50 text-teal-700 border-teal-600",
}

export function AppLayout({ type, children }: AppLayoutProps) {
  const pathname = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()


  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const navigation = NAVIGATION[type]

  const handleLogout = async () => {
    await logout() // 🧹 limpia localStorage y user del contexto
    pathname.push('/login') //redirige al login
  }

  React.useEffect(() => {
  if (typeof window !== 'undefined') {
    setEmail(localStorage.getItem('auth_email'));
    setName(localStorage.getItem('auth_name'));
    setRole(localStorage.getItem('auth_role'));
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fondo móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 h-16 px-6 border-b bg-white">
          <Logo />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Productores Agave</h1>
            <p className="text-xs text-gray-600">{SUBTITLES[type]}</p>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navegación */}
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
                        ? `${ACTIVE_COLOR[type]} border-r-2`
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">{TITLES[type]}</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notificaciones (simple para todos los tipos) */}
              <Link href={`/${type}/notifications`}>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center p-0">
                    3
                  </Badge>
                </Button>
              </Link>

              {/* Menú usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {type === "admin" ? "AD" : type === "company" ? "E" : "A"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none capitalize">{name ?? type}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {email ?? `${type}@productoresagave.com`}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${type}/profile`} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Contenido de página */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
