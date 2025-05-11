"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchVoucherById } from "@/lib/voucher/api"
import { ArrowLeft, Save, Trash2, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormCheckInput } from "@/components/ui/inputs/form-check"
import { deleteVoucher } from "@/lib/voucher/api"
import { useToast } from "@/components/ui/toast"
import { postNewVoucher } from "@/lib/voucher/api"
import { DeleteWithModal } from "@/components/ui/delete-with-modal"

export default function VoucherDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    invoiceable: true,
  })
  const [formDataCopy, setFormDataCopy] = useState({})

  useEffect(() => {
    getVoucher()
  }, [])

  const getVoucher = async () => {
    try {
      const data = await fetchVoucherById(id)
      setFormData({
        name: data.name,
        invoiceable: data.invoiceable,
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await postNewVoucher({
        id: id,
        name: formData.name,
        invoiceable: formData.invoiceable,
      })
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "El remito se actualizó exitosamente",
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
      await deleteVoucher(id)
      router.push("/remitos")
      toast({
        title: "Eliminado",
        description: "El remito se eliminó exitosamente",
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
    })
  }

  const handleCheckboxChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.checked,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/remitos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a remitos
      </Link>

      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Editar Remito" : "Detalles del Remito"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Remito</Label>
          <FormTextInput
            id="name"
            readOnly={!isEditing}
            value={formData.name}
            onChange={handleInputChange("name")}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <FormCheckInput id="invoiceable" value={formData.invoiceable || false} onChange={handleCheckboxChange("invoiceable")} disabled={!isEditing}/>
          <Label htmlFor="invoiceable">Facturable</Label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {isEditing ? (
            <>
              <Button type="submit" disabled={saving}>
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
