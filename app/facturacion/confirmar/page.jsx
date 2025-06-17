"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calculator, FileText, History, DollarSign, AlertTriangle, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data - replace with actual API calls
const mockItems = [
  {
    id: 1,
    date: "2024-01-15",
    product: { name: "Gasoil" },
    amount: 150,
    voucherNumber: "001234",
    observations: "Entrega matutina",
  },
  {
    id: 2,
    date: "2024-01-16",
    product: { name: "Nafta Super" },
    amount: 200,
    voucherNumber: "001235",
    observations: null,
  },
  {
    id: 3,
    date: "2024-01-17",
    product: { name: "Gasoil" },
    amount: 300,
    voucherNumber: "001236",
    observations: "Entrega urgente",
  },
]

const mockClient = {
  id: 1,
  name: "Transportes San Martín S.A.",
  cuit: "30-12345678-9",
  address: "Av. Libertador 1234, Buenos Aires",
}

const mockPriceHistory = [
  { date: "2024-01-10", pricePerLiter: 850.5, totalAmount: 127575.0, itemsCount: 3 },
  { date: "2024-01-05", pricePerLiter: 845.0, totalAmount: 84500.0, itemsCount: 2 },
  { date: "2023-12-28", pricePerLiter: 840.25, totalAmount: 168050.0, itemsCount: 4 },
  { date: "2023-12-20", pricePerLiter: 835.75, totalAmount: 125362.5, itemsCount: 3 },
  { date: "2023-12-15", pricePerLiter: 830.0, totalAmount: 99600.0, itemsCount: 2 },
]

export default function BillingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [pricePerLiter, setPricePerLiter] = useState("")
  const [items, setItems] = useState([])
  const [client, setClient] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  // Get item IDs from URL
  const itemIds =
    searchParams
      .get("items")
      ?.split(",")
      .map((id) => Number.parseInt(id)) || []

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter items by IDs from URL
        const selectedItems = mockItems.filter((item) => itemIds.includes(item.id))
        setItems(selectedItems)
        setClient(mockClient)
        setPriceHistory(mockPriceHistory)

        // Set last used price as default
        if (mockPriceHistory.length > 0) {
          setPricePerLiter(mockPriceHistory[0].pricePerLiter.toString())
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (itemIds.length > 0) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getTotalLiters = () => {
    return items.reduce((total, item) => total + item.amount, 0)
  }

  const getTotalAmount = () => {
    const price = Number.parseFloat(pricePerLiter) || 0
    return getTotalLiters() * price
  }

  const handleGenerateInvoice = async () => {
    if (!pricePerLiter || Number.parseFloat(pricePerLiter) <= 0) {
      alert("Por favor ingresa un precio por litro válido")
      return
    }

    setGenerating(true)
    try {
      // Simulate invoice generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would make the actual API call to generate the invoice
      console.log("Generating invoice with:", {
        items: items.map((item) => item.id),
        clientId: client.id,
        pricePerLiter: Number.parseFloat(pricePerLiter),
        totalAmount: getTotalAmount(),
      })

      // Redirect to success page or invoice view
      router.push("/facturacion/exito")
    } catch (error) {
      console.error("Error generating invoice:", error)
      alert("Error al generar la factura. Por favor intenta nuevamente.")
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (itemIds.length === 0 || items.length === 0) {
    return (
      <div className="min-h-screen p-4 max-w-6xl mx-auto">
        <Link href="/facturacion" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a facturación
        </Link>

        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron items</h1>
          <p className="text-gray-500">Los items seleccionados no están disponibles para facturación.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <Link href="/facturacion" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a facturación
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Confirmar Facturación</h1>
        <Badge variant="secondary" className="text-sm">
          {items.length} items seleccionados
        </Badge>
      </div>

      {/* Client Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Razón Social</Label>
              <p className="font-medium text-lg">{client.name}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500 uppercase tracking-wide">CUIT</Label>
              <p className="font-medium">{client.cuit}</p>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Dirección</Label>
              <p className="text-gray-700">{client.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items to Invoice */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Items a Facturar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Fecha</Label>
                    <p className="font-medium">{formatDate(item.date)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Producto</Label>
                    <p className="font-medium">{item.product.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Cantidad</Label>
                    <p className="font-medium">{item.amount} L</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Remito</Label>
                    <p className="text-sm">N° {item.voucherNumber}</p>
                  </div>
                </div>
                {item.observations && (
                  <div className="mt-3">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Observaciones</Label>
                    <p className="text-sm text-gray-600">{item.observations}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Litros:</span>
            <span className="text-xl font-bold text-blue-600">{getTotalLiters()} L</span>
          </div>
        </CardContent>
      </Card>

      {/* Price Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración de Precio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pricePerLiter">Precio por Litro</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="pricePerLiter"
                  type="number"
                  step="0.01"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(e.target.value)}
                  className="pl-8 text-lg font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            {priceHistory.length > 0 && (
              <div>
                <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="mb-3">
                  <History className="mr-2 h-4 w-4" />
                  {showHistory ? "Ocultar" : "Ver"} Historial de Precios
                </Button>

                {showHistory && (
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <div className="space-y-3">
                      {priceHistory.map((record, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-white rounded border"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {record.itemsCount} items
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium">{formatPrice(record.pricePerLiter)}/L</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPricePerLiter(record.pricePerLiter.toString())}
                              className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                            >
                              Usar precio
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Summary */}
      {pricePerLiter && Number.parseFloat(pricePerLiter) > 0 && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Check className="h-5 w-5" />
              Resumen de Facturación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Cantidad total:</span>
                <span className="font-medium">{getTotalLiters()} L</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Precio por litro:</span>
                <span className="font-medium">{formatPrice(Number.parseFloat(pricePerLiter))}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total a facturar:</span>
                <span className="font-bold text-green-700 text-xl">{formatPrice(getTotalAmount())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleGenerateInvoice}
          disabled={!pricePerLiter || Number.parseFloat(pricePerLiter) <= 0 || generating}
          className="bg-green-600 hover:bg-green-700 flex-1"
          size="lg"
        >
          {generating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Generando Factura...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generar Factura
            </>
          )}
        </Button>

        <Button variant="outline" onClick={() => router.back()} disabled={generating} size="lg">
          Cancelar
        </Button>
      </div>

      {(!pricePerLiter || Number.parseFloat(pricePerLiter) <= 0) && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Por favor ingresa un precio por litro válido para continuar con la facturación.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
