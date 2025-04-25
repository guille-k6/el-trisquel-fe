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
import { postNewVehicle } from "@/lib/vehicle/api"
import { useToast } from "@/components/ui/toast"
import { getTodayDateForInput } from "@/lib/utils"

export default function NewVehicle() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({purchaseDate: getTodayDateForInput()});

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true);
    try {
      await postNewVehicle({
        ...formData,
        purchaseDatePrice: Number(formData.purchaseDatePrice),
      });  
      toast({
        title: "Creado",
        description: "El vehiculo se creó exitosamente",
        type: "success",
        duration: 7000,
      })
      router.push("/vehiculos");
    } catch (error) {
      console.log("NO PASE POR EL ERROR LAMENTABLEMENTE")
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

  function handleCancel(e){
    e.preventDefault();
    router.push("/vehiculos");
  }

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <Link href="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a vehículos
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Vehículo</h1>
      <h2>{JSON.stringify(formData)}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Vehículo</Label>
          <FormTextInput
            id="name"
            readOnly={false}
            onChange={handleInputChange("name")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Fecha de Compra</Label>
          <FormDatePicker    
              id="purchaseDate"   
              readOnly={false}
              value={getTodayDateForInput()}
              onChange={handleInputChange("purchaseDate")}
              required
            />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDatePrice">Precio de Compra ($USD)</Label>
          <FormNumberInput
            id="purchaseDatePrice"
            name="purchaseDatePrice"
            readOnly={false}
            onChange={handleInputChange("purchaseDatePrice")}
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