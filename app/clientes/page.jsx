"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchClients } from "@/lib/customer/api"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import SmartPagination from "@/components/ui/smart-pagination"
import { SmartFilter } from "@/components/ui/smart-filter"


export default function Clientes() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [pagination, setPagination] = useState({
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    searchText: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (page = 0, filters = {}) => {
    try {
      const response = await fetchClients(page, filters)
      setClients(response.content || [])
      setPagination(response.page)
      
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

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const applyFilters = () => {
    fetchData(0, filters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      searchText: "",
    }
    setFilters(emptyFilters)
    fetchData(0, emptyFilters)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchData(newPage)
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="flex justify-between items-center my-3">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Clientes</h1>
        <Link href="/clientes/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo cliente
          </Button>
        </Link>
      </div>

      <SmartFilter
        filtersList={[
          {
            propertyName: "searchText",
            displayName: "Nombre, número o dirección",
            type: "TEXT",
            placeholder: "Buscar por cualquier campo",
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
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No se encontraron clientes.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <Link key={client.id} href={`/clientes/${client.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg mb-2">{client.name}</h2>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Dirección:</span> {client.address}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span> {client.phoneNumber}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <SmartPagination page={pagination} onPageClick={handlePageChange}></SmartPagination>
    </div>
  )
}