import ObjectViewer from "@/components/object-viewer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Info, User, SquareGanttChartIcon as SquareChartGantt } from "lucide-react"    
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function InvoiceInformation({ items, client }) {
   
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Información</h2>
            <p className="text-gray-600">Datos del cliente y items seleccionados</p>
          </div>
        </div>
  
        {/* Combined Card with Sections */}
        <Card className="border-gray-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="space-y-8">
            {/* Client Information Section */}
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-gray-900">{client.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-6">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Documento</Label>
                  <p className="font-semibold">{`${client.docType.description}:` || "No especificado"} <span className="font-medium text-gray-700">{client.docNumber || "No especificado"}</span></p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Condición IVA</Label>
                  <p className="font-semibold">{client.condicionIva.description}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</Label>
                  <p className="font-medium text-gray-700">{client.email || "No especificado"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Dirección</Label>
                  <p className="font-medium text-gray-700">{client.address}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Teléfono</Label>
                  <p className="font-medium text-gray-700">{client.phoneNumber || "No especificado"}</p>
                </div>
              </div>
            </div>
  
            {/* Separator between sections */}
            <Separator className="my-3" />
  
            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <SquareChartGantt className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Items Seleccionados</h3>
              </div>
  
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Fecha</Label>
                        <p className="font-semibold text-gray-900">{item.date}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Producto</Label>
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Cantidad</Label>
                        <p className="font-semibold text-blue-600">{item.amount} L</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Remito</Label>
                        <p className="text-sm font-medium text-gray-700">
                          {item.voucherNumber ? `N° ${item.voucherNumber}` : item.xVoucher || "Sin remito"}
                        </p>
                      </div>
                    </div>
                    {(item.observations || Number(item.payment) > 0) && (
                      <>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {item.observations && (
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                Observaciones
                              </Label>
                              <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                                {item.observations}
                              </p>
                            </div>
                          )}
                          {Number(item.payment) > 0 && (
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pago</Label>
                              <p className="text-sm font-medium text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                {item.payment}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }