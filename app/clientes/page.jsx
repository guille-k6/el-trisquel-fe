import Link from "next/link"
import { fetchClients } from "@/lib/customer/api"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


export default async function Clientes() {
  const clients = await fetchClients()
  const loading = false // TODO: idk

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al menú
        </Link>

        <Link href="/clientes/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Gestión de clientes</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay clientes registrados</p>
          <Link href="/clientes/nuevo">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Agregar Cliente</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <Link key={client.id} href={`/clientes/${client.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg mb-2">{client.name}</h2>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Dirección:</span> {client.address}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {client.phoneNumber}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}