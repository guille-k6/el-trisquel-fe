"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { postNewProduct } from "@/lib/product/api"
import { useToast } from "@/components/ui/toast"

export default function NewProduct() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const nameRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await postNewProduct({
        name: nameRef.current.value,
      })
      toast({
        title: "Creado",
        description: "El producto se creó exitosamente",
        type: "success",
        duration: 7000,
      })
      router.push("/productos")
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
    router.push("/productos")
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/productos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a productos
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Producto</Label>
          <FormTextInput id="name" readOnly={false} defaultValue={""} ref={nameRef} required />
        </div>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-4 mr-2" disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Guardar Producto
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