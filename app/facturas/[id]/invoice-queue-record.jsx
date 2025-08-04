"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for queue records
const mockQueueData = [
  {
    id: 1,
    timestamp: "2025-07-18T21:45:09.421127Z",
    status: "QUEUED",
    message: "Factura agregada a la cola de procesamiento",
    details: "La factura fue recibida y está esperando ser procesada por AFIP",
  },
  {
    id: 2,
    timestamp: "2025-07-18T21:46:15.123456Z",
    status: "PROCESSING",
    message: "Procesando factura en AFIP",
    details: "Se está validando la información con los servicios de AFIP",
  },
  {
    id: 3,
    timestamp: "2025-07-18T21:47:22.789012Z",
    status: "ERROR",
    message: "Error en validación",
    details: "El CUIT del cliente no está registrado en AFIP",
  },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "QUEUED":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "PROCESSING":
      return <AlertCircle className="h-4 w-4 text-blue-600" />
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "ERROR":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case "QUEUED":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En Cola</Badge>
    case "PROCESSING":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Procesando</Badge>
    case "COMPLETED":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>
    case "ERROR":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("es-AR")
}

export default function InvoiceQueueRecord({ isOpen, onClose, invoiceId }) {
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
      // Mock API call - replace with actual API endpoint
      // const response = await fetch(`/api/invoices/${invoiceId}/queue-records`)
      // const data = await response.json()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use mock data for now
      setQueueRecords(mockQueueData)
    } catch (error) {
      console.error("Error fetching queue records:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Registro de Cola - Factura #{invoiceId}
          </DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : queueRecords.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No hay registros de cola disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queueRecords.map((record, index) => (
                  <Card key={record.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(record.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{record.message}</h4>
                            {getStatusBadge(record.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{record.details}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDateTime(record.timestamp)}</span>
                            <span>#{record.id}</span>
                          </div>
                        </div>
                      </div>
                      {index < queueRecords.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200"></div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
