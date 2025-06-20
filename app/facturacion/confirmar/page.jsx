"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calculator, FileText, History, DollarSign, AlertTriangle, Check, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchDailyBookItemsInIds } from "@/lib/daily-book/api"
import { useToast } from "@/components/ui/toast"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"

const mockPriceHistory = [
  { date: "2024-01-10", pricePerLiter: 850.5, totalAmount: 127575.0, itemsCount: 3 },
  { date: "2024-01-05", pricePerLiter: 845.0, totalAmount: 84500.0, itemsCount: 2 },
  { date: "2023-12-28", pricePerLiter: 840.25, totalAmount: 168050.0, itemsCount: 4 },
  { date: "2023-12-20", pricePerLiter: 835.75, totalAmount: 125362.5, itemsCount: 3 },
  { date: "2023-12-15", pricePerLiter: 830.0, totalAmount: 99600.0, itemsCount: 2 },
]

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

export default function BillingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [items, setItems] = useState([])
  const [client, setClient] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [productPricing, setProductPricing] = useState({})
  const [globalIVA, setGlobalIVA] = useState(21)

  // Get item IDs from URL
  const itemIds = searchParams.get("items")?.split(",").map((id) => Number.parseInt(id)) || []

  useEffect(() => {
    setLoading(true)
    if (itemIds.length > 0) {
      fetchData()
    } else {
      toast({title: "Error", description: "No se encontraron items para facturar", type: "error", duration: 8000,})
    }
  }, [])

  const fetchData = async () => {
    try {
      const searchedItems = await fetchDailyBookItemsInIds(searchParams.get("items"))
      setItems(searchedItems)
      setClient(searchedItems[0].client)
      setPriceHistory(mockPriceHistory)

      // Inicializar configuración de precios por producto
      initializeProductPricing(searchedItems)

      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.data,
        type: "error",
        duration: 8000,
      })
    }
  }

  const initializeProductPricing = (items) => {
    const groupedProducts = {}

    items.forEach((item) => {
      const productId = item.product.id
      const productName = item.product.name

      if (!groupedProducts[productId]) {
        groupedProducts[productId] = {
          id: productId,
          name: productName,
          totalQuantity: 0,
          unitPrice: mockPriceHistory.length > 0 ? mockPriceHistory[0].pricePerLiter : 0,
          ivaPercentage: 21,
        }
      }

      groupedProducts[productId].totalQuantity += item.amount
    })

    setProductPricing(groupedProducts)
  }

  const updateProductPricing = (productId, field, value) => {
    setProductPricing((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]:
          field === "totalQuantity" || field === "unitPrice" || field === "ivaPercentage"
            ? Number.parseFloat(value) || 0
            : value,
      },
    }))
  }

  const calculateSubtotal = (productId) => {
    const product = productPricing[productId]
    if (!product) return 0
    return product.totalQuantity * product.unitPrice
  }

  const calculateSubtotalWithIVA = (productId) => {
    const subtotal = calculateSubtotal(productId)
    const product = productPricing[productId]
    if (!product) return 0
    return subtotal + (subtotal * product.ivaPercentage) / 100
  }

  const getTotalAmount = () => {
    return Object.keys(productPricing).reduce((total, productId) => {
      return total + calculateSubtotalWithIVA(productId)
    }, 0)
  }

  const getTotalQuantity = () => {
    return Object.values(productPricing).reduce((total, product) => {
      return total + product.totalQuantity
    }, 0)
  }

  const applyGlobalIVA = () => {
    const updatedPricing = { ...productPricing }
    Object.keys(updatedPricing).forEach((productId) => {
      updatedPricing[productId].ivaPercentage = globalIVA
    })
    setProductPricing(updatedPricing)
  }

  const applyHistoricalPrice = (price) => {
    const updatedPricing = { ...productPricing }
    Object.keys(updatedPricing).forEach((productId) => {
      updatedPricing[productId].unitPrice = price
    })
    setProductPricing(updatedPricing)
  }

  const handleGenerateInvoice = async () => {
    const hasValidPricing = Object.values(productPricing).every(
      (product) => product.unitPrice > 0 && product.totalQuantity > 0,
    )

    if (!hasValidPricing) {
      alert("Por favor completa todos los precios y cantidades")
      return
    }

    // Aquí iría la lógica para generar la factura
    console.log("Generating invoice with:", productPricing)
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
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Telefono</Label>
              <p className="font-medium">{client.phoneNumber}</p>
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
            Elementos a facturar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Fecha</Label>
                    <p className="font-medium">{item.date}</p>
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
                    <p className="text-sm">
                      {item.voucherNumber ? `N° ${item.voucherNumber}` : item.xVoucher || "Sin remito"}
                    </p>
                  </div>
                  {item.observations && (
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Observaciones</Label>
                      <p className="text-sm text-gray-600">{item.observations}</p>
                    </div>
                  )}
                  {Number(item.payment) > 0 && (
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Pago</Label>
                      <p className="font-medium text-green-600">{item.payment}</p>
                    </div>
                  )}
                </div>
                {index < items.length - 1 && <div className="border-b border-gray-200 mt-5 mb-5" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Configuration*/}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Precios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Global IVA Configuration */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                <Label htmlFor="globalIVA" className="text-sm font-medium">IVA Global (%)</Label>
                  <FormNumberInput
                    id="globalIVA"
                    readOnly={false}
                    value={globalIVA}
                    onChange={(e) => setGlobalIVA(Number.parseFloat(e.target.value) || 0)}
                    min="0" max="9999999"
                    step="0.5"
                    className={"bg-white mt-1 w-full sm:w-32"}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={applyGlobalIVA} className="self-end w-full sm:w-32">Aplicar a todos</Button>
              </div>
            </div>

            {/* Historical Prices */}
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
                            <span className="text-sm text-gray-500">{record.date}</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {record.itemsCount} items
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium">{formatPrice(record.pricePerLiter)}/L</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applyHistoricalPrice(record.pricePerLiter)}
                              className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                            >
                              Aplicar a todos
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Product pricing*/}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuración por Producto</h3>

              {Object.values(productPricing).map((product) => (
                <Card key={product.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-6 sm:grid-cols-3 gap-4 items-end">
                      <div className="lg:col-span-1">
                        <Label className="text-xs text-gray-500 uppercase tracking-wide">Producto</Label>
                          <FormTextInput
                            readOnly={true}
                            value={product.name}
                            className="font-medium text-sm bg-white text-black" 
                          />
                      </div>
                      <div className="">
                        <Label htmlFor={`quantity-${product.id}`} className="text-xs text-gray-500 uppercase tracking-wide"> Cantidad (L)</Label>
                        <FormNumberInput
                          id={`quantity-${product.id}`}
                          readOnly={false}
                          value={product.totalQuantity}
                          onChange={(e) => updateProductPricing(product.id, "totalQuantity", e.target.value)}
                          required
                          step="1"
                          min="0" max="9999999"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${product.id}`} className="text-xs text-gray-500 uppercase tracking-wide">Precio Unitario</Label>
                        <FormNumberInput
                          id={`price-${product.id}`}
                          readOnly={false}
                          value={product.unitPrice}
                          onChange={(e) => updateProductPricing(product.id, "unitPrice", e.target.value)}
                          required
                          step="0.1"
                          min="0" max="9999999"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</Label>
                          <FormTextInput
                            readOnly={true}
                            value={formatPrice(calculateSubtotal(product.id))}
                            className="font-medium text-black"
                          />
                      </div>
                      <div>
                        <Label htmlFor={`iva-${product.id}`} className="text-xs text-gray-500 uppercase tracking-wide">IVA (%)</Label>
                        <FormNumberInput
                          id={`iva-${product.id}`}
                          readOnly={false}
                          value={product.ivaPercentage}
                          onChange={(e) => updateProductPricing(product.id, "ivaPercentage", e.target.value)}
                          step="0.5" min="0" max="100"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 uppercase tracking-wide">Subtotal c/IVA</Label>
                          <FormTextInput
                            readOnly={true}
                            value={formatPrice(calculateSubtotalWithIVA(product.id))}
                            className="mt-1 p-2 bg-green-50 rounded text-sm font-bold flex items-center text-green-800"
                          />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Summary */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Check className="h-5 w-5" />
            Resumen de Factura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Cantidad Total</p>
              <p className="text-2xl font-bold text-blue-600">{getTotalQuantity().toFixed(2)} L</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(productPricing).length}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Final</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(getTotalAmount())}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleGenerateInvoice}
          disabled={Object.values(productPricing).some((p) => p.unitPrice <= 0 || p.totalQuantity <= 0) || generating}
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

      {Object.values(productPricing).some((p) => p.unitPrice <= 0 || p.totalQuantity <= 0) && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Por favor completa todos los precios unitarios y cantidades para continuar con la facturación.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
