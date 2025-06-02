"use client"

import { FormTextInput } from "./form-text-input"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"

function FormNumberInput({ readOnly, value, onChange, currency, className, ...props }) {
  if(value === null){
    value = 0;
  }
  if (readOnly) {
    return (
      <FormTextInput readOnly value={formatPrice(value, currency)} onChange={() => {}} required {...props}/>
    )
  }
  return (
    <input type="number" value={value} onChange={onChange} disabled={readOnly}
      className={cn(`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66 ${readOnly ? "bg-gray-50" : ""}`, className)}
      {...props}/>
  )
}

// currency = "ARS"
export { FormNumberInput }