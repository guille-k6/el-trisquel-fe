"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchClientById } from "@/lib/customer/api"
import { ArrowLeft, Save, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DeleteWithModal } from "@/components/ui/delete-with-modal"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { deleteClient } from "@/lib/customer/api"
import { useToast } from "@/components/ui/toast"
import { postNewClient } from "@/lib/customer/api"

export default function ClientDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [formDataCopy, setFormDataCopy] = useState({})
  const [foundClient, setFoundClient] = useState(true)

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
      setFoundClient(false)
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
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
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
    // Deffensive copy of the original state of the formData before entenring the edition stage
    const originalData = JSON.parse(JSON.stringify(formData));
    setFormDataCopy(originalData);
    setIsEditing(true)
  }

  const handleCancel = (e) => {
    e.preventDefault()
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

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!foundClient) {
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
          <Label htmlFor="name">Nombre</Label>
          <FormTextInput id="name" readOnly={!isEditing} value={formData.name} onChange={handleInputChange("name")} required/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <FormTextInput id="address" readOnly={!isEditing} value={formData.address} onChange={handleInputChange("address")} required/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de teléfono</Label>
          <FormTextInput id="phoneNumber" readOnly={!isEditing} value={formData.phoneNumber} onChange={handleInputChange("phoneNumber")} required/>
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