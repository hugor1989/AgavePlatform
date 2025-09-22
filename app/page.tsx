"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Eye, Menu, X, Clock } from "lucide-react"
import { Logo } from "@/components/logo"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [huertas] = useState([
    {
      id: 1,
      name: "Huerta Los Altos Premium",
      location: "Tequila, Jalisco",
      agaveType: "Azul Tequilana Weber",
      year: "2020",
      age: "4 años",
      plantCount: 27627,
      images: 8,
      description: "Excelente huerta con agave de alta calidad, ideal para producción de tequila premium.",
      featured: true,
    },
    {
      id: 2,
      name: "Plantación El Mirador",
      location: "Amatitán, Jalisco",
      agaveType: "Azul Tequilana Weber",
      year: "2019",
      age: "5 años",
      plantCount: 23851,
      images: 12,
      description: "Plantación madura con excelente ubicación y acceso a carreteras principales.",
      featured: true,
    },
    {
      id: 3,
      name: "Agavera San Miguel",
      location: "Tepatitlán, Jalisco",
      agaveType: "Azul Tequilana Weber",
      year: "2021",
      age: "3 años",
      plantCount: 21026,
      images: 6,
      description: "Huerta joven con gran potencial, suelo rico en minerales.",
      featured: false,
    },
    {
      id: 4,
      name: "Hacienda Agave Real",
      location: "Zapopan, Jalisco",
      agaveType: "Azul Tequilana Weber",
      year: "2018",
      age: "6 años",
      plantCount: 19500,
      images: 10,
      description: "Agave maduro listo para cosecha, excelente calidad y rendimiento.",
      featured: false,
    },
    {
      id: 5,
      name: "Romita 6",
      location: "León, Guanajuato",
      agaveType: "Azul Tequilana Weber",
      year: "2020",
      age: "4 años",
      plantCount: 32000,
      images: 15,
      description: "Gran extensión con agave de excelente calidad en zona privilegiada.",
      featured: false,
    },
  ])

  useEffect(() => {
    // Redirect immediately to login page
    router.replace("/login")
  }, [router])

  // Show minimal loading while redirecting
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  const filteredHuertas = huertas.filter((huerta) => {
    const matchesSearch = huerta.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = yearFilter === "all" || huerta.year === yearFilter

    return matchesSearch && matchesYear
  })

  const handleViewDetails = () => {
    // Redirect to login when trying to view details
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-teal-800">Productores Agave</h1>
                <p className="text-xs text-teal-600">Plataforma de Comercio</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#catalog" className="text-gray-700 hover:text-teal-600 transition-colors">
                Catálogo
              </a>
              <a href="#about" className="text-gray-700 hover:text-teal-600 transition-colors">
                Nosotros
              </a>
              <a href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">
                Contacto
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col gap-4 mt-4">
                <a href="#catalog" className="text-gray-700 hover:text-teal-600 transition-colors">
                  Catálogo
                </a>
                <a href="#about" className="text-gray-700 hover:text-teal-600 transition-colors">
                  Nosotros
                </a>
                <a href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">
                  Contacto
                </a>
                <div className="mt-4">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 w-full" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 text-center">
        <div className="mb-6 md:mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4 md:mb-6">Productores Agave</h1>
          <p className="text-lg md:text-xl text-teal-700 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            La plataforma líder que conecta agricultores con empresas para facilitar la compra y venta de huertas de
            agave. Segura, transparente y eficiente.
          </p>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="bg-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-800 mb-4">Catálogo de Huertas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra selección de huertas de agave disponibles. Para ver detalles completos y hacer ofertas,
              inicia sesión en tu cuenta.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 md:mb-8">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            {/* Year Filter with Orange Border */}
            <div className="relative max-w-2xl mx-auto">
              <div
                className="relative bg-white rounded-lg p-6 shadow-sm"
                style={{
                  border: "3px solid #f97316",
                  borderRadius: "20px",
                }}
              >
                <h3 className="text-center text-gray-600 font-medium mb-4">Buscar por año</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {["2025", "2024", "2023", "2022", "2021", "2020"].map((year) => (
                    <button
                      key={year}
                      onClick={() => setYearFilter(year === yearFilter ? "all" : year)}
                      className={`px-4 py-2 text-lg font-medium transition-colors ${
                        yearFilter === year
                          ? "text-teal-600 border-b-2 border-teal-600"
                          : "text-gray-600 hover:text-teal-600"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                {yearFilter !== "all" && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setYearFilter("all")}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Mostrar todos los años
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Catalog Grid - Full Width Cards */}
          <div className="grid gap-6 md:gap-8">
            {filteredHuertas.map((huerta) => (
              <Card key={huerta.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="relative w-full lg:w-80 h-48 lg:h-64">
                      <Image src="/agave-field-plantation.png" alt={huerta.name} fill className="object-cover" />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {huerta.images} fotos
                      </div>
                      {huerta.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Destacada</Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <div>
                          <h3 className="text-lg lg:text-xl font-semibold mb-1">{huerta.name}</h3>
                        </div>
                        <Badge variant="default" className="mt-2 sm:mt-0 self-start">
                          Disponible
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="truncate">Tipo: {huerta.agaveType}</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Año: {huerta.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>Edad: {huerta.age}</span>
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <span className="font-medium text-teal-600">
                            Cantidad de Plantas: {huerta.plantCount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 text-sm lg:text-base line-clamp-2">{huerta.description}</p>

                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={handleViewDetails}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Huerta
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHuertas.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron huertas</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}

          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-600 mb-4">¿Quieres ver más detalles y hacer ofertas?</p>
            <Button className="bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-800 mb-4">Acerca de Nosotros</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Somos la plataforma líder en México para la comercialización de huertas de agave. Conectamos de manera
            segura y transparente a productores con empresas, facilitando transacciones confiables en el sector agavero.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <Card className="border-teal-200 hover:shadow-lg transition-shadow text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-teal-600">Cobertura Nacional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Presencia en los principales estados productores de agave: Jalisco, Nayarit, Guanajuato, Michoacán y
                más.
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 hover:shadow-lg transition-shadow text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-teal-600">Proceso Transparente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Información detallada de cada huerta, verificación de calidad y proceso de negociación transparente.
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 hover:shadow-lg transition-shadow text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-teal-600">Experiencia Comprobada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Años de experiencia en el sector agavero, conocimiento profundo del mercado y relaciones sólidas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Interesado en nuestros servicios?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8">
            Nuestro equipo se encarga de todo el proceso de registro y verificación
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent"
              asChild
            >
              <a href="mailto:info@productoresagave.com">Contactar Equipo</a>
            </Button>
            <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100" asChild>
              <Link href="/login">Acceder a Plataforma</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-teal-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" />
                <div>
                  <h3 className="text-xl font-bold">Productores Agave</h3>
                  <p className="text-teal-200 text-sm">Plataforma de Comercio</p>
                </div>
              </div>
              <p className="text-teal-200 mb-4">
                Conectamos agricultores con empresas para facilitar la compra y venta de huertas de agave de manera
                segura y transparente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-teal-200">
                <li>
                  <a href="#catalog" className="hover:text-white transition-colors">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Nosotros
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-teal-200 text-sm">
                <li>📧 info@productoresagave.com</li>
                <li>📞 +52 (33) 1234-5678</li>
                <li>🕒 Lun-Vie 9:00-18:00</li>
                <li>📍 Guadalajara, Jalisco</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-teal-700 mt-8 pt-8 text-center">
            <p className="text-teal-200">© 2024 Productores Agave. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
