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
import Pagination from "@/components/ui/pagination"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { fetchInvoiceQueuesOrdered } from "@/lib/invoice-queue/api"
import { INVOICE_STATUS_OPTIONS } from "@/lib/invoice/status"
import InvoiceStatusBadge from "../facturas/queue-status-badge"

export default function Facturacion() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [invoiceQueues, setInvoiceQueues] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const [filters, setFilters] = useState({dateFrom: "", dateTo: "", queueStatus: ''})

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

  const fetchInvoiceQueues = async (page = 0) => {
    try {
      setLoading(true)
      
      const response = await fetchInvoiceQueuesOrdered(page, filters)
      setInvoiceQueues(response.content || [])
      setPagination({
        currentPage: response.pageable.pageNumber + 1,
        totalPages: response.totalPages,
        totalItems: response.totalElements,
        pageSize: response.size,
        hasNextPage: response.last === false,
        hasPreviousPage: response.pageable.pageNumber > 0,
      })     
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
        fetchInvoiceQueues(newPage - 1)     
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const applyFilters = () => {
    fetchInvoiceQueues()
  }

  const clearFilters = () => {
    const emptyFilters = {
      dateFrom: "",
      dateTo: "",
      queueStatus: '',
    }
    setFilters(emptyFilters)
  }

  const hasActiveFilters = () => {
    return filters.dateFrom || filters.dateTo || filters.queueStatus != {}
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Menú
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Cola de facturación</h1>
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Fecha desde</Label>
                <FormDatePicker
                  id="dateFrom"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo">Fecha hasta</Label>
                <FormDatePicker
                  id="dateTo"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceStatusFilter"> Estado de cola de factura</Label>
                <FormCombo
                  id="invoiceStatusFilter"
                  options={INVOICE_STATUS_OPTIONS}
                  placeholder="Todos los estados"
                  onChange={(option) => handleFilterChange("queueStatus", option?.id || null)}
                  displayKey="name"
                  valueKey="id"
                  defaultValue={filters.queueStatus.id || ""}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilters} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" /> Filtrar
              </Button>

              {hasActiveFilters() && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <X className="mr-2 h-4 w-4" /> Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : invoiceQueues.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {hasActiveFilters()
              ? "No se encontraron estados de facturación con los filtros aplicados"
              : "No hay colas de facturación"}
          </p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-600">
              Mostrando {invoiceQueues.length} de {pagination.totalItems} items
            </p>
            <p className="text-sm text-gray-600">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>
          </div>

          {/* Invoice queues list */}
          <div className="space-y-4 mb-6">
            {invoiceQueues.map((item) => (
              <Link key={item.id} href={`/cola-facturacion/${item.id}`}>
                    <Card key={item.id} className={`overflow-hidden transition-colors hover:bg-gray-50 mb-4`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
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

                                  <div>
                                  <InvoiceStatusBadge status={item.status}/>
                                  </div>
                            </div>
                        </CardContent>
                    </Card>
              </Link>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasPreviousPage={pagination.hasPreviousPage}
              hasNextPage={pagination.hasNextPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
