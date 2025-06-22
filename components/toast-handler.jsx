"use client"

import { useEffect } from "react"
import { useToast } from "./ui/toast"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function ToastHandler({ }) {
  
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const router = useRouter();
    useEffect(() => {
      if (searchParams.get("invoice") === "success") {
        toast({
          title: "Factura generada correctamente",
          description: "Ir a la cola de facturación para ver el estado de la factura.",
          type: "success",
          duration: 10000,
        })
        router.replace("/", { scroll: false })
      }
    }, [searchParams])

  return (
    <></>
  )
}