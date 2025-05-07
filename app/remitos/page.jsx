import Link from "next/link"
import { fetchVouchers } from "@/lib/voucher/api"
import { ArrowLeft, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function Remitos() {
  const vouchers = await fetchVouchers()
  const loading = false // TODO: idk

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al menú
        </Link>

        <Link href="/remitos/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Remito
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Gestión de remitos</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay remitos registrados</p>
          <Link href="/remitos/nuevo">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Agregar Remito</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vouchers.map((voucher) => (
            <Link key={voucher.id} href={`/remitos/${voucher.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg mb-3">{voucher.name}</h2>
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm">Estado: </span>
                    <Badge className={`ml-2 ${voucher.invoiceable ? "bg-green-500" : "bg-yellow-500"}`}>
                      {voucher.invoiceable ? "Facturable" : "No Facturable"}
                    </Badge>
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
