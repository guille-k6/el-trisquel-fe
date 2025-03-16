"use client"

import { forwardRef } from "react"
import { FormTextInput } from "./form-text-input";

const FormNumberInput = forwardRef(({readOnly, defaultValue, ...props}, ref) => {
  if(readOnly) {
    return (<FormTextInput readOnly={readOnly} defaultValue={formatPrice(defaultValue)} ref={ref} required {...props}/>)
  } else {
    return (
      <input
          type={ readOnly ? "text" : "number"}
          defaultValue={defaultValue}
          className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66`}
          ref={ref}
          disabled={readOnly}
          {...props}
      />)
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

export { FormNumberInput }