"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchVehicleById } from "@/lib/vehicle/api"
import { ArrowLeft, Save, Trash2, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
        AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker";
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"

const updateVehicle = async (id, data) => {
  // In a real app: return await fetch(`/api/vehicles/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json())
  //console.log("Updating vehicle:", id, data)
  // return { ...data, id }
}

const deleteVehicle = async (id) => {
  // In a real app: return await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
  console.log("Deleting vehicle:", id)
  // return true
}

export default function VehicleDetail({ params }) {
  const router = useRouter()
  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const nameRef = useRef(null);
  const purchaseDateRef = useRef(null);
  const priceRef = useRef(null);

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    purchaseDate: "",
    purchaseDatePrice: 0,
  })

  useEffect(() => {
    getVehicle()
  }, [])

  const getVehicle = async () => {
    try {
      const data = await fetchVehicleById(id);
      setVehicle(data);
      setFormData({
        name: data.name,
        purchaseDate: data.purchaseDate,
        purchaseDatePrice: data.purchaseDatePrice,
      });
    } catch (error) {
      console.error("Error fetching vehicle:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateVehicle(id, {
        ...formData,
        id: Number.parseInt(id),
      })
      setIsEditing(false)
      // Update the vehicle state to reflect changes
      setVehicle({
        ...vehicle,
        name: formData.name,
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
        purchaseDatePrice: formData.purchaseDatePrice,
      })
      console.log("submited")
    } catch (error) {
      console.error("Error updating vehicle:", error)
      alert("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteVehicle(id)
      router.push("/vehiculos")
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      alert("Error al eliminar el vehículo")
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const handleCancel = (e) => {
    e.preventDefault();
    // Reset form data to original values
    if (vehicle) {
      const purchaseDate = new Date(vehicle.purchaseDate)
      const formattedDate = purchaseDate.toISOString().split("T")[0]

      setFormData({
        name: vehicle.name,
        purchaseDate: formattedDate,
        purchaseDatePrice: vehicle.purchaseDatePrice,
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen p-4">
        <Link href="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a vehículos
        </Link>
        <div className="text-center py-10">
          <p className="text-red-500">Vehículo no encontrado</p>
        </div>
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

      <p>{"Editing: " + isEditing + " formData: " + formData.name + " " + formData.purchaseDate + " " + formData.purchaseDatePrice + " " + "loading: " + loading}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Vehículo</Label>
          <FormTextInput
            id="name"
            readOnly={!isEditing}
            defaultValue={formData.name}
            ref={nameRef}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Fecha de Compra</Label>
            <FormDatePicker    
              id="purchaseDate"   
              readOnly={!isEditing}
              defaultValue={formData.purchaseDate}
              ref={purchaseDateRef}
              required
            />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDatePrice">Precio de Compra</Label>
          <FormNumberInput
              id="purchaseDatePrice"
              name="purchaseDatePrice"
              readOnly={!isEditing}
              defaultValue={formData.purchaseDatePrice}
              ref={priceRef}
              required
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo.
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