import { Badge } from "@/components/ui/badge"

export default function InvoiceStatusBadge({status, paid}) {
  if (paid) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pagada</Badge>
  }
  switch (status) {
    case "QUEUED":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cola</Badge>;
    case "BEING_PROCESSED":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Procesando</Badge>;
    case "RETRY":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Reintentando</Badge>;
    case "FAILED":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Fallo temporal</Badge>;
    case "TOTAL_FAILURE":
      return <Badge className="bg-red-200 text-red-900 hover:bg-red-200">Fallo</Badge>;
    case "COMPLETED":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completada</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}