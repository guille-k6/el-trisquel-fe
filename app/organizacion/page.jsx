"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Building, AlertCircle, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getConfiguration } from "@/lib/configuration/api";
import { FormTextInput } from "@/components/ui/inputs/form-text-input"
import { FormDatePicker } from "@/components/ui/inputs/form-date-picker"
import { saveConfiguration } from "@/lib/configuration/api"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { fetchProducts } from "@/lib/product/api"
import { fetchVehicles, fetchVehiclesForCombo } from "@/lib/vehicle/api"
import ObjectViewer from "@/components/object-viewer"
import { fetchProviders } from "@/lib/nitrogen-providers/api"

export default function Organization() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    key: "org",
    value: {
      razonSocial: "",
      domicilioComercial: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      cuit: "",
      condicionIva: "",
      ingresosBrutos: "",
      fechaInicioActividades: "",
      telefono: "",
      mail: "",
    }
  })
  const [defaultInfo, setDefaultInfo] = useState({
    id: "",
    key: "default",
    value: {
      productoDefault: {},
      vehiculoDefault: {},
      proveedorDefault: {},
    }
  })
  const [formDataCopy, setFormDataCopy] = useState({})
  const [defaultInfoCopy, setDefaultInfoCopy] = useState({})
  const [products, setProducts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    try {
      setLoading(true)
      const [response, defaultInfo, products, vehicles, providers] = await Promise.all([
        getConfiguration("org"),
        getConfiguration("default"),
        fetchProducts(),
        fetchVehicles(),
        fetchProviders(),
      ]);
      setFormData(response)
      setDefaultInfo(defaultInfo)
      setProducts(products);
      setVehicles(vehicles);
      setProviders(providers);
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de la organización.",
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      value: {
        ...prev.value,
        [field]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveConfiguration(formData)
      await saveConfiguration(defaultInfo)
      setIsEditing(false)
      toast({
        title: "Actualizado",
        description: "La configuración de la organización se actualizó exitosamente",
        type: "success",
        duration: 7000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.data || "No se pudo actualizar la configuración de la organización.",
        type: "error",
        duration: 8000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    // Deffensive copy of the original state of the formData before entenring the edition stage
    const originalData = JSON.parse(JSON.stringify(formData));
    const originalInfoData = JSON.parse(JSON.stringify(defaultInfo));
    setFormDataCopy(originalData);
    setDefaultInfoCopy(originalInfoData);
    setIsEditing(true)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    // Restoring formData to its original state before entering in edition
    setFormData({...formDataCopy})
    setDefaultInfo({...defaultInfoCopy})
    setFormDataCopy({})
    setDefaultInfoCopy({})
    setIsEditing(false)
  }

  const handleChange = (field, newValue) => {
    setDefaultInfo(prev => ({
      ...prev,
      value: {
        ...prev.value,
        [field]: newValue,
      },
    }))
  }

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 my-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="flex items-center gap-3 my-3">
        <Building className="h-8 w-8 text-gray-600" />
        <h1 className="text-2xl font-bold">Configuración General</h1>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Datos predeterminados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Producto Default */}
            <div className="space-y-2">
              <Label htmlFor="productoDefault">
                Producto predeterminado
              </Label>
              <FormCombo
                id="productoDefault"
                options={products} // Lista de opciones de productos
                defaultValue={defaultInfo?.value?.productoDefault}
                onChange={(option) => handleChange("productoDefault", option)}
                placeholder="Seleccione el producto predeterminado"
                readOnly={!isEditing}
              />
            </div>

            {/* Vehículo Default */}
            <div className="space-y-2">
              <Label htmlFor="vehiculoDefault">
                Vehículo predeterminado
              </Label>
              <FormCombo
                id="vehiculoDefault"
                options={vehicles} // Lista de opciones de vehículos
                defaultValue={defaultInfo?.value?.vehiculoDefault}
                onChange={(option) => handleChange("vehiculoDefault", option)}
                placeholder="Seleccione el vehículo predeterminado"
                readOnly={!isEditing}
                required
              />
            </div>
            {/* Proveedor Default */}
            <div className="space-y-2">
              <Label htmlFor="proveedorDefault">
                Proveedor de nitrógeno predeterminado
              </Label>
              <FormCombo
                id="proveedorDefault"
                options={providers} // Lista de opciones de vehículos
                defaultValue={defaultInfo?.value?.proveedorDefault}
                onChange={(option) => handleChange("proveedorDefault", option)}
                placeholder="Seleccione el proveedor de nitrógeno predeterminado"
                readOnly={!isEditing}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Datos de facturación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Razón Social */}
            <div className="space-y-2">
              <Label htmlFor="razonSocial">
                Razón Social <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="razonSocial"
                value={formData?.value?.razonSocial}
                onChange={handleInputChange("razonSocial")}
                readOnly={!isEditing}
                placeholder="Ingrese la razón social de la empresa"
                required
              />
            </div>

            {/* Domicilio Comercial */}
            <div className="space-y-2">
              <Label htmlFor="domicilioComercial">
                Domicilio Comercial <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="domicilioComercial"
                value={formData?.value?.domicilioComercial}
                onChange={handleInputChange("domicilioComercial")}
                readOnly={!isEditing}
                placeholder="Ingrese el domicilio comercial"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="ciudad">
                Ciudad <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="ciudad"
                value={formData?.value?.ciudad}
                onChange={handleInputChange("ciudad")}
                readOnly={!isEditing}
                placeholder="Ingrese la ciudad de la empresa"
                required
              />
            </div>

            {/* Provincia */}
            <div className="space-y-2">
              <Label htmlFor="provincia">
                Provincia <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="provincia"
                value={formData?.value?.provincia}
                onChange={handleInputChange("provincia")}
                readOnly={!isEditing}
                placeholder="Ingrese su provincia"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Codigo postal */}
            <div className="space-y-2">
              <Label htmlFor="codigoPostal">
                Código postal <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="codigoPostal"
                value={formData?.value?.codigoPostal}
                onChange={handleInputChange("codigoPostal")}
                readOnly={!isEditing}
                placeholder="Ingrese el CP de la ciudad de la empresa"
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
                value={formData?.value?.cuit}
                onChange={handleInputChange("cuit")}
                readOnly={!isEditing}
                placeholder="XX-XXXXXXXX-X"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condición frente al IVA */}
            <div className="space-y-2">
              <Label htmlFor="condicionIva">
                Condición frente al IVA <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="condicionIva"
                value={formData?.value?.condicionIva}
                onChange={handleInputChange("condicionIva")}
                readOnly={!isEditing}
                placeholder="Seleccione condición IVA"
                required
              />
            </div>
            {/* Ingresos Brutos */}
            <div className="space-y-2">
              <Label htmlFor="ingresosBrutos">Ingresos Brutos</Label>
              <FormTextInput
                id="ingresosBrutos"
                value={formData?.value?.ingresosBrutos}
                onChange={handleInputChange("ingresosBrutos")}
                readOnly={!isEditing}
                placeholder="Número de Ingresos Brutos"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Inicio de Actividades */}
            <div className="space-y-2">
              <Label htmlFor="fechaInicioActividades">
                Fecha de Inicio de Actividades <span className="text-red-500">*</span>
              </Label>
              <FormDatePicker
                id="fechaInicioActividades"
                readOnly={!isEditing}
                value={formData?.value?.fechaInicioActividades}
                onChange={handleInputChange("fechaInicioActividades")}
                required
              />
            </div>

            {/* Telefono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">
                Telefono <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="telefono"
                value={formData?.value?.telefono}
                onChange={handleInputChange("telefono")}
                readOnly={!isEditing}
                placeholder="Seleccione condición IVA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mail */}
            <div className="space-y-2">
              <Label htmlFor="mail">
                Mail <span className="text-red-500">*</span>
              </Label>
              <FormTextInput
                id="mail"
                value={formData?.value?.mail}
                onChange={handleInputChange("mail")}
                readOnly={!isEditing}
                placeholder="Seleccione condición IVA"
                required
              />
            </div>



          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            {isEditing ? (
              <>
                <Button type="submit" disabled={saving} onClick={handleSubmit}>
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
              </>
            )}
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
                  • Son los datos que aparecerán en las facturas emitidas por el sistema
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