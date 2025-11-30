"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NavbarClient() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v)

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setIsMobileMenuOpen(false)
      router.replace("/login") // o "/"
      router.refresh()
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 100 100" className="text-blue-600" fill="currentColor">
                <path d="M50 10 C30 10, 15 25, 15 45 C15 55, 20 64, 28 70 L35 65 C30 61, 27 53, 27 45 C27 32, 37 22, 50 22 C55 22, 60 24, 64 27 L69 20 C62 14, 56 10, 50 10 Z" />
                <path d="M85 45 C85 25, 70 10, 50 10 C40 10, 31 15, 25 22 L30 29 C34 24, 42 21, 50 21 C63 21, 73 31, 73 44 C73 49, 71 54, 68 58 L75 63 C81 56, 85 51, 85 45 Z" />
                <path d="M50 90 C70 90, 85 75, 85 55 C85 45, 80 36, 72 30 L65 35 C70 39, 73 47, 73 55 C73 68, 63 78, 50 78 C45 78, 40 76, 36 73 L31 80 C38 86, 44 90, 50 90 Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">El Trisquel</span>
              <span className="text-xs text-gray-600 hidden sm:block">Sistema de Gestión</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              Inicio
            </Link>
            <Link href="/libros-diarios" className="text-gray-600 hover:text-gray-800 transition-colors">
              Libros diarios
            </Link>
            <Link href="/facturacion" className="text-gray-600 hover:text-gray-800 transition-colors">
              Facturación
            </Link>
            <Link href="/clientes" className="text-gray-600 hover:text-gray-800 transition-colors">
              Clientes
            </Link>

            <button onClick={logout} className="text-gray-600 hover:text-gray-800 transition-colors">
              Cerrar sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-md transition-colors"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/libros-diarios"
                className="block px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Libros diarios
              </Link>
              <Link
                href="/facturacion"
                className="block px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Facturación
              </Link>
              <Link
                href="/clientes"
                className="block px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Clientes
              </Link>

              <button
                onClick={logout}
                className="w-full text-left block px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
