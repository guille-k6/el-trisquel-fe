"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft,FileText,User,Package,Calendar,CreditCard,Building,Phone,Mail,MapPin,Hash,Eye, Download,} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import InvoiceQueueRecord from "./invoice-queue-record"
import { fetchInvoiceById, openInvoicePdf } from "@/lib/invoice/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import InvoiceStatusBadge from "../queue-status-badge"

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price)
}

const formatDateToString = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-AR")
}

export default function InvoiceDetail({ params }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const unwrappedParams = use(params)
    const { id } = unwrappedParams
    const [loading, setLoading] = useState(true)
    const [invoice, setInvoice] = useState({
    id: '',
    date: '',
    numero: '',
    status: '',
    paid: false,
    comment: '',
    createdAt: '',
    updatedAt: '',
    sellPoint: '',
    cae: '',
    vtoCae: '',
    items: [
        {
            id: '',
            amount: '',
            product: { id: '', name: '' },
            pricePerUnit: 0,
            ivaAmount: 0,
            total: 0,
            iva: { description: '' },
        }
    ],
    client: {
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        docType: { description: '' },
        docNumber: '',
        condicionIva: { description: '' },
    },
    comprobante: {},
    concepto: {},
    moneda: {},
    })
    useEffect(() => {
        fetchInitialData(id)
    }, [])

    const fetchInitialData = async (id) => {
      try {
        setLoading(true)
        const response = await fetchInvoiceById(id)
        setInvoice(response)
      } catch (error) {
        toast({
            title: "Error",
            description: error.message || "Error al cargar la factura",
            type: "error",
            duration: 8000,
        })
      } finally {
          setLoading(false)
      }
    }

    // Calculate totals
    const importeNetoGravado = invoice.items.reduce((sum, item) => {
        return sum + item.pricePerUnit * item.amount
    }, 0)

    // Group IVA amounts by percentage
    const ivaByPercentage = invoice.items.reduce((acc, item) => {
        const percentage = item.iva.percentage
        if (!acc[percentage]) {
            acc[percentage] = 0
        }
        acc[percentage] += item.ivaAmount
        return acc
    }, {})

    if(loading) {
        return(<div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
               </div>)
    }
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/facturas" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a facturas
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">
              #{invoice.id} {invoice.comprobante.description} {invoice.numero && ` N° ${invoice.numero}`}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <InvoiceStatusBadge status={invoice.status} paid={invoice.paid}></InvoiceStatusBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Información de la Factura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Fecha</Label>
                  <p className="font-medium">{formatDateToString(invoice.date)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Tipo de Comprobante</Label>
                  <p className="font-medium">{invoice.comprobante.description}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Concepto</Label>
                  <p className="font-medium">{invoice.concepto.description}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Moneda</Label>
                  <p className="font-medium">{invoice.moneda.description}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Punto de Venta</Label>
                  <p className="font-medium">{invoice.sellPoint}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Fecha de Creación</Label>
                  <p className="font-medium">{formatDateToString(invoice.createdAt)}</p>
                </div>
              </div>
              {invoice.comment && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Comentario</Label>
                    <p className="font-medium">{invoice.comment}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Nombre</Label>
                  <Link
                    href={`/clients/${invoice.client.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline block"
                  >
                    {invoice.client.name}
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      Email
                    </Label>
                    <p className="font-medium">{invoice.client.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      Teléfono
                    </Label>
                    <p className="font-medium">{invoice.client.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    Dirección
                  </Label>
                  <p className="font-medium">{invoice.client.address}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      Documento
                    </Label>
                    <p className="font-medium">
                      {invoice.client.docType.description}: {invoice.client.docNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      Condición IVA
                    </Label>
                    <p className="font-medium">{invoice.client.condicionIva.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">ID: {item.product.id}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className="text-center sm:text-right">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Cantidad</Label>
                          <p className="font-medium">{item.amount}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Precio Unit.</Label>
                          <p className="font-medium">{formatPrice(item.pricePerUnit)}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">TOTAL NETO</Label>
                          <p className="font-medium">{formatPrice(item.pricePerUnit * item.amount)}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">{item.iva.description}</Label>
                          <p className="font-medium">{formatPrice(item.ivaAmount)}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Total</Label>
                          <p className="font-bold text-lg text-green-600">{formatPrice(item.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Importe neto gravado:</span>
                  <span className="font-medium">{formatPrice(importeNetoGravado)}</span>
                </div>
                {Object.entries(ivaByPercentage).map(([percentage, amount]) => (
                  <div key={percentage} className="flex justify-between">
                    <span className="text-gray-600">IVA {percentage}%:</span>
                    <span className="font-medium">{formatPrice(amount)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatPrice(invoice.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue Record Button */}
          <div>
            <div className="flex gap-2">
              <Button onClick={() => setIsModalOpen(true)} className="flex-[2] bg-blue-600 hover:bg-blue-700">
                <Eye className="mr-2 h-4 w-4" />
                Registro de facturación
              </Button>
              {invoice.cae && (
              <Button onClick={() => openInvoicePdf(invoice.id)} className="flex-1 bg-red-600 hover:bg-red-700">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              )}
            </div>
          </div>

          {/* Administrative Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Administrativa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Estado</Label>
                  <div className="mt-1">
                    <InvoiceStatusBadge status={invoice.status} paid={invoice.paid}></InvoiceStatusBadge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Estado de Pago</Label>
                  <p className="font-medium">{invoice.paid ? "Pagada" : "Pendiente"}</p>
                </div>
                {invoice.cae && (
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">CAE</Label>
                    <p className="font-medium">{invoice.cae}</p>
                  </div>
                )}
                {invoice.vtoCae && (
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Vencimiento CAE</Label>
                    <p className="font-medium">{formatDateToString(invoice.vtoCae)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Items</Label>
                  <p className="font-medium">{invoice.items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <InvoiceQueueRecord isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} invoiceId={invoice.id} />
    </div>
  )
}
