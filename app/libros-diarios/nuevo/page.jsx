"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { postNewDailyBook } from "@/lib/daily-book/api"
import { fetchVehicles } from "@/lib/vehicle/api"
import { fetchProducts } from "@/lib/product/api"
import { fetchClients } from "@/lib/customer/api"
import { fetchVouchers } from "@/lib/voucher/api"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { getTodayDateForInput } from "@/lib/utils"

export default function NewLibroDiario() {
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    vehicle: null,
    vehicleKmsBefore: 0,
    vehicleKmsAfter: 0,
    kgTankBefore: 0,
    kgTankAfter: 0,
    ltExtractedTank: 0,
    ltRemainingFlask: 0,
    ltTotalFlask: 0,
    pressureTankBefore: 0,
    pressureTankAfter: 0,
    nitrogenProvider: "",
    items: [],
  })
  const [vehicles, setVehicles] = useState([])
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [vouchers, setVouchers] = useState([])

  const nitrogenProviders = [{ id: "Air Liquide", name: "Air Liquide" }, { id: "Linde", name: "Linde" }];

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [vehiclesData, productsData, clientsData, vouchersData] = await Promise.all([
        fetchVehicles(),
        fetchProducts(),
        fetchClients(),
        fetchVouchers(),
      ])

      setVehicles(vehiclesData)
      setProducts(productsData)
      setClients(clientsData)
      setVouchers(vouchersData)
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

  // Header form fields
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle items form fields
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value
    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const addItem = () => {
    const newItem = {
      amount: 0,
      product: null,
      client: null,
      authorized: false,
    }
    setFormData({
      ...formData,
      items: [...formData.items, newItem], // Agrego item al final
    })
  }

  const removeItem = (index) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.vehicle) {
      toast({
        title: "Error",
        description: "Debe seleccionar un vehículo",
        type: "error",
        duration: 5000,
      })
      return
    }

    // Validate items
    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un item",
        type: "error",
        duration: 5000,
      })
      return
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i]
      if (!item.product || !item.client || item.amount <= 0) {
        toast({
          title: "Error",
          description: `El item #${i + 1} tiene campos incompletos o inválidos`,
          type: "error",
          duration: 5000,
        })
        return
      }
    }

    setSaving(true)

    try {
      const newLibroDiario = {
        vehicle: { id: formData.vehicle.id },
        date: formData.date,
        vehicleKmsBefore: Number(formData.vehicleKmsBefore),
        vehicleKmsAfter: Number(formData.vehicleKmsAfter),
        kgTankBefore: Number(formData.kgTankBefore),
        kgTankAfter: Number(formData.kgTankAfter),
        ltExtractedTank: Number(formData.ltExtractedTank),
        ltRemainingFlask: Number(formData.ltRemainingFlask),
        ltTotalFlask: Number(formData.ltTotalFlask),
        items: formData.items.map((item) => ({
          amount: Number(item.amount),
          product: { id: item.product.id },
          client: { id: item.client.id },
          authorized: item.authorized,
        })),
      }

      const response = await postNewDailyBook(newLibroDiario)

      toast({
        title: "Creado",
        description: "El libro diario se creó exitosamente",
        type: "success",
        duration: 7000,
      })

      // Redirect to the detail page of the newly created libro diario
      router.push(`/libros-diarios`)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al crear el libro diario",
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/libros-diarios")
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <Link href="/libros-diarios" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a libros diarios
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Libro Diario</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <FormDatePicker
              id="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>
        </div>

          <div className="mt-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Información del Vehículo</h2>
          <div className="py-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleCombo" className="block text-sm font-medium mb-1">
                  Vehículo
                </Label>
                <FormCombo
                  id="vehicleCombo"
                  options={vehicles}
                  placeholder="Vehículo..."
                  onChange={(option) => handleChange("vehicle", option)}
                  readOnly={false}
                  defaultValue={formData.vehicle}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleKmsBefore">Kilómetros Iniciales</Label>
                <FormNumberInput
                  id="vehicleKmsBefore"
                  readOnly={false}
                  value={formData.vehicleKmsBefore}
                  onChange={(e) => handleChange("vehicleKmsBefore", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleKmsAfter">Kilómetros Finales</Label>
                <FormNumberInput
                  id="vehicleKmsAfter"
                  readOnly={false}
                  value={formData.vehicleKmsAfter}
                  onChange={(e) => handleChange("vehicleKmsAfter", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Información del Tanque</h2>
          <div className="py-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="nitrogenProvider">Proveedor</Label>
                <FormCombo 
                  id="nitrogenProviderCombo" 
                  options={nitrogenProviders} 
                  placeholder="Proveedor de nitrógeno..." 
                  onChange={(option) => handleChange("nitrogenProvider", option.id)}
                  readOnly={false} 
                  defaultValue={formData.nitrogenProvider} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kgTankBefore">Peso Inicial</Label>
                <FormNumberInput
                  id="kgTankBefore"
                  readOnly={false}
                  value={formData.kgTankBefore}
                  onChange={(e) => handleChange("kgTankBefore", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kgTankAfter">Peso Final</Label>
                <FormNumberInput
                  id="kgTankAfter"
                  readOnly={false}
                  value={formData.kgTankAfter}
                  onChange={(e) => handleChange("kgTankAfter", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltExtractedTank">Litros Extraídos</Label>
                <FormNumberInput
                  id="ltExtractedTank"
                  readOnly={false}
                  value={formData.ltExtractedTank}
                  onChange={(e) => handleChange("ltExtractedTank", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressureTankBefore">Presión Inicial</Label>
                <FormNumberInput
                  id="pressureTankBefore"
                  readOnly={false}
                  value={formData.pressureTankBefore}
                  onChange={(e) => handleChange("pressureTankBefore", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressureTankAfter">Presión Final</Label>
                <FormNumberInput
                  id="pressureTankAfter"
                  readOnly={false}
                  value={formData.pressureTankAfter}
                  onChange={(e) => handleChange("pressureTankAfter", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Información de Termos</h2>
          <div className="py-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ltRemainingFlask">Litros restantes en termos</Label>
                <FormNumberInput
                  id="ltRemainingFlask"
                  readOnly={false}
                  value={formData.ltRemainingFlask}
                  onChange={(e) => handleChange("ltRemainingFlask", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltTotalFlask">Litros totales en termos</Label>
                <FormNumberInput
                  id="ltTotalFlask"
                  readOnly={false}
                  value={formData.ltTotalFlask}
                  onChange={(e) => handleChange("ltTotalFlask", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Descargas de nitrógeno</h2>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Agregar descarga
            </Button>
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-6 border rounded-lg">
              <p className="text-gray-500">No hay items registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index} className="">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Descarga #{index + 1}</h3>
                      <Button
                        type="button"
                        onClick={() => removeItem(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-client-${index}`}>Cliente</Label>
                        <FormCombo
                          id={`item-client-${index}`}
                          options={clients}
                          placeholder="Elegir cliente..."
                          onChange={(selectedOption) => handleItemChange(index, "client", selectedOption)}
                          displayKey="name"
                          valueKey="id"
                          defaultValue={item.client}
                          readOnly={false}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-product-${index}`}>Producto</Label>
                        <FormCombo
                          id={`item-product-${index}`}
                          options={products}
                          placeholder="Elegir producto..."
                          onChange={(selectedOption) => handleItemChange(index, "product", selectedOption)}
                          displayKey="name"
                          valueKey="id"
                          defaultValue={item.product}
                          readOnly={false}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-amount-${index}`}>Cantidad</Label>
                        <FormNumberInput
                          id={`item-amount-${index}`}
                          readOnly={false}
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-voucher-${index}`}>Remito</Label>
                        <FormCombo
                          id={`item-voucher-${index}`}
                          options={vouchers}
                          placeholder="Elegir remito..."
                          onChange={(selectedOption) => handleItemChange(index, "voucher", selectedOption)}
                          displayKey="name"
                          valueKey="id"
                          defaultValue={item.voucher}
                          readOnly={false}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-date-${index}`}>Fecha</Label>
                        <FormDatePicker
                          id={`item-date-${index}`}
                          readOnly={false}
                          value={getTodayDateForInput()}
                          onChange={(e) => handleItemChange(index, "date", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-payment-${index}`}>Pago</Label>
                        <FormNumberInput
                          id={`item-payment-${index}`}
                          readOnly={false}
                          value={item.payment || 0}
                          onChange={(e) => handleItemChange(index, "payment", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`item-observations-${index}`}>Observaciones</Label>
                        <FormTextInput
                          id={`item-observations-${index}`}
                          placeholder={"Ingrese observaciones..."}
                          readOnly={false}
                          value={item.observations || ""}
                          onChange={(e) => handleItemChange(index, "observations", e.target.value)}
                          className="mt-1 w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Crear Libro Diario
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
