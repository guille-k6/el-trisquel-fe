"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react";
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormNumberInput } from "@/components/ui/inputs/form-number-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { formatDateForInput } from "@/lib/utils"

const createVehicle = async (data) => {
  // In a real app: return await fetch('/api/vehicles', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json())
  console.log("Creating vehicle:", data)
  return { ...data, id: Math.floor(Math.random() * 1000) }
}

export default function NewVehicle() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    purchaseDate: "",
    purchaseDatePrice: "",
  });

  const nameRef = useRef(null);
  const purchaseDateRef = useRef(null);
  const priceRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await createVehicle({
        ...formData,
        purchaseDatePrice: Number(formData.purchaseDatePrice),
      })
      router.push("/vehiculos")
    } catch (error) {
      console.error("Error creating vehicle:", error)
      alert("Error al crear el vehículo")
    } finally {
      setSaving(false)
    }
  }

  function handleCancel(e){
    e.preventDefault();
    router.push("/vehiculos");
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a vehículos
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Vehículo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Vehículo</Label>
          <FormTextInput
            id="name"
            readOnly={false}
            defaultValue={''}
            ref={nameRef}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Fecha de Compra</Label>
          <FormDatePicker    
              id="purchaseDate"   
              readOnly={false}
              defaultValue={formatDateForInput(Date.now())}
              ref={purchaseDateRef}
              required
            />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDatePrice">Precio de Compra ($USD)</Label>
          <FormNumberInput
              id="purchaseDatePrice"
              name="purchaseDatePrice"
              readOnly={false}
              ref={priceRef}
              required
          />
        </div>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-4 mr-2" disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Guardar Vehículo
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