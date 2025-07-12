"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Building, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getConfiguration } from "@/lib/configuration/api";
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"

export default function Organizacion() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    razonSocial: "",
    domicilioComercial: "",
    condicionIva: "",
    cuit: "",
    ingresosBrutos: "",
    fechaInicioActividades: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    try {
      setLoading(true)
      const response = await getConfiguration("org");
      console.log(response);
      
      setConfig(response.value)
    } catch (error) {
      console.error("Error fetching configuration:", error)
      // Usar valores por defecto en caso de error
      setConfig({
        razonSocial: "",
        domicilioComercial: "",
        condicionIva: "",
        cuit: "",
        ingresosBrutos: "",
        fechaInicioActividades: "",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
        type: "error",
        duration: 5000,
      })
      return
    }

    try {
      setSaving(true)

      // Simular llamada a API - reemplazar con tu endpoint real
      const response = await fetch("/api/organization/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast({
          title: "Configuración guardada",
          description: "Los datos de la organización se han actualizado correctamente",
          type: "success",
          duration: 5000,
        })
      } else {
        throw new Error("Error al guardar la configuración")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Intente nuevamente.",
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCuitChange = (value) => {
    const formatted = formatCuit(value)
    handleInputChange("cuit", formatted)
  }

  const getSelectedIvaCondition = () => {
    return ivaConditions.find((condition) => condition.id === config.condicionIva) || null
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Building className="h-8 w-8 text-gray-600" />
        <h1 className="text-2xl font-bold">Configuración General</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Datos de la Organización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Razón Social */}
          <div className="space-y-2">
            <Label htmlFor="razonSocial">
              Razón Social <span className="text-red-500">*</span>
            </Label>
            <FormTextInput
              id="razonSocial"
              value={config.razonSocial}
              onChange={(e) => handleInputChange("razonSocial", e.target.value)}
              readOnly={!isEditing}
              placeholder="Ingrese la razón social de la empresa"
              className={errors.razonSocial ? "border-red-500" : ""}
              required
            />
            {errors.razonSocial && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.razonSocial}
              </div>
            )}
          </div>

          {/* Domicilio Comercial */}
          <div className="space-y-2">
            <Label htmlFor="domicilioComercial">
              Domicilio Comercial <span className="text-red-500">*</span>
            </Label>
            <FormTextInput
              id="domicilioComercial"
              value={config.domicilioComercial}
              onChange={(e) => handleInputChange("domicilioComercial", e.target.value)}
              readOnly={!isEditing}
              placeholder="Ingrese el domicilio comercial"
              className={errors.domicilioComercial ? "border-red-500" : ""}
              required
            />
            {errors.domicilioComercial && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.domicilioComercial}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condición frente al IVA */}
            <div className="space-y-2">
              <Label htmlFor="condicionIva">
                Condición frente al IVA <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="condicionIva"
                value={config.condicionIva}
                onChange={(e) => handleInputChange("condicionIva", e.target.value)}
                readOnly={!isEditing}
                placeholder="Seleccione condición IVA"
                className={errors.condicionIva ? "border-red-500" : ""}
                required
              />
            </div>

            {/* CUIT */}
            <div className="space-y-2">
              <Label htmlFor="cuit">
                CUIT <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="cuit"
                value={config.cuit}
                onChange={(e) => handleCuitChange(e.target.value)}
                readOnly={!isEditing}
                placeholder="XX-XXXXXXXX-X"
                className={errors.cuit ? "border-red-500" : ""}
                required
              />
              {errors.cuit && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.cuit}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingresos Brutos */}
            <div className="space-y-2">
              <Label htmlFor="ingresosBrutos">Ingresos Brutos</Label>
              <FormTextInput
                id="ingresosBrutos"
                value={config.ingresosBrutos}
                onChange={(e) => handleInputChange("ingresosBrutos", e.target.value)}
                readOnly={!isEditing}
                placeholder="Número de Ingresos Brutos"
                required
              />
            </div>

            {/* Fecha de Inicio de Actividades */}
            <div className="space-y-2">
              <Label htmlFor="fechaInicioActividades">
                Fecha de Inicio de Actividades <span className="text-red-500">*</span>
              </Label>
              <FormDatePicker
                id="fechaInicioActividades"
                readOnly={!isEditing}
                value={config.fechaInicioActividades}
                onChange={(e) => handleInputChange("fechaInicioActividades", e.target.value)}
                className={errors.fechaInicioActividades ? "border-red-500" : ""}
                required
              />
              {errors.fechaInicioActividades && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fechaInicioActividades}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </>
              )}
            </Button>
            <Button variant="outline" onClick={fetchConfiguration} disabled={saving}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-700 mb-1">Información importante:</p>
              <ul className="space-y-1 text-sm">
                <li>
                  • Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                </li>
                <li>• El CUIT debe ingresarse con el formato XX-XXXXXXXX-X</li>
                <li>• Esta información se utilizará en la generación de facturas y reportes</li>
                <li>• Los cambios se aplicarán inmediatamente después de guardar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}