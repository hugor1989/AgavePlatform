import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { InstallAppButton } from "@/components/InstallAppButton"
import { AuthProvider } from '@/hooks/useAuth' // 👈 importa tu AuthProvider


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Productores Agave - Plataforma de Comercio",
  description:
    "La plataforma líder que conecta agricultores con empresas para facilitar la compra y venta de huertas de agave. Segura, transparente y eficiente.",
  keywords: "agave, tequila, mezcal, agricultores, empresas, huertas, comercio, México",
  authors: [{ name: "Productores Agave" }],
  creator: "Productores Agave",
  publisher: "Productores Agave",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://productoresagave.com"),
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Productores Agave - Plataforma de Comercio",
    description:
      "La plataforma líder que conecta agricultores con empresas para facilitar la compra y venta de huertas de agave.",
    url: "https://productoresagave.com",
    siteName: "Productores Agave",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productores Agave - Plataforma de Comercio",
    description:
      "La plataforma líder que conecta agricultores con empresas para facilitar la compra y venta de huertas de agave.",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Productores Agave",
    startupImage: "/icon-512x512.png",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Productores Agave" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-startup-image" href="/icon-512x512.png" />
        {/* Registra el service worker — requisito para que Chrome/Android
            ofrezca instalar la app (evento beforeinstallprompt). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* ✅ Aquí envolvemos todo dentro del AuthProvider */}
          <AuthProvider>
            {children}
            <Toaster />
            <InstallAppButton />
          </AuthProvider>
        </ThemeProvider>
        
      </body>
    </html>
  )
}
