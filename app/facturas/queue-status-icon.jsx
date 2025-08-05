import { AlertCircle, CheckCircle, Clock, RefreshCw, XCircle, XOctagon } from "lucide-react";

export default function InvoiceStatusIcon({status}) {
    switch (status) {
        case "QUEUED":
            return <Clock className="h-4 w-4 text-yellow-600" />;
        case "BEING_PROCESSED":
            return <AlertCircle className="h-4 w-4 text-blue-600" />;
        case "RETRY":
            return <RefreshCw className="h-4 w-4 text-orange-600" />;
        case "FAILED":
            return <XCircle className="h-4 w-4 text-grey-400" />;
        case "TOTAL_FAILURE":
            return <XOctagon className="h-4 w-4 text-red-800" />;
        case "COMPLETED":
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        default:
            return <Clock className="h-4 w-4 text-gray-600" />;
    }
}