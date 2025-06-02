"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchDailyBookById, deleteDailyBook, postNewDailyBook, fetchLatestVoucherNumber, fetchLatestXVoucher } from "@/lib/daily-book/api"
import { fetchVehicles } from "@/lib/vehicle/api"
import { fetchProducts } from "@/lib/product/api"
import { fetchClients } from "@/lib/customer/api"
import { ArrowLeft, Save, Edit, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DeleteWithModal } from "@/components/ui/delete-with-modal"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormCheckInput } from "@/components/ui/inputs/form-check"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { getTodayDateForInput } from "@/lib/utils"

export default function LibroDiarioDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = use(params)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    date: "",
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
  const [formDataCopy, setFormDataCopy] = useState({})
  const [latestVoucherNumberCopy, setLatestVoucherNumberCopy] = useState()
  const [latestXVoucherCopy, setLatestXVoucherCopy] = useState()
  const [vehicles, setVehicles] = useState([])
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [foundDailyBook, setFoundDailyBook] = useState(true)
  const [latestVoucherNumber, setLastVoucherNumber] = useState() // Fetch once, then I handle myself the increment or decrement
  const [latestXVoucher, setLatestXVoucher] = useState()

  const nitrogenProviders = [{ id: "Air Liquide", name: "Air Liquide" }, { id: "Linde", name: "Linde" }];
  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [libroDiarioData, vehiclesData, productsData, clientsData, latestVoucherNumber, latestXVoucher] = await Promise.all([
        fetchDailyBookById(id),
        fetchVehicles(),
        fetchProducts(),
        fetchClients(),
        fetchLatestVoucherNumber(),
        fetchLatestXVoucher()
      ])

      if(libroDiarioData !== null && libroDiarioData.items !== null) {
        libroDiarioData.items.forEach(item => {
          item.isXVoucher = false;
          if (item.voucherNumber === null && item.xVoucher !== null) {
            item.isXVoucher = true;
          }
        });
      }
      setFormData({
        id: libroDiarioData.id,
        date: libroDiarioData.date,
        vehicle: libroDiarioData.vehicle,
        vehicleKmsBefore: libroDiarioData.vehicleKmsBefore,
        vehicleKmsAfter: libroDiarioData.vehicleKmsAfter,
        kgTankBefore: libroDiarioData.kgTankBefore,
        kgTankAfter: libroDiarioData.kgTankAfter,
        pressureTankBefore: libroDiarioData.pressureTankBefore,
        pressureTankAfter: libroDiarioData.pressureTankAfter,
        ltExtractedTank: libroDiarioData.ltExtractedTank,
        ltRemainingFlask: libroDiarioData.ltRemainingFlask,
        ltTotalFlask: libroDiarioData.ltTotalFlask,
        nitrogenProvider: libroDiarioData.nitrogenProvider,
        items: libroDiarioData.items || [],
      })

      setVehicles(vehiclesData)
      setProducts(productsData)
      setClients(clientsData)
      setLastVoucherNumber(latestVoucherNumber)
      setLatestXVoucher(latestXVoucher)
    } catch (error) {
      setFoundDailyBook(false)
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

  const handleIsXVoucher = (e, index) => {
    const updatedItems = [...formData.items]
    updatedItems[index].isXVoucher = e.target.checked;
    if(e.target.checked) {
      updatedItems[index].voucherNumber = null;
      if(updatedItems[index].addedLocally === true) {
        let newLatestXVoucherNumber = latestXVoucher.split("-")[1];
        newLatestXVoucherNumber = parseInt(newLatestXVoucherNumber) + 1;
        newLatestXVoucherNumber = "X-" + newLatestXVoucherNumber;
        setLatestXVoucher(newLatestXVoucherNumber);
        updatedItems[index].xVoucher = newLatestXVoucherNumber;
        setLastVoucherNumber((prev) => prev - 1);
      }
    } else {
      updatedItems[index].xVoucher = null;
      if(updatedItems[index].addedLocally === true) {
        const newLatestVoucherNumber = latestVoucherNumber + 1;
        setLastVoucherNumber(newLatestVoucherNumber);
        updatedItems[index].voucherNumber = newLatestVoucherNumber;
        let lastXVoucherNumber = latestXVoucher.split("-")[1];
        lastXVoucherNumber = parseInt(lastXVoucherNumber) - 1;
        setLatestXVoucher("X-" + lastXVoucherNumber);
      }
    }
    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const addItem = () => {
    const newVoucherNumber = latestVoucherNumber + 1;
    setLastVoucherNumber(newVoucherNumber);
    const newItem = {
      id: null,
      amount: 0,
      product: {},
      client: {},
      authorized: false,
      addedLocally: true,
      voucherNumber: newVoucherNumber
    }
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    })
  }

  const removeItem = (index) => {
    const updatedItems = [...formData.items]
    if(updatedItems[index].addedLocally === true) {
      // Vouchers logic
      if (updatedItems[index].voucherNumber !== null) {
        // The item has a voucher number, so we decrement the last voucher number
        setLastVoucherNumber((prev) => prev - 1);
      } else if (updatedItems[index].xVoucher !== null) {
        // The item has an X voucher, so we decrement the last X voucher number
        let lastXVoucherNumber = latestXVoucher.split("-")[1];
        lastXVoucherNumber = parseInt(lastXVoucherNumber) - 1;
        setLatestXVoucher("X-" + lastXVoucherNumber); 
      }
    }
    updatedItems.splice(index, 1)
    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Prepare data for API
      const updatedLibroDiario = {
        id: formData.id,
        vehicle: { id: formData.vehicle.id },
        date: formData.date,
        vehicleKmsBefore: Number(formData.vehicleKmsBefore),
        vehicleKmsAfter: Number(formData.vehicleKmsAfter),
        kgTankBefore: Number(formData.kgTankBefore),
        kgTankAfter: Number(formData.kgTankAfter),
        pressureTankBefore: Number(formData.pressureTankBefore),
        pressureTankAfter: Number(formData.pressureTankAfter),
        ltExtractedTank: Number(formData.ltExtractedTank),
        ltRemainingFlask: Number(formData.ltRemainingFlask),
        ltTotalFlask: Number(formData.ltTotalFlask),
        nitrogenProvider: formData.nitrogenProvider,
        items: formData.items.map((item) => ({
          id: item.id,
          amount: Number(item.amount),
          product: { id: item.product.id },
          client: { id: item.client.id },
          authorized: item.authorized,
          voucher: item.voucher,
          date: item.date,
          payment: Number(item.payment),
          observations: item.observations
        })),
      }
      await postNewDailyBook(updatedLibroDiario)
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "El libro diario se actualizó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el libro diario",
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      await deleteDailyBook(id)
      router.push("/libros-diarios")
      toast({
        title: "Eliminado",
        description: "El libro diario se eliminó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el libro diario",
        type: "error",
        duration: 7000,
      })
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    // Deffensive copy of the original state of the formData before entenring the edition stage
    const originalFormData = JSON.parse(JSON.stringify(formData));
    const originalLatestVoucherNumber = latestVoucherNumber;
    const originalLatestXVoucher = latestXVoucher;
    setFormDataCopy(originalFormData);
    setLatestVoucherNumberCopy(originalLatestVoucherNumber);
    setLatestXVoucherCopy(originalLatestXVoucher);
    setIsEditing(true)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    // Restoring formData to its original state before entering in edition
    setFormData({...formDataCopy})
    setLastVoucherNumber(latestVoucherNumberCopy)
    setLatestXVoucher(latestXVoucherCopy)
    setFormDataCopy({})
    setLatestVoucherNumberCopy(null)
    setLatestXVoucherCopy(null)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!foundDailyBook) {
    return (
      <div className="min-h-screen p-4">
        <Link href="/libros-diarios" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a libros diarios
        </Link>
        <div className="text-center py-10">
          <p className="text-red-500">Libro diario no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <Link href="/libros-diarios" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a libros diarios
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Editar Libro Diario" : `Libro Diario #${formData.id}`}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <FormDatePicker
              id="date"
              readOnly={!isEditing}
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Vehículo</h2>
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
                  value={formData.vehicleKmsBefore}
                  onChange={(e) => handleChange("vehicleKmsBefore", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleKmsAfter">Kilómetros Finales</Label>
                <FormNumberInput
                  id="vehicleKmsAfter"
                  readOnly={!isEditing}
                  value={formData.vehicleKmsAfter}
                  onChange={(e) => handleChange("vehicleKmsAfter", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Tanque</h2>
          <div className="py-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="nitrogenProvider">Proveedor</Label>
                <FormCombo 
                  id="nitrogenProviderCombo" 
                  options={nitrogenProviders} 
                  placeholder="Proveedor de nitrógeno..." 
                  onChange={(option) => handleChange("nitrogenProvider", option.id)}
                  readOnly={!isEditing} 
                  defaultValue={formData.nitrogenProvider} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kgTankBefore">Peso Inicial</Label>
                <FormNumberInput
                  id="kgTankBefore"
                  readOnly={!isEditing}
                  value={formData.kgTankBefore}
                  onChange={(e) => handleChange("kgTankBefore", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kgTankAfter">Peso Final</Label>
                <FormNumberInput
                  id="kgTankAfter"
                  readOnly={!isEditing}
                  value={formData.kgTankAfter}
                  onChange={(e) => handleChange("kgTankAfter", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltExtractedTank">Litros Extraídos</Label>
                <FormNumberInput
                  id="ltExtractedTank"
                  readOnly={!isEditing}
                  value={formData.ltExtractedTank}
                  onChange={(e) => handleChange("ltExtractedTank", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressureTankBefore">Presión Inicial</Label>
                <FormNumberInput
                  id="pressureTankBefore"
                  readOnly={!isEditing}
                  value={formData.pressureTankBefore}
                  onChange={(e) => handleChange("pressureTankBefore", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressureTankAfter">Presión Final</Label>
                <FormNumberInput
                  id="pressureTankAfter"
                  readOnly={!isEditing}
                  value={formData.pressureTankAfter}
                  onChange={(e) => handleChange("pressureTankAfter", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Termos</h2>
          <div className="py-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ltRemainingFlask">Litros restantes</Label>
                <FormNumberInput
                  id="ltRemainingFlask"
                  readOnly={!isEditing}
                  value={formData.ltRemainingFlask}
                  onChange={(e) => handleChange("ltRemainingFlask", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltTotalFlask">Litros totales</Label>
                <FormNumberInput
                  id="ltTotalFlask"
                  readOnly={!isEditing}
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
            {isEditing && (
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Agregar descarga
              </Button>
            )}
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-6 border rounded-lg">
              <p className="text-gray-500">No hay items registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">Selected Vehicles:</h2>
                <pre className="bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-60">
                  {JSON.stringify(formData, null, 2)}
                </pre>
                <div>{latestVoucherNumber} || {latestXVoucher}</div>
              </div>
              {formData.items.map((item, index) => (
                <Card key={index} className="">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">Descarga #{index + 1}</h3>
                      {isEditing && (
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
                          readOnly={!isEditing}
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
                          readOnly={!isEditing}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-amount-${index}`}>Cantidad</Label>
                        <FormNumberInput
                          id={`item-amount-${index}`}
                          readOnly={!isEditing}
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-date-${index}`}>Fecha</Label>
                        <FormDatePicker
                          id={`item-date-${index}`}
                          readOnly={!isEditing}
                          value={item.date || getTodayDateForInput()}
                          onChange={(e) => handleItemChange(index, "date", e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <FormCheckInput id={`item-xvoucher-${index}`} value={item.isXVoucher ?? false} onChange={(e) => handleIsXVoucher(e, index)} disabled={!isEditing}/>
                        <Label htmlFor={`item-xvoucher-${index}`}>Remito X</Label>
                      </div>

                      {item.isXVoucher ? (
                        <div className="space-y-2">
                          <Label htmlFor={`item-xvoucher-${index}`}>Remito X°</Label>
                          <FormTextInput
                            id={`item-xvoucher-${index}`}
                            placeholder="Ingrese Remito X..."
                            readOnly={!isEditing}
                            value={item.xVoucher || ""}
                            onChange={(e) => handleItemChange(index, "xVoucher", e.target.value)}
                            className="mt-1 w-full"
                          />
                        </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor={`item-voucher-${index}`}>Remito N°</Label>
                        <FormNumberInput
                          id={`item-voucher-${index}`}
                          readOnly={!isEditing}
                          value={item.voucherNumber || ""}
                          onChange={(e) => handleItemChange(index, "voucherNumber", e.target.value)}
                          className="mt-1 w-full"
                        />
                      </div>
                    )}

                      <div className="space-y-2">
                        <Label htmlFor={`item-payment-${index}`}>Pago</Label>
                        <FormNumberInput
                          id={`item-payment-${index}`}
                          readOnly={!isEditing}
                          value={item.payment || 0}
                          onChange={(e) => handleItemChange(index, "payment", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`item-observations-${index}`}>Observaciones</Label>
                        <FormTextInput
                          id={`item-observations-${index}`}
                          placeholder={isEditing ? "Ingrese observaciones..." : "Sin observaciones"}
                          readOnly={!isEditing}
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
          {isEditing ? (
            <>
              <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700">
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                  </>
                )}
              </Button>

              <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>

              <DeleteWithModal onDelete={handleDelete}></DeleteWithModal>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
