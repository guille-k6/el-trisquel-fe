"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchDailyBookById, deleteDailyBook, postNewDailyBook } from "@/lib/daily-book/api"
import { fetchVehicles } from "@/lib/vehicle/api";
import { fetchProducts } from "@/lib/product/api";
import { fetchClients } from "@/lib/customer/api";
import { ArrowLeft, Save, Trash2, Edit, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent } from "@/components/ui/card"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"

export default function LibroDiarioDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = use(params)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // State for form data - combining all form fields
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
    items: []
  })
  
  // Reference data
  const [vehicles, setVehicles] = useState([])
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])

  useEffect(() => {
    fetchData();
  }, [id]); // Only re-fetch when ID changes

  const fetchData = async () => {
    try {
      setLoading(true);
      const [libroDiarioData, vehiclesData, productsData, clientsData] = await Promise.all([
        fetchDailyBookById(id),
        fetchVehicles(),
        fetchProducts(),
        fetchClients(),
      ])

      setFormData({
        id: libroDiarioData.id,
        date: libroDiarioData.date,
        vehicle: libroDiarioData.vehicle,
        vehicleKmsBefore: libroDiarioData.vehicleKmsBefore,
        vehicleKmsAfter: libroDiarioData.vehicleKmsAfter,
        kgTankBefore: libroDiarioData.kgTankBefore,
        kgTankAfter: libroDiarioData.kgTankAfter,
        ltExtractedTank: libroDiarioData.ltExtractedTank,
        ltRemainingFlask: libroDiarioData.ltRemainingFlask,
        ltTotalFlask: libroDiarioData.ltTotalFlask,
        items: libroDiarioData.items || []
      })
      
      setVehicles(vehiclesData)
      setProducts(productsData)
      setClients(clientsData)
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

  // Handle changes to main form fields
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  }

  // Handle selection for combo boxes
  const handleSelectChange = (field, option) => {
    setFormData({
      ...formData,
      [field]: option
    });
  }

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    if (field === "product") {
      updatedItems[index].product = {
        id: value,
        name: products.find((p) => p.id.toString() === value.toString())?.name || "",
      }
    } else if (field === "client") {
      updatedItems[index].client = {
        id: value,
        name: clients.find((c) => c.id.toString() === value.toString())?.name || "",
      }
    } else if (field === "authorized") {
      updatedItems[index].authorized = value
    } else {
      updatedItems[index][field] = value
    }

    setFormData({
      ...formData,
      items: updatedItems
    });
  }

  const addItem = () => {
    const newItem = {
      id: null, // Será asignado por el backend
      amount: 0,
      product: { id: products[0]?.id || "", name: products[0]?.name || "" },
      client: { id: clients[0]?.id || "", name: clients[0]?.name || "" },
      authorized: false,
    }
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  }

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData({
      ...formData,
      items: updatedItems
    });
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
        ltExtractedTank: Number(formData.ltExtractedTank),
        ltRemainingFlask: Number(formData.ltRemainingFlask),
        ltTotalFlask: Number(formData.ltTotalFlask),
        items: formData.items.map((item) => ({
          id: item.id,
          amount: Number(item.amount),
          product: { id: item.product.id },
          client: { id: item.client.id },
          authorized: item.authorized,
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
    e.preventDefault();
    setIsEditing(true);
  }

  const handleCancel = (e) => {
    e.preventDefault();
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!formData.id) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <FormDatePicker 
              id="date" 
              readOnly={!isEditing} 
              value={formData.date}
              onChange={(value) => handleChange('date', value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleCombo" className="block text-sm font-medium mb-1">Vehículo</Label>
            <FormCombo
              id="vehicleCombo" 
              options={vehicles} 
              placeholder="Vehículo..." 
              onChange={(option) => handleSelectChange('vehicle', option)}
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
              onChange={(e) => handleChange('vehicleKmsBefore', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleKmsAfter">Kilómetros Finales</Label>
            <FormNumberInput
              id="vehicleKmsAfter"
              readOnly={!isEditing}
              value={formData.vehicleKmsAfter}
              onChange={(e) => handleChange('vehicleKmsAfter', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="kgTankBefore">Peso Tanque Inicial (kg)</Label>
            <FormNumberInput
              id="kgTankBefore"
              readOnly={!isEditing}
              value={formData.kgTankBefore}
              onChange={(e) => handleChange('kgTankBefore', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kgTankAfter">Peso Tanque Final (kg)</Label>
            <FormNumberInput
              id="kgTankAfter"
              readOnly={!isEditing}
              value={formData.kgTankAfter}
              onChange={(e) => handleChange('kgTankAfter', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ltExtractedTank">Litros Extraídos</Label>
            <FormNumberInput
              id="ltExtractedTank"
              readOnly={!isEditing}
              value={formData.ltExtractedTank}
              onChange={(e) => handleChange('ltExtractedTank', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ltRemainingFlask">Litros Restantes en Frasco</Label>
            <FormNumberInput
              id="ltRemainingFlask"
              readOnly={!isEditing}
              value={formData.ltRemainingFlask}
              onChange={(e) => handleChange('ltRemainingFlask', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ltTotalFlask">Litros Totales en Frasco</Label>
            <FormNumberInput
              id="ltTotalFlask"
              readOnly={!isEditing}
              value={formData.ltTotalFlask}
              onChange={(e) => handleChange('ltTotalFlask', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Items</h2>
            {isEditing && (
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Agregar Item
              </Button>
            )}
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay items registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Item #{index + 1}</h3>
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
                        <select
                          id={`item-client-${index}`}
                          className={`w-full rounded-md border border-input px-3 py-2 ${!isEditing ? "bg-gray-100" : "bg-background"}`}
                          disabled={!isEditing}
                          value={item.client?.id || ""}
                          onChange={(e) => handleItemChange(index, "client", e.target.value)}
                          required
                        >
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-product-${index}`}>Producto</Label>
                        <select
                          id={`item-product-${index}`}
                          className={`w-full rounded-md border border-input px-3 py-2 ${!isEditing ? "bg-gray-100" : "bg-background"}`}
                          disabled={!isEditing}
                          value={item.product?.id || ""}
                          onChange={(e) => handleItemChange(index, "product", e.target.value)}
                          required
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-amount-${index}`}>Cantidad</Label>
                        <input
                          type="number"
                          id={`item-amount-${index}`}
                          className={`w-full rounded-md border border-input px-3 py-2 ${!isEditing ? "bg-gray-100" : "bg-background"}`}
                          readOnly={!isEditing}
                          value={item.amount || ""}
                          onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2 mt-8">
                        <input
                          type="checkbox"
                          id={`item-authorized-${index}`}
                          className="rounded border-gray-300"
                          disabled={!isEditing}
                          checked={item.authorized || false}
                          onChange={(e) => handleItemChange(index, "authorized", e.target.checked)}
                        />
                        <Label htmlFor={`item-authorized-${index}`}>Autorizado</Label>
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

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el libro diario.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </form>
    </div>
  )
}