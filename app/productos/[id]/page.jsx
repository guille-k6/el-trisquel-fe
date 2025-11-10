"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchProductById } from "@/lib/product/api"
import { ArrowLeft, Save, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DeleteWithModal } from "@/components/ui/delete-with-modal"
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { deleteProduct } from "@/lib/product/api"
import { useToast } from "@/components/ui/toast"
import { postNewProduct } from "@/lib/product/api"
import ObjectViewer from "@/components/object-viewer"

export default function ProductDetail({ params }) {
  const { toast } = useToast()
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    measureUnit: '',
  })
  const [formDataCopy, setFormDataCopy] = useState({})
  const [foundProduct, setFoundProduct] = useState(true)

  useEffect(() => {
    getProduct()
  }, [])

  const getProduct = async () => {
    try {
      const data = await fetchProductById(id)
      setFormData(data)
    } catch (error) {
      setFoundProduct(false)
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
   * Actually handles the update of a product.
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await postNewProduct({
        id: id,
        name: formData.name,
        measureUnit: formData.measureUnit,
      })
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "El producto se actualizó exitosamente",
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
    try {
      await deleteProduct(id)
      router.push("/productos")
      toast({
        title: "Eliminado",
        description: "El producto se eliminó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      toast({
        title: "Error al eliminar producto",
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

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!foundProduct) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <Link href="/productos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a productos
        </Link>
        <div className="text-center py-10">
          <p className="text-red-500">Producto no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/productos" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a productos
      </Link>

      <h1 className="text-2xl font-bold my-3">{isEditing ? "Editar Producto" : "Detalles del Producto"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Producto</Label>
          <FormTextInput id="name" readOnly={!isEditing} value={formData.name} onChange={handleInputChange("name")} required/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Unidad de medida</Label>
          <FormTextInput id="measureUnit" readOnly={!isEditing} value={formData.measureUnit} onChange={handleInputChange("measureUnit")} required/>
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