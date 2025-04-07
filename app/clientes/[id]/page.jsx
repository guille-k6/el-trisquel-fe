"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchClientById } from "@/lib/customer/api"
import { ArrowLeft, Save, Trash2, Edit, X } from "lucide-react"
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
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { deleteClient } from "@/lib/customer/api"
import { useToast } from "@/components/ui/toast"
import { postNewClient } from "@/lib/customer/api"

export default function ClientDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  // refs
  const nameRef = useRef(null)
  const addressRef = useRef(null)
  const phoneNumberRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    getClient()
  }, [])

  const getClient = async () => {
    try {
      const data = await fetchClientById(id)
      setFormData({
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.data,
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Actually handles the update of a client.
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await postNewClient({
        id: id,
        name: nameRef.current.value,
        address: addressRef.current.value,
        phoneNumber: phoneNumberRef.current.value,
      })
      // Update the client state to reflect changes
      setFormData({
        name: nameRef.current.value,
        address: addressRef.current.value,
        phoneNumber: phoneNumberRef.current.value,
      })
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "El cliente se actualizó exitosamente",
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
    e.preventDefault()
    try {
      await deleteClient(id)
      router.push("/clientes")
      toast({
        title: "Eliminado",
        description: "El cliente se eliminó exitosamente",
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
    e.preventDefault()
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
        <Link href="/clientes" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a clientes
        </Link>
        <div className="text-center py-10">
          <p className="text-red-500">Cliente no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/clientes" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a clientes
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Editar Cliente" : "Detalles del Cliente"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Cliente</Label>
          <FormTextInput id="name" readOnly={!isEditing} defaultValue={formData.name} ref={nameRef} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <FormTextInput id="address" readOnly={!isEditing} defaultValue={formData.address} ref={addressRef} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de Teléfono</Label>
          <FormTextInput
            id="phoneNumber"
            readOnly={!isEditing}
            defaultValue={formData.phoneNumber}
            ref={phoneNumberRef}
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente.
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