"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import {ArrowLeft,Clock,AlertCircle,CheckCircle,XCircle,FileText,Eye,EyeOff,ExternalLink,RefreshCw,Hash,LinkIcon,} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import InvoiceStatusBadge from "@/app/facturas/queue-status-badge"
import { fetchInvoiceQueueById } from "@/lib/invoice-queue/api"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
  
  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }
  
  function truncateXml(xml, maxLength = 200) {
    if(!xml) return ""
    if (xml.length <= maxLength) return xml
    return xml.substring(0, maxLength) + "..."
  }
  
  export default function Component({ params }) {
    const { toast } = useToast()
    const router = useRouter()
    const unwrappedParams = use(params)
    const { id } = unwrappedParams
    const [showFullRequest, setShowFullRequest] = useState(false)
    const [showFullResponse, setShowFullResponse] = useState(false)
    const [loading, setLoading] = useState(false)
    const [queueItem, setQueueItem] = useState({
        id: '',
        invoiceId: '',
        status: '',
        enqueuedAt: '',
        processedAt: '',
        retryCount: 0,
        afipStatus: '',
        afipCae: '',
        afipDueDateCae: '',
        errors: '',
        observations: '',
        request: '',
        response: '',
        generatedBy: null,
    })


    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
    try {
        setLoading(true)
        const response = await fetchInvoiceQueueById(id)
        setQueueItem(response)
    } catch (error) {
        toast({
        title: "Error",
        description: error.message || "Error al cargar la instsancia de cola de facturación",
        type: "error",
        duration: 8000,
        })
    } finally {
        setLoading(false)
    }
    }

  
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <Link href="/cola-facturacion" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cola de facturación
        </Link>
  
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 my-3">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">#{queueItem.id} Solicitud de facturación</h1>
            </div>
          </div>
          <div className="flex items-center">
            <InvoiceStatusBadge status={queueItem.status} />
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Queue Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Información
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">N° de solicitud</Label>
                    <p className="font-medium">#{queueItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Factura Relacionada</Label>
                    <Link
                      href={`/facturas/${queueItem.invoiceId}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      Factura #{queueItem.invoiceId}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Encolado</Label>
                    <p className="font-medium">{formatDateTime(queueItem.enqueuedAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Procesado</Label>
                    <p className="font-medium">{formatDateTime(queueItem.processedAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Estado</Label>
                    <div className="mt-1">
                      <InvoiceStatusBadge status={queueItem.status} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">N° Intento</Label>
                    <p className="font-medium">{queueItem.retryCount}</p>
                  </div>
                </div>
  
                {queueItem.generatedBy && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Generado Por</Label>
                      <Link
                        href={`/cola-facturacion/${queueItem.generatedBy}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3" />
                        Cola #{queueItem.generatedBy}
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
  
            {/* AFIP Response Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Respuesta AFIP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Estado AFIP</Label>
                    <p className="font-medium">
                      {queueItem.afipStatus === "R"
                        ? "Rechazado"
                        : queueItem.afipStatus === "A"
                          ? "Aprobado"
                          : queueItem.afipStatus || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">CAE</Label>
                    <p className="font-medium">{queueItem.afipCae || "No asignado"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Vencimiento CAE</Label>
                    <p className="font-medium">
                      {queueItem.afipDueDateCae ? formatDateTime(queueItem.afipDueDateCae) : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Errors and Observations */}
            {(queueItem.errors || queueItem.observations) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Errores y Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {queueItem.errors && (
                    <div>
                      <Label className="text-xs text-red-500 uppercase tracking-wide">Errores</Label>
                      <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 font-medium">{queueItem.errors}</p>
                      </div>
                    </div>
                  )}
                  {queueItem.observations && (
                    <div>
                      <Label className="text-xs text-yellow-600 uppercase tracking-wide">Observaciones</Label>
                      <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-800 font-medium whitespace-pre-wrap">{queueItem.observations}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
  
            {/* Request/Response Data */}
            {queueItem.request && queueItem.response && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Datos de Solicitud y Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Request */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Solicitud SOAP</Label>
                    <Button variant="outline" size="sm" onClick={() => setShowFullRequest(!showFullRequest)}>
                      {showFullRequest ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver completo
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={showFullRequest ? queueItem.request : truncateXml(queueItem.request)}
                    readOnly
                    className="font-mono text-xs min-h-[100px]"
                  />
                </div>
  
                {/* Response */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Respuesta SOAP</Label>
                    <Button variant="outline" size="sm" onClick={() => setShowFullResponse(!showFullResponse)}>
                      {showFullResponse ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver completo
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={showFullResponse ? queueItem.response : truncateXml(queueItem.response)}
                    readOnly
                    className="font-mono text-xs min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            )}
          </div>
  
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/facturas/${queueItem.invoiceId}`}>
                  <Button className="w-full bg-transparent my-2" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Factura
                  </Button>
                </Link>
                {queueItem.generatedBy && (
                  <Link href={`/cola-facturacion/${queueItem.generatedBy}`}>
                    <Button className="w-full bg-transparent my-2" variant="outline">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Ver instancia origen
                    </Button>
                  </Link>
                )}
                <Button className="w-full bg-transparent my-2" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar Procesamiento
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    )
  }