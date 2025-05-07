"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormCheckInput } from "@/components/ui/inputs/form-check"
import { postNewVoucher } from "@/lib/voucher/api"
import { useToast } from "@/components/ui/toast"

export default function NewVoucher() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    invoiceable: true,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await postNewVoucher(formData)
      toast({
        title: "Creado",
        description: "El remito se creó exitosamente",
        type: "success",
        duration: 7000,
      })
      router.push("/remitos")
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

  function handleCancel(e) {
    e.preventDefault()
    router.push("/remitos")
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

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/remitos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a remitos
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Remito</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Remito</Label>
          <FormTextInput id="name" readOnly={false} onChange={handleInputChange("name")} required />
        </div>

        <div className="flex items-center space-x-2">
        <FormCheckInput id="invoiceable" value={formData.invoiceable || true} onChange={handleCheckboxChange("invoiceable")} disabled={false}/>
          <Label htmlFor="invoiceable">Facturable</Label>
        </div>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-4 mr-2" disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Guardar Remito
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
      </form>
    </div>
  )
}
