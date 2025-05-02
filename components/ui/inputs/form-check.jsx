"use client"

function FormCheckInput({ readOnly, value, onChange, className = "", ...props }) {
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={onChange}
      className={`h-5 w-5 rounded border border-gray-300 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66 ${readOnly ? "bg-gray-50" : ""} ${className}`}
      disabled={readOnly}
      {...props}
    />
  )
}

export { FormCheckInput }