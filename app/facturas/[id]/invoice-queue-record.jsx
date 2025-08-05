"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import InvoiceStatusBadge from "../queue-status-badge"
import InvoiceStatusIcon from "../queue-status-icon"
import { fetchInvoiceQueueByInvoiceId } from "@/lib/invoice-queue/api"
import { useToast } from "@/components/ui/toast"
import Link from "next/link"

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("es-AR")
}

export default function InvoiceQueueRecord({ isOpen, onClose, invoiceId }) {
  const { toast } = useToast()
  const [queueRecords, setQueueRecords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchQueueRecords()
    }
  }, [isOpen, invoiceId])

  const fetchQueueRecords = async () => {
    setLoading(true)
    try {
      const response = await fetchInvoiceQueueByInvoiceId(invoiceId)
      setQueueRecords(response || []);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6" />
            Registro de cola - Factura #{invoiceId}
          </DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : queueRecords.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <p className="text-gray-500 text-lg">No hay registros de cola disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queueRecords.map((record, index) => (
                  <Link 
                    key={record.id} 
                    href={`/cola-facturacion/${record.id}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <Card className="relative hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <InvoiceStatusIcon status={record.status} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-lg">Registro #{record.id}</h4>
                              <InvoiceStatusBadge status={record.status} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="text-base">
                                  <span className="font-medium text-gray-700">Encolado:</span>
                                  <div className="text-gray-900">{formatDateTime(record.enqueuedAt)}</div>
                                </div>
                                {record.processedAt && (
                                  <div className="text-base">
                                    <span className="font-medium text-gray-700">Procesado:</span>
                                    <div className="text-gray-900">{formatDateTime(record.processedAt)}</div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <div className="text-base">
                                  <div className="font-medium text-gray-700">Intento N°: <span className="text-gray-900">{record.retryCount}</span></div>
                                </div>
                              </div>
                            </div>

                            {record.afipCae && (
                              <div className="mb-3">
                                <div className="font-medium text-gray-700 text-base">CAE AFIP: <span className="text-gray-900 text-base">{record.afipCae}</span></div>
                                {record.afipDueDateCae && (
                                  <div className="text-sm text-gray-600">
                                    Vence: {formatDateTime(record.afipDueDateCae)}
                                  </div>
                                )}
                              </div>
                            )}

                            {record.afipStatus && (
                              <div className="mb-3">
                                <div className="font-medium text-gray-700 text-base">Estado AFIP: <span className="text-gray-900 text-base">{record.afipStatus}</span></div>
                                
                              </div>
                            )}

                            {record.errors && (
                              <div className="mb-3">
                                <span className="font-medium text-red-700 text-base">Errores:</span>
                                <div className="text-red-600 text-base">{record.errors}</div>
                              </div>
                            )}

                            {record.observations && (
                              <div className="mb-3">
                                <span className="font-medium text-yellow-700 text-base">Observaciones:</span>
                                <div className="text-yellow-600 text-base">{record.observations}</div>
                              </div>
                            )}

                            {record.generatedBy && (
                              <div className="text-sm text-gray-500">
                                Generado por el registro #{record.generatedBy}
                              </div>
                            )}
                          </div>
                        </div>
                        {index < queueRecords.length - 1 && (
                          <div className="absolute left-8 top-16 bottom-0 w-px bg-gray-200"></div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
