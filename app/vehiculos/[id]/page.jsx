"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchVehicleById } from "@/lib/vehicle/api"
import { ArrowLeft, Save, Trash2, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker";
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { deleteVehicle } from "@/lib/vehicle/api";
import { useToast } from "@/components/ui/toast"
import { postNewVehicle } from "@/lib/vehicle/api"
import { formatDateToString } from "@/lib/utils"

export default function VehicleDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  // refs
  const nameRef = useRef(null);
  const purchaseDateRef = useRef(null);
  const priceRef = useRef(null);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  
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
        description: error.data,
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
    setSaving(true)
    console.log("voy a entrar al post");
    console.log(formData);
    console.log(purchaseDateRef.current.value);
    
    
    try {
      await postNewVehicle({
              id: id,
              name: nameRef.current.value,
              purchaseDate: purchaseDateRef.current.value,
              purchaseDatePrice: Number(priceRef.current.value),
            });
      // Update the vehicle state to reflect changes
      setFormData({
        name: nameRef.current.value,
        purchaseDate: purchaseDateRef.current.value,
        purchaseDatePrice: priceRef.current.value,
      })
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
        description: error.data,
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault();
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
        title: "Error",
        description: error.data,
        type: "error",
        duration: 7000,
      })
    }
  }

  /**
   * Set the form state to 'editing'
   * @param {*} e 
   */
  const handleEdit = (e) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const handleCancel = (e) => {
    e.preventDefault();
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!formData.name) {
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