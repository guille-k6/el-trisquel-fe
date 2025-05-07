import Link from "next/link"
import { Car, Package, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Sistema de Gestión</h1>
        <p className="text-gray-600">Seleccione un módulo para comenzar</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/vehiculos"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-4 rounded-full bg-blue-100 p-3">
            <Car className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">ABM Vehiculo</h2>
          <p className="text-center text-sm text-gray-600">Gestione el alta, baja y modificación de vehículos</p>
        </Link>

        <Link
          href="/productos"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">ABM Producto</h2>
          <p className="text-center text-sm text-gray-600">Administre su inventario de productos</p>
        </Link>

        <Link
          href="/clientes"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">ABM Cliente</h2>
          <p className="text-center text-sm text-gray-600">Administre su inventario de clientes</p>
        </Link>

        <Link
          href="/remitos"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">ABM Remito</h2>
          <p className="text-center text-sm text-gray-600">Administre su inventario de remitos</p>
        </Link>

        <Link
          href="/libros-diarios"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-4 rounded-full bg-purple-100 p-3">
            <BookOpen className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Libros Diarios</h2>
          <p className="text-center text-sm text-gray-600">Consulte y gestione los registros contables diarios</p>
        </Link>
      </div>
    </main>
  )
}

