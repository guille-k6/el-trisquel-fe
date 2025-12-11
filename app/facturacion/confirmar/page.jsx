import { Suspense } from "react"
import BillingConfirmationClient from "./billing-main"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 max-w-6xl mx-auto">Cargando...</div>}>
      <BillingConfirmationClient />
    </Suspense>
  )
}