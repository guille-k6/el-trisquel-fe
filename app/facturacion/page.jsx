"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, AlertTriangle, Search, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { FormCheckInput } from "@/components/ui/inputs/form-check"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { Badge } from "@/components/ui/badge"
import { fetchClientsForCombo } from "@/lib/customer/api"
import { fetchInvoiceableDailyBookItems } from "@/lib/daily-book/api"
import { formatDateToString, formatPrice } from "@/lib/utils"
import SmartPagination from "@/components/ui/smart-pagination"
import { SmartFilter } from "@/components/ui/smart-filter"

export default function Facturacion() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dailyBookItems, setDailyBookItems] = useState([])
  const [clients, setClients] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [selectedClientName, setSelectedClientName] = useState("")
  const [pagination, setPagination] = useState({
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    dateFrom: "", 
    dateTo: "", 
    clientId: null
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const clientsData = await fetchClientsForCombo()
      setClients(clientsData)
      await fetchItems()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los datos iniciales",
        type: "error",
        duration: 8000,
      })
    }
  }

  const fetchItems = async (page = 0, filters = {}) => {
    try {
      setLoading(true)
      const response = await fetchInvoiceableDailyBookItems(page, filters)
      setDailyBookItems(response.content || [])
      setPagination(response.page)     
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los datos",
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchItems(newPage)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const applyFilters = () => {
    setSelectedItems([])
    setSelectedClientId(null)
    setSelectedClientName("")
    fetchItems(0, filters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      dateFrom: "",
      dateTo: "",
      clientId: null,
    }
    setFilters(emptyFilters)
    setSelectedItems([])
    setSelectedClientId(null)
    setSelectedClientName("")
    fetchItems(0, emptyFilters)
  }

  const handleItemSelection = (item, checked) => {
    if (checked) {
      if (!selectedClientId || selectedClientId === item.client.id) {
        setSelectedItems((prev) => [...prev, item.id])
        setSelectedClientId(item.client.id)
        setSelectedClientName(item.client.name)
      } else {
        toast({
          title: "Cliente cambiado",
          description: `Selección anterior eliminada. Ahora seleccionando items de ${item.client.name}`,
          type: "warning",
          duration: 5000,
        })
        setSelectedItems([item.id])
        setSelectedClientId(item.client.id)
        setSelectedClientName(item.client.name)
      }
    } else {
      const newSelectedItems = selectedItems.filter((id) => id !== item.id)
      setSelectedItems(newSelectedItems)

      if (newSelectedItems.length === 0) {
        setSelectedClientId(null)
        setSelectedClientName("")
      }
    }
  }

  const isItemSelected = (itemId) => {
    return selectedItems.includes(itemId)
  }

  const getSelectedItemsData = () => {
    return dailyBookItems.filter((item) => selectedItems.includes(item.id))
  }

  const getTotalAmount = () => {
    return getSelectedItemsData().reduce((sum, item) => sum + item.amount, 0)
  }

  const handleGenerateInvoice = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Advertencia",
        description: "Debe seleccionar al menos un item",
        type: "warning",
        duration: 5000,
      })
      return
    }
    const queryString = selectedItems.join(",");
    router.push(`/facturacion/confirmar?items=${queryString}`);
  }

  const getSelectedClientFromFilters = () => {
    if (filters.clientId) {
      return clients.find((client) => client.id === filters.clientId)
    }
    return null
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/facturas" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a facturas
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-3">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Crear factura</h1>

        {selectedItems.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge variant="secondary" className="text-sm">
              {selectedItems.length === 1 ? `${selectedItems.length} item seleccionado` : `${selectedItems.length} items seleccionados`}
            </Badge>
          </div>
        )}
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
            propertyName: "clientId",
            displayName: "Cliente",
            type: "SELECT",
            placeholder: "Seleccionar cliente",
            options: clients,
          },
        ]}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        applyButtonText="Filtrar"
        clearButtonText="Limpiar"
      />

      {selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-green-800 font-medium">
                {selectedItems.length} items seleccionados de {selectedClientName}
              </p>
              <p className="text-lg font-bold text-green-700">Total: {formatPrice(getTotalAmount())}</p>
            </div>
            <Button onClick={handleGenerateInvoice} className="bg-green-600 hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              Generar Factura
            </Button>
          </div>
        </div>
      )}

      {selectedClientId && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Solo podes seleccionar items que pertenezcan al mismo cliente.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : dailyBookItems.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron items pendientes de facturación</p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-600">
              Mostrando {dailyBookItems.length} de {pagination.totalItems} items
            </p>
            <p className="text-sm text-gray-600">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-6">
            {dailyBookItems.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden transition-colors ${
                  isItemSelected(item.id)
                    ? "bg-blue-50 border-blue-200"
                    : selectedClientId && selectedClientId !== item.client.id
                      ? "opacity-60"
                      : "hover:bg-gray-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FormCheckInput
                      id={`item-${item.id}`}
                      value={isItemSelected(item.id)}
                      onChange={(e) => handleItemSelection(item, e.target.checked)}
                      className="mt-1"
                      disabled={selectedClientId && selectedClientId !== item.client.id}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Cliente</Label>
                          <p className="font-medium text-blue-600">{item.client.name}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Fecha</Label>
                          <p className="font-medium">{formatDateToString(item.date)}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Producto</Label>
                          <p className="font-medium">{item.product.name}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Cantidad</Label>
                          <p className="font-medium">{item.amount} L</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                        <div>
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Remito</Label>
                          <p className="text-sm">
                            {item.voucherNumber ? `N° ${item.voucherNumber}` : item.xVoucher || "Sin remito"}
                          </p>
                        </div>
                        {(Number(item.payment) > 0) && (
                          <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Pago</Label>
                            <p className="font-medium text-green-600">{item.payment}</p>
                          </div>
                        )}
                        {item.observations && (
                          <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Observaciones</Label>
                            <p className="text-sm text-gray-600">{item.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <SmartPagination page={pagination} onPageChange={handlePageChange}/>
        </>
      )}
    </div>
  )
}
