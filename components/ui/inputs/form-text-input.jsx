"use client"

import { forwardRef } from "react"

const FormTextInput = forwardRef(({readOnly, defaultValue, ...props}, ref) => {
    return (
      <input
          type="text"
          defaultValue={defaultValue}
          className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66`}
          ref={ref}
          disabled={readOnly}
          {...props}
      />
    )
});

export { FormTextInput }