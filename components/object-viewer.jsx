import React from "react"
import { cn } from "@/lib/utils"

export default function ObjectViewer({ data, className }) {
  if (!data || typeof data !== "object") {
    return <p className="text-red-500">No hay datos válidos para mostrar.</p>
  }

  return (
    <div className={cn(`bg-gray-100 rounded-xl p-4 text-sm font-mono overflow-auto whitespace-pre-wrap`, className)}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}