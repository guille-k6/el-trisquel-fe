"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, AlertTriangle, Search, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { formatDateToString, formatPrice } from "@/lib/utils"
import { fetchInvoiceQueuesOrdered } from "@/lib/invoice-queue/api"
import { INVOICE_STATUS_OPTIONS } from "@/lib/invoice/status"
import InvoiceStatusBadge from "../facturas/queue-status-badge"
import SmartPagination from "@/components/ui/smart-pagination"
import { SmartFilter } from "@/components/ui/smart-filter"

export default function Facturacion() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [invoiceQueues, setInvoiceQueues] = useState([])
  const [pagination, setPagination] = useState({
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    queueStatus: '',
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      await fetchInvoiceQueues();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los datos iniciales",
        type: "error",
        duration: 8000,
      })
    }
  }

  const fetchInvoiceQueues = async (page = 0, filters = {}) => {
    try {
      setLoading(true)
      const response = await fetchInvoiceQueuesOrdered(page, filters)
      setInvoiceQueues(response.content || [])
      setPagination(response.page)    
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar las instancias de cola de facturación",
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const applyFilters = () => {
    fetchInvoiceQueues(0, filters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      dateFrom: "",
      dateTo: "",
      queueStatus: '',
    }
    setFilters(emptyFilters)
    fetchInvoiceQueues(0, emptyFilters)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchInvoiceQueues(newPage)
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
         Volver al inicio
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-3">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Cola de facturación</h1>
      </div>

      <SmartFilter
        filtersList={[
          {
            propertyName: "dateFrom",
            displayName: "Fecha desde",
            type: "DATE",
            placeholder: "Fecha desde",
          },
          {
            propertyName: "dateTo",
            displayName: "Fecha hasta",
            type: "DATE",
            placeholder: "Fecha hasta",
          },
          {
            propertyName: "queueStatus",
            displayName: "Estado de facturación",
            type: "SELECT",
            placeholder: "Seleccionar estado",
            options: INVOICE_STATUS_OPTIONS,
          },
        ]}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        applyButtonText="Filtrar"
        clearButtonText="Limpiar"
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : invoiceQueues.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No hay instancias de cola de facturación</p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-600">
              Mostrando {invoiceQueues.length} de {pagination.totalElements} items
            </p>
            <p className="text-sm text-gray-600">
              Página {pagination.number + 1} de {pagination.totalPages}
            </p>
          </div>

          {/* Invoice queues list */}
          <div className="space-y-4 mb-6">
            {invoiceQueues.map((item) => (
              <Link key={item.id} href={`/cola-facturacion/${item.id}`}>
                    <Card key={item.id} className={`overflow-hidden transition-colors hover:bg-gray-50 mb-4`}>
                        <CardContent className="p-4">
                            <div className="flex justify-between gap-3">
                              <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">ID de factura: </Label>
                                <p className="font-medium text-blue-600">{item.invoiceId}</p>
                              </div>

                              <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">Fecha de encolado</Label>
                                <p className="font-medium">{formatDateToString(item.enqueuedAt)}</p>
                              </div>

                              <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">Intento N°</Label>
                                <p className="font-medium">{item.retryCount}</p>
                              </div>

                              <div className="min-w-[120px]">
                                <InvoiceStatusBadge status={item.status}/>
                              </div>
                            </div>
                        </CardContent>
                    </Card>
              </Link>
            ))}
          </div>
          <SmartPagination page={pagination} onPageClick={handlePageChange}/>
        </>
      )}
    </div>
  )
}
