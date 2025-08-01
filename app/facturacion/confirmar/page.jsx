"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {ArrowLeft, Calculator, FileText, DollarSign, AlertTriangle, Check, User, SquareGanttChartIcon as SquareChartGantt, Package, TrendingUp, Eye, EyeOff, Info, Settings, Calendar} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchDailyBookItemsInIds } from "@/lib/daily-book/api"
import { useToast } from "@/components/ui/toast"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { processNewInvoice } from "@/lib/invoice/api"
import { fetchIvas } from "@/lib/afip/api"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import ObjectViewer from "@/components/object-viewer"
import InvoiceSummary from "./invoice-summary"
import InvoiceInformation from "./invoice-information"

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
  const [date, setDate] = useState()
  const [ivas, setIvas] = useState([])

  // Get item IDs from URL
  const itemIds = searchParams.get("items")?.split(",").map((id) => Number.parseInt(id)) || []

  useEffect(() => {
    setLoading(true)
    if (itemIds.length > 0) {
      fetchData()
    } else {
      toast({
        title: "Error",
        description: "No se encontraron items para facturar",
        type: "error",
        duration: 8000,
      })
    }
  }, [])

  const fetchData = async () => {
    try {
      const searchedItems = await fetchDailyBookItemsInIds(searchParams.get("items"))
      setItems(searchedItems)
      setClient(searchedItems[0].client)
      setPriceHistory(mockPriceHistory)
      const ivas = await fetchIvas()
      setIvas(ivas)
      initializeProductPricing(searchedItems, ivas)
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: error.data || "Ocurrió un error al cargar los datos",
        type: "error",
        duration: 8000,
      })
    }
  }

  const initializeProductPricing = (items, ivaList) => {
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
          iva: ivaList.default.code,
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
          field === "totalQuantity" || field === "unitPrice" || field === "iva"
            ? Number.parseFloat(value) || 0
            : value,
      },
    }))
  }

  const applyHistoricalPrice = (price) => {
    const updatedPricing = { ...productPricing }
    Object.keys(updatedPricing).forEach((productId) => {
      updatedPricing[productId].unitPrice = price
    })
    setProductPricing(updatedPricing)
  }

  const calculateSubtotal = (productId) => {
      const product = productPricing[productId]
      if (!product) return 0
      return product.totalQuantity * product.unitPrice
  }

  const calculateSubtotalWithIVA = (productId) => {
    const subtotal = calculateSubtotal(productId)
    const product = productPricing[productId]
    const associatedIva = ivas.elements.find((iva) => iva.code === product.iva);
    return subtotal + (subtotal * associatedIva.percentage) / 100;
  }

  const handleGenerateInvoice = async () => {
    const hasValidPricing = Object.values(productPricing).every(
      (product) => product.unitPrice > 0 && product.totalQuantity > 0,
    )

    if (!hasValidPricing) {
      alert("Por favor completa todos los precios y cantidades")
      return
    }

    if (!date) {
      toast({
        title: "Faltan campos obligatorios",
        description: "Completa la fecha de la factura",
        type: "error",
        duration: 8000,
      })
      return
    }

    const invoiceInformation = {
      invoiceDate: date,
      clientId: items[0].client.id,
      dbiIds: items.map((item) => item.id),
      invoiceItems: items.map((item) => {
        const pricing = productPricing[item.product.id]
        return {
          productId: item.product.id,
          amount: item.amount,
          pricePerUnit: pricing.unitPrice,
          iva: pricing.iva,
        }
      }),
    }

    console.log("Invoice Information:", invoiceInformation)

    setGenerating(true)
    try {
      await processNewInvoice(invoiceInformation)
      router.push("/?invoice=success")
    } catch (error) {
      setGenerating(false)
      toast({
        title: "Error al generar la factura",
        description: error.data || "Ocurrió un error inesperado",
        type: "error",
        duration: 8000,
      })
      return
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando información...</p>
      </div>
    )
  }

  if (itemIds.length === 0 || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            href="/facturacion"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a facturación
          </Link>

          <div className="text-center py-16">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
              <SquareChartGantt className="h-12 w-12 text-red-400 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No se encontraron items</h1>
            <p className="text-gray-600 text-lg">Los items seleccionados no están disponibles para facturación.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/facturacion" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver a facturación
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Confirmar Facturación</h1>
              <p className="text-gray-600">Revisa y confirma los detalles antes de generar la factura</p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2 w-fit">
              <Package className="mr-2 h-4 w-4" />
              {items.length} items seleccionados
            </Badge>
          </div>
        </div>

        <div className="space-y-12">
          <InvoiceInformation items={items} client={client} />

          {/* SECCIÓN 2: CONFIGURACIÓN */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
                <p className="text-gray-600">Fecha de factura y precios de productos</p>
              </div>
            </div>

          <Card className="border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Ingresar fecha, precio y cantidades a facturar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Sección de Fecha de Factura */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Fecha de factura</h3>
                    <p className="text-sm text-gray-600">Selecciona la fecha para esta factura</p>
                  </div>
                </div>
                <FormDatePicker id="date" onChange={(e) => setDate(e.target.value)} value={date} required />
              </div>

              {/* Sección de Configuración de Precios */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Configuración de Precios</h3>
                </div>

                {/* Product Pricing */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-gray-600" />
                    Precio por Producto
                  </h4>
                  <div className="space-y-4">
                    {Object.values(productPricing).map((product) => (
                      <Card key={product.id} className="border-l-4 border-l-blue-500 border-gray-200">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-1">
                              <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Producto</Label>
                              <FormTextInput
                                readOnly={true}
                                value={product.name}
                                className="font-semibold text-sm bg-white border-gray-200 text-gray-900 mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`quantity-${product.id}`}
                                className="text-xs text-gray-500 uppercase tracking-wide font-medium"
                              >
                                Cantidad (L)
                              </Label>
                              <FormNumberInput
                                id={`quantity-${product.id}`}
                                readOnly={false}
                                value={product.totalQuantity}
                                onChange={(e) => updateProductPricing(product.id, "totalQuantity", e.target.value)}
                                required
                                step="1"
                                min="0"
                                max="9999999"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`price-${product.id}`}
                                className="text-xs text-gray-500 uppercase tracking-wide font-medium"
                              >
                                Precio Unitario
                              </Label>
                              <FormNumberInput
                                id={`price-${product.id}`}
                                readOnly={false}
                                value={product.unitPrice}
                                onChange={(e) => updateProductPricing(product.id, "unitPrice", e.target.value)}
                                required
                                step="0.1"
                                min="0"
                                max="9999999"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Subtotal</Label>
                              <FormTextInput
                                readOnly={true}
                                value={formatPrice(calculateSubtotal(product.id))}
                                className="font-semibold text-gray-900 bg-gray-50 mt-1 border-gray-200"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`iva-${product.id}`}
                                className="text-xs text-gray-500 uppercase tracking-wide font-medium"
                              >
                                IVA (%)
                              </Label>
                              <FormCombo
                                id={`iva-${product.id}`}
                                options={ivas.elements}
                                placeholder="Seleccionar IVA..."
                                onChange={(option) => updateProductPricing(product.id, "ivaCode", option.code)}
                                defaultValue={ivas.default}
                                displayKey="description"
                                valueKey="code"
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                Subtotal c/IVA
                              </Label>
                              <FormTextInput
                                readOnly={true}
                                value={formatPrice(calculateSubtotalWithIVA(product.id))}
                                className="mt-1 bg-green-50 border-green-200 text-green-800 font-bold"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* Historical Prices */}
                  {priceHistory.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <Button
                        variant="outline"
                        onClick={() => setShowHistory(!showHistory)}
                        className="mb-4 bg-white hover:bg-blue-50 border-blue-200"
                      >
                        {showHistory ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showHistory ? "Ocultar" : "Ver"} Historial de Precios
                      </Button>
                      {showHistory && (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {priceHistory.map((record, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">{record.date}</span>
                                <Badge variant="outline" className="text-xs w-fit bg-blue-50 text-blue-700 border-blue-200">
                                  {record.itemsCount} items
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="font-bold text-lg text-gray-900">{formatPrice(record.pricePerLiter)}/L</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => applyHistoricalPrice(record.pricePerLiter)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
                                >
                                  <TrendingUp className="mr-1 h-3 w-3" />
                                  Aplicar a todos
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      <ObjectViewer data={productPricing}></ObjectViewer>

          {/* RESUMEN */}
          <div className="space-y-6">
            <InvoiceSummary productPricing={productPricing} ivas={ivas}/>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGenerateInvoice}
                disabled={
                  Object.values(productPricing).some((p) => p.unitPrice <= 0 || p.totalQuantity <= 0) || generating
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {generating ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                    Generando Factura...
                  </>
                ) : (
                  <>
                    <FileText className="mr-3 h-5 w-5" />
                    Generar Factura
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={generating}
                className="flex-1 sm:flex-initial sm:min-w-[200px] py-4 text-lg font-semibold border-2 hover:bg-gray-50"
                size="lg"
              >
                Cancelar
              </Button>
            </div>

            {/* Validation Alert */}
            {Object.values(productPricing).some((p) => p.unitPrice <= 0 || p.totalQuantity <= 0) && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Por favor completa todos los precios unitarios y cantidades para continuar con la facturación.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
