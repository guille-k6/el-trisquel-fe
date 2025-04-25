"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { postNewClient } from "@/lib/customer/api"
import { useToast } from "@/components/ui/toast"

export default function NewClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await postNewClient({
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      })
      toast({
        title: "Creado",
        description: "El cliente se creó exitosamente",
        type: "success",
        duration: 7000,
      })
      router.push("/clientes")
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
    router.push("/clientes")
  }

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/clientes" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a clientes
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Cliente</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <FormTextInput id="name" readOnly={false} onChange={handleInputChange("name")} required/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <FormTextInput id="address" readOnly={false} onChange={handleInputChange("address")} required/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de Teléfono</Label>
          <FormTextInput id="phoneNumber" readOnly={false} onChange={handleInputChange("phoneNumber")} required/>
        </div>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-4 mr-2" disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Guardar Cliente
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