import ObjectViewer from "@/components/object-viewer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"


export default function InvoiceSummary( {productPricing, ivas} ) {

    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(price)
    }
    
    const getTotalAmount = () => {
        return Object.keys(productPricing).reduce((total, productId) => {
            return total + calculateSubtotalWithIVA(productId)
        }, 0)
    }
    
    const getNetAmount = () => {
        return Object.keys(productPricing).reduce((total, productId) => {
          return total + calculateSubtotal(productId)
        }, 0)
    }
    
    // Subtotal without iva
    const calculateSubtotal = (productId) => {
        const product = productPricing[productId]
        if (!product) return 0
        return product.totalQuantity * product.unitPrice
    }
    
    const calculateSubtotalWithIVA = (productId) => {
        const subtotal = calculateSubtotal(productId)
        const product = productPricing[productId]
        const associatedIva = ivas.elements.find((iva) => iva.code === product.iva);
        return subtotal + (subtotal * associatedIva.percentage) / 100;
    }
    
    const getIVABreakdown = () => {
        const ivaBreakdown = {};
      
        Object.keys(productPricing).forEach((productId) => {
          const product = productPricing[productId];
          const subtotal = calculateSubtotal(productId);
               
          // Buscar el IVA asociado al producto
          const associatedIva = ivas.elements.find((iva) => iva.code === product.iva);   
            
          if (!associatedIva) {
            console.warn(`No se encontró un IVA asociado para el código: ${product.iva}`);
            return;
          }  
          // Calcular el monto del IVA
          const ivaAmount = (subtotal * associatedIva.percentage) / 100;
      
          // Si ya existe el IVA en el mapa, sumar el monto
          if (ivaBreakdown[associatedIva.code]) {
            ivaBreakdown[associatedIva.code].total += ivaAmount;
          } else {
            // Si no existe, inicializar el objeto con el nombre y el monto
            ivaBreakdown[associatedIva.code] = {
              description: associatedIva.description,
              total: ivaAmount,
            };
          }
        });
      
        return ivaBreakdown;
      };

    return (
    <Card className="border-gray-200 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                <div className="bg-green-100 p-2 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
                </div>
                Resumen de Factura
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                    <span className="text-lg font-medium text-gray-700">Importe Neto</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(getNetAmount())}</span>
                </div>

                <div className="space-y-3">
                    {Object.entries(getIVABreakdown()).map(([ivaRate, { description, total }]) => (                        
                    <div key={ivaRate} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="text-lg font-medium text-gray-700">{description}</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
                    </div>
                    ))}
                </div>

                <div className="flex justify-between items-center p-6 bg-white rounded-xl shadow-sm border-2 border-green-200">
                    <span className="text-xl font-semibold text-green-800">Total Final</span>
                    <span className="text-2xl font-bold text-green-600">{formatPrice(getTotalAmount())}</span>
                </div>
            </div>
        </CardContent>
    </Card>
    )
}