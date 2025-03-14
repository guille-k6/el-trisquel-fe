"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock API function - replace with actual API call
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
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "purchaseDatePrice" ? value : value,
    }))
  }

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
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Fecha de Compra</Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDatePrice">Precio de Compra</Label>
          <Input
            id="purchaseDatePrice"
            name="purchaseDatePrice"
            type="number"
            value={formData.purchaseDatePrice}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-4" disabled={saving}>
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
      </form>
    </div>
  )
}