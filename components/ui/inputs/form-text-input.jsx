import { cn } from "@/lib/utils"

function FormTextInput({ readOnly, value, onChange, className, ...props }) {
  if (value === undefined || value === null) {
    value = ""
  }
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={cn(`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66 ${readOnly ? "bg-gray-50" : ""}`, className)}
      disabled={readOnly}
      {...props}
    />
  )
}

export { FormTextInput }