import Link from "next/link"
import { ArrowLeft, Plus, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const fetchVehicles = async () => {
  // In a real app, this would be: return await fetch('/api/vehicles').then(res => res.json())
  return [
    {
      id: 1,
      name: "Hilux mod 2020",
      purchaseDate: "2024-01-01T03:00:00.000+00:00",
      purchaseDatePrice: 60000,
    },
    {
      id: 2,
      name: "Ford Raptor",
      purchaseDate: "2025-03-11T03:00:00.000+00:00",
      purchaseDatePrice: 12345567,
    },
  ]
}

export default async function Vehiculos() {

  const loading = false; // TODO: idk
  const vehicles = await fetchVehicles();

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
    
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al menú
        </Link>

        <Link href="/vehiculos/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Gestión de vehículos</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay vehículos registrados</p>
          <Link href="/vehiculos/nuevo">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Agregar Vehículo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/vehiculos/${vehicle.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg mb-3">{vehicle.name}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Comprado: {formatDate(vehicle.purchaseDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-sm">Precio: {formatPrice(vehicle.purchaseDatePrice)}</span>
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