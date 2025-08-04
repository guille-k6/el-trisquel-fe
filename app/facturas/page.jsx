"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Search, X, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { formatDateToString, formatPrice } from "@/lib/utils"
import Pagination from "@/components/ui/pagination"
import { fetchInvoices } from "@/lib/invoice/api"
import { fetchClients } from "@/lib/customer/api"
import { INVOICE_STATUS_OPTIONS } from "@/lib/invoice/status"
import InvoiceStatusBadge from "./queue-status-badge"

export default function FacturasListado() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    clientId: null,
    status: null,
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      await fetchInvoicesData()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los datos iniciales",
        type: "error",
        duration: 8000,
      })
    }
  }

  const fetchInvoicesData = async (page = 0) => {
    try {
      setLoading(true)
      const [response, clients] = await Promise.all([
        fetchInvoices(page, filters),
        fetchClients(),
      ])
      setClients(clients)
      setInvoices(response.content || [])
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
        description: error.message || "Error al cargar las facturas",
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchInvoicesData(newPage)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const applyFilters = () => {
    console.log(filters)
    fetchInvoicesData()
  }

  const clearFilters = () => {
    const emptyFilters = {
      dateFrom: "",
      dateTo: "",
      clientId: null,
      status: null,
    }
    setFilters(emptyFilters)
  }

  const hasActiveFilters = () => {
    return filters.dateFrom || filters.dateTo || filters.clientId || filters.status
  }

  const getSelectedClientFromFilters = () => {
    if (filters.clientId) {
      return clients.find((client) => client.id === filters.clientId)
    }
    return null
  }

  const getSelectedStatusFromFilters = () => {
    if (filters.status) {
      return statusOptions.find((status) => status.id === filters.status)
    }
    return null
  }

  const handleInvoiceClick = (invoiceId) => {
    router.push(`/facturas/${invoiceId}`)
  }

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al menú
      </Link>

      <div className="flex justify-between items-center my-3">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Listado de Facturas</h1>
        <Link href="/facturacion">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nueva factura
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
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
                <Label htmlFor="clientFilter">Cliente</Label>
                <FormCombo
                  id="clientFilter"
                  options={clients}
                  placeholder="Todos los clientes"
                  onChange={(option) => handleFilterChange("clientId", option?.id || null)}
                  displayKey="name"
                  valueKey="id"
                  defaultValue={getSelectedClientFromFilters()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusFilter">Estado</Label>
                <FormCombo
                  id="statusFilter"
                  options={INVOICE_STATUS_OPTIONS}
                  placeholder="Todos los estados"
                  onChange={(option) => handleFilterChange("status", option?.id || null)}
                  displayKey="name"
                  valueKey="id"
                  defaultValue={getSelectedStatusFromFilters()}
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
      ) : invoices.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {hasActiveFilters()
              ? "No se encontraron facturas con los filtros aplicados"
              : "No hay facturas disponibles"}
          </p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-600">
              Mostrando {invoices.length} de {pagination.totalItems} facturas
            </p>
            <p className="text-sm text-gray-600">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>
          </div>

          {/* Invoices List */}
          <div className="space-y-4 mb-6">
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="overflow-hidden transition-colors hover:bg-gray-50 cursor-pointer"
                onClick={() => handleInvoiceClick(invoice.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {invoice.comprobante.description}
                          {invoice.numero && ` N° ${invoice.numero}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {invoice.id} • {formatDateToString(invoice.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <InvoiceStatusBadge status={invoice.status} paid={invoice.paid}></InvoiceStatusBadge>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Cliente</Label>
                      <p className="font-medium text-blue-600">{invoice.client.name}</p>
                      <p className="text-sm text-gray-500">{invoice.client.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Total</Label>
                      <p className="font-bold text-lg text-green-600">{formatPrice(invoice.total)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Tipo</Label>
                      <p className="font-medium">{invoice.comprobante.description}</p>
                      <p className="text-sm text-gray-500">{invoice.concepto.description}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Punto de Venta</Label>
                      <p className="font-medium">{invoice.sellPoint}</p>
                      <p className="text-sm text-gray-500">{invoice.moneda.description}</p>
                    </div>
                  </div>

                  {invoice.comment && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Comentario</Label>
                      <p className="text-sm text-gray-600">{invoice.comment}</p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Items: {invoice.items.length}</span>
                        {invoice.cae && <span>CAE: {invoice.cae}</span>}
                        {invoice.vtoCae && <span>Vto CAE: {formatDateToString(invoice.vtoCae)}</span>}
                      </div>
                      <p className="text-xs text-gray-400">
                        Creada: {new Date(invoice.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
