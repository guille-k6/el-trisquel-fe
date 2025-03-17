"use client"

import { forwardRef } from "react"
import { FormTextInput } from "./form-text-input";
import { formatDateToString } from "@/lib/utils";
import { formatDateForInput } from "@/lib/utils";

const FormDatePicker = forwardRef(({readOnly, defaultValue, ...props}, ref) => {
  if(readOnly) {
    return (<FormTextInput readOnly={readOnly} defaultValue={formatDateToString(defaultValue)} ref={ref} required {...props}/>)
  } else {
    return (
      <input
        type="date"
        defaultValue={formatDateForInput(defaultValue)}
        className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66`}
        ref={ref}
        disabled={readOnly}
        {...props}
      />
    )
  } 
});

export { FormDatePicker }
