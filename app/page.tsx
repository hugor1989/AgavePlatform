"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    console.log("🔴 Redirigiendo a /login")
    const timer = setTimeout(() => {
      router.push("/login")
    }, 100)
    
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#f0fdfa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#0d9488' }}>🔄 Redirigiendo...</h1>
      <p>Si esta pantalla permanece, hay un problema con la redirección.</p>
      <button 
        onClick={() => router.push('/login')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0d9488',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Ir a Login Manualmente
      </button>
    </div>
  )
}