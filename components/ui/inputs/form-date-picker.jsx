"use client"

import { cn } from "@/lib/utils"
import { FormTextInput } from "./form-text-input"
import { formatDateToString, formatDateForInput } from "@/lib/utils"

function FormDatePicker({ readOnly, value, onChange, className, ...props }) {
  if (readOnly) {
    return <FormTextInput readOnly value={formatDateToString(value)} onChange={() => {}} required {...props}/>
  }
  return (
    <input type="date" value={formatDateForInput(value)} onChange={onChange} disabled={readOnly}
      className={cn(`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66`, className)}
      {...props}/>
  )
}

export { FormDatePicker }
