"use client"

import Link from "next/link"
import { fetchDailyBooks } from "@/lib/daily-book/api"
import { ArrowLeft, Plus, Calendar, Truck, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateToString } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import { useEffect, useState } from "react"
import { fetchClientsForCombo } from "@/lib/customer/api"
import SmartPagination from "@/components/ui/smart-pagination"


export default function LibrosDiarios() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dailyBooks, setDailyBooks] = useState([])
  const [clients, setClients] = useState([])
  const [pagination, setPagination] = useState({
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    clientId: null,
    status: null,
  })

  useEffect(() => {
    fetchDailyBooksData()
  }, [])

  const fetchDailyBooksData = async (page = 0) => {
    try {
      setLoading(true)
      const [response, clients] = await Promise.all([
        fetchDailyBooks(page, filters),
        fetchClientsForCombo(),
      ])
      setClients(clients)
      setDailyBooks(response.content || [])
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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchDailyBooksData(newPage)
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Libros Diarios</h1>
        <Link href="/libros-diarios/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo libro diario
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : dailyBooks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay libros diarios registrados</p>
          <Link href="/libros-diarios/nuevo">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Agregar Libro Diario</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1">
          {dailyBooks.map((dailyBook) => (
            <Link key={dailyBook.id} href={`/libros-diarios/${dailyBook.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-semibold text-lg">Libro Diario #{dailyBook.id}</h2>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDateToString(dailyBook.date)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-gray-600">
                      <Truck className="h-4 w-4 mr-2" />
                      <span className="text-sm">Vehículo: {dailyBook.vehicle.name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Droplet className="h-4 w-4 mr-2" />
                      <span className="text-sm">Extraído: {dailyBook.ltExtractedTank} lt</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items: {dailyBook.items.length}</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dailyBook.items.slice(0, 2).map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.client.name}</span>
                          <span>
                            {item.amount} {item.product.name}
                          </span>
                        </li>
                      ))}
                      {dailyBook.items.length > 2 && (
                        <li className="text-blue-600">+ {dailyBook.items.length - 2} más...</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <SmartPagination page={pagination} onPageClick={handlePageChange}></SmartPagination>
        </div>
      )}
    </div>
  )
}
