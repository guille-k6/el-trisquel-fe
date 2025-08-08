import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Calendar, User, Package } from 'lucide-react'
import { fetchSuggestedPrices } from '@/lib/invoice/api'
import { useToast } from '@/components/ui/toast'

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function PriceSuggestion({ isOpen, onClose, productId, clientId, onSelectPrice } ) {
  const { toast } = useToast()
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && productId && clientId) {
      fetchPrices()
    }
  }, [isOpen, productId, clientId])

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const response = await fetchSuggestedPrices(clientId, productId)
      setPriceData(response)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los precios sugeridos",
        type: "error",
        duration: 8000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPrice = (price) => {
    onSelectPrice(price)
    onClose()
    toast({
      title: "Precio seleccionado",
      description: `Se ha aplicado el precio ${formatPrice(price)}`,
      type: "success",
      duration: 3000,
    })
  }

  const allPrices = priceData ? [
    ...priceData.productLastPricesByClient,
    ...priceData.productLastPrices
  ] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-blue-500" />
            {priceData?.product?.name || 'Producto'}
          </DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        
        <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : allPrices.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <p className="text-gray-500 text-lg">No hay precios anteriores disponibles</p>
                <p className="text-gray-400 text-sm mt-2">
                  Este producto no tiene historial de precios registrados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Client-specific prices section */}
                {priceData?.productLastPricesByClient && priceData.productLastPricesByClient.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Precios anteriores para este cliente
                    </h3>
                    <div className="space-y-3">
                      {priceData.productLastPricesByClient.map((record, index) => (
                        <Card key={`client-${index}`} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Fecha</div>
                                      <div className="text-gray-900">{formatDate(record.invoiceDate)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Cantidad</div>
                                      <div className="text-gray-900">{record.amount} L</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Precio Unitario</div>
                                      <div className="text-lg font-bold text-green-700">{formatPrice(record.price)}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleSelectPrice(record.price)}
                                className="ml-4 bg-green-600 hover:bg-green-700"
                              >
                                Usar este precio
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* General prices section */}
                {priceData?.productLastPrices && priceData.productLastPrices.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Precios anteriores (otros clientes)
                    </h3>
                    <div className="space-y-3">
                      {priceData.productLastPrices.map((record, index) => (
                        <Card key={`general-${index}`} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Cliente</div>
                                      <div className="text-gray-900 font-medium">{record.clientName}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Fecha</div>
                                      <div className="text-gray-900">{formatDate(record.invoiceDate)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Cantidad</div>
                                      <div className="text-gray-900">{record.amount} L</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">Precio Unitario</div>
                                      <div className="text-m font-bold text-green-700">{formatPrice(record.price)}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleSelectPrice(record.price)}
                                variant="outline"
                                className="ml-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                              >
                                Usar este precio
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}