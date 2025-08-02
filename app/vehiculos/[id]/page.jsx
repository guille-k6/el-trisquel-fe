"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchVehicleById } from "@/lib/vehicle/api"
import { ArrowLeft, Save, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DeleteWithModal } from "@/components/ui/delete-with-modal"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker";
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { deleteVehicle } from "@/lib/vehicle/api";
import { useToast } from "@/components/ui/toast"
import { postNewVehicle } from "@/lib/vehicle/api"

export default function VehicleDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    purchaseDate: "",
    purchaseDatePrice: '',
  })
  const [formDataCopy, setFormDataCopy] = useState({})
  const [foundVehicle, setFoundVehicle] = useState(true)
  
  useEffect(() => {
    getVehicle()
  }, [])

  const getVehicle = async () => {
    try {
      const data = await fetchVehicleById(id);
      setFormData({
        name: data.name,
        purchaseDate: data.purchaseDate,
        purchaseDatePrice: data.purchaseDatePrice,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false);
    }
  }

  /**
   * Actually handles the update of a vehicle.
   * @param {*} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await postNewVehicle(formData);
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "El vehiculo se actualizó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e) => {
    try {
      await deleteVehicle(id)
      router.push("/vehiculos")
      toast({
        title: "Eliminado",
        description: "El vehiculo se eliminó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      toast({
        title: "Error al eliminar vehículo",
        description: error.message,
        type: "error",
        duration: 7000,
      })
    }
  }

  /**
   * Handles the 'editing' state of a form. It set it to TRUE'
   */
  const handleEdit = (e) => {
    e.preventDefault()
    // Deffensive copy of the original state of the formData before entenring the edition stage
    const originalData = JSON.parse(JSON.stringify(formData));
    setFormDataCopy(originalData);
    setIsEditing(true)
  }

  const handleCancel = (e) => {
    e.preventDefault();
    // Restoring formData to its original state before entering in edition
    setFormData({...formDataCopy})
    setFormDataCopy({})
    setIsEditing(false)
  }

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  if (!foundVehicle) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a vehículos
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Editar Vehículo" : "Detalles del Vehículo"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Vehículo</Label>
          <FormTextInput
            id="name"
            readOnly={!isEditing}
            value={formData.name}
            onChange={handleInputChange("name")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Fecha de Compra</Label>
          <FormDatePicker
            id="purchaseDate"
            readOnly={!isEditing}
            value={formData.purchaseDate}
            onChange={handleInputChange("purchaseDate")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDatePrice">Precio de Compra</Label>
          <FormNumberInput
            id="purchaseDatePrice"
            name="purchaseDatePrice"
            readOnly={!isEditing}
            value={formData.purchaseDatePrice}
            onChange={handleInputChange("purchaseDatePrice")}
            required
            currency="USD"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {isEditing ? (
            <>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
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