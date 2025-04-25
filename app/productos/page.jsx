import Link from "next/link"
import { fetchProducts } from "@/lib/product/api"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


export default async function Productos() {
  const products = await fetchProducts()

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al menú
        </Link>

        <Link href="/productos/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Gestión de productos</h1>

      {products.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay productos registrados</p>
          <Link href="/productos/nuevo">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Agregar Producto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <Link key={product.id} href={`/productos/${product.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}