"use client"

import { useState, useEffect, use } from "react"
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
import { fetchTiposDocumento } from "@/lib/afip/api"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { fetchIvaConditions } from "@/lib/afip/api"
import ObjectViewer from "@/components/object-viewer"

export default function ClientDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id,
    address: "",
    docNumber: "",
    docType: "",
    email: "",
    name: "",
    phoneNumber: "",
    condicionIva: {},
    commercialAddress: "",
  })
  const [formDataCopy, setFormDataCopy] = useState({})
  const [foundClient, setFoundClient] = useState(true)
  const [tipoDoc, setTipoDoc] = useState([])
  const [ivaCondition, setIvaCondition] = useState([])

  useEffect(() => {
    getClient()
  }, [])

  const getClient = async () => {
    try {
      const [clientData, tipoDoc, ivaCondition] = await Promise.all([
        fetchClientById(id),
        fetchTiposDocumento(),
        fetchIvaConditions()])
      console.log(clientData);
      console.log(ivaCondition);
      
      
      setFormData(clientData)
      setTipoDoc(tipoDoc);
      setIvaCondition(ivaCondition);
    } catch (error) {
      setFoundClient(false)
      toast({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await postNewClient(formData);
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "El cliente se actualizó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el cliente",
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e) => {
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
      console.log(error);
      
      toast({
        title: "Error",
        description: error.message,
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

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value, // Update the specific field in formData
    }));
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
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/clientes" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a clientes
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Editar cliente" : "Detalles del cliente"}</h1>

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

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <FormTextInput id="email" readOnly={!isEditing} value={formData.email} onChange={handleInputChange("email")} required/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="docType">Tipo de documento</Label>
          <FormCombo
            id="docType"
            options={tipoDoc.elements}
            placeholder="Tipo de documento"
            onChange={(option) => handleChange("docType", option.code)}
            readOnly={!isEditing}
            defaultValue={formData.docType}
            displayKey="description"
            valueKey="code"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de documento</Label>
          <FormNumberInput id="phoneNumber" readOnly={!isEditing} value={formData.docNumber} onChange={handleInputChange("docNumber")} required min='0'/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condicionIva">Condición ante el IVA</Label>
          <FormCombo
            id="condicionIva"
            options={ivaCondition.elements}
            placeholder="Condición ante el IVA"
            onChange={(option) => handleChange("condicionIva", option.code)}
            readOnly={!isEditing}
            defaultValue={formData.condicionIva}
            displayKey="description"
            valueKey="code"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commercialAddress">Domicilio comercial (facturación)</Label>
          <FormTextInput id="commercialAddress" readOnly={!isEditing} value={formData.commercialAddress} onChange={handleInputChange("commercialAddress")} required/>
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