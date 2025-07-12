import Link from "next/link"
import { Car, Package, Users, FileText, Settings, Building, BookOpen, Receipt } from "lucide-react"
import ToastHandler from "@/components/toast-handler"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Sistema de Gestión</h1>
        <p className="text-gray-600">Seleccione un módulo para comenzar</p>
      </header>

      <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-40 2xl:mx-80">
        {/* Sección ABM */}
        <section className="mb-8">
          <div className="mb-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="px-4 text-lg font-semibold text-gray-700">Administración de Datos</h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/vehiculos" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-blue-100 p-3">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Vehículos</h3>
              <p className="text-center text-sm text-gray-600">Gestione el alta, baja y modificación de vehículos</p>
            </Link>

            <Link href="/productos" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Productos</h3>
              <p className="text-center text-sm text-gray-600">Administre su inventario de productos</p>
            </Link>

            <Link href="/clientes" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-orange-100 p-3">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Clientes</h3>
              <p className="text-center text-sm text-gray-600">Administre su base de clientes</p>
            </Link>
          </div>
        </section>

        {/* Sección Configuración */}
        <section className="mb-8">
          <div className="mb-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="px-4 text-lg font-semibold text-gray-700">Configuración</h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/organizacion" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-indigo-100 p-3">
                <Building className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Organización</h3>
              <p className="text-center text-sm text-gray-600">Configure los datos de su empresa</p>
            </Link>

            <Link href="/configuracion" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <Settings className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Configuración General</h3>
              <p className="text-center text-sm text-gray-600">Ajustes generales del sistema</p>
            </Link>
          </div>
        </section>

        {/* Sección Contabilidad y Facturación */}
        <section className="mb-8">
          <div className="mb-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="px-4 text-lg font-semibold text-gray-700">Contabilidad y Facturación</h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/libros-diarios" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-purple-100 p-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Libros Diarios</h3>
              <p className="text-center text-sm text-gray-600">Consulte y gestione los registros contables diarios</p>
            </Link>

            <Link href="/facturacion" className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105">
              <div className="mb-4 rounded-full bg-emerald-100 p-3">
                <Receipt className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Facturación</h3>
              <p className="text-center text-sm text-gray-600">Genere y gestione sus facturas</p>
            </Link>
          </div>
        </section>
      </div>
      <ToastHandler />
    </main>
  )
}