"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FormCombo = ({
  options = [],
  placeholder = "Selecciona...",
  readOnly,
  defaultValue,
  onChange,
  displayKey = "name",
  valueKey = "id",
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  const [filteredOptions, setFilteredOptions] = useState(options.slice(0, 10))

  // Sync value with defaultValue when it changes
  useEffect(() => {
    if (defaultValue) {
      let newValue = ""

      if (typeof defaultValue === "string" || typeof defaultValue === "number") {
        newValue = defaultValue
      } else if (typeof defaultValue === "object" && defaultValue !== null) {
        newValue = defaultValue[valueKey] || ""
      }

      if (newValue !== value) {
        setValue(newValue)
      }
    } else {
      setValue("")
    }
  }, [defaultValue, valueKey])

  // Filter options based on search input
  useEffect(() => {
    if (!search) {
      setFilteredOptions(options.slice(0, 10))
    } else {
      const filtered = options
        .filter((option) =>
          option[displayKey]?.toString().toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 10)
      setFilteredOptions(filtered)
    }
  }, [search, options, displayKey])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInside = event.target.closest('[data-combobox="container"]')
      if (!isInside) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleOpen = () => {
    if (!readOnly) {
      if (!open) setSearch("")
      setOpen(!open)
    }
  }

  const handleSelect = (option) => {
    setValue(option[valueKey])
    setSearch("")
    setOpen(false)
    if (onChange) {
      onChange(option)
    }
  }

  const getDisplayText = () => {
    if (!value || !options.length) return ""
    const selectedOption = options.find(
      (option) => option[valueKey]?.toString() === value?.toString()
    )
    return selectedOption ? selectedOption[displayKey] : ""
  }

  return (
    <div className="relative w-full" data-combobox="container">
      <div className="relative">
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66 pr-10",
            readOnly ? "bg-gray-50" : "",
            className
          )}
          placeholder={placeholder}
          disabled={readOnly}
          value={open ? search : getDisplayText()}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!open) setOpen(true)
          }}
          onClick={handleOpen}
          {...props}
        />
        {!readOnly && (
          <button
            type="button"
            onClick={handleOpen}
            className="absolute right-0 top-0 h-full px-2 flex items-center justify-center"
            tabIndex={-1}
            data-combobox="toggle-button"
          >
            <ChevronsUpDown className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {open && !readOnly && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          data-combobox="dropdown"
          style={{
            position: "absolute",
            zIndex: 9999,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option[valueKey] || index}
                className={cn(
                  "relative flex cursor-pointer select-none items-center py-1.5 px-3 text-sm hover:bg-gray-100",
                  value?.toString() === option[valueKey]?.toString() && "bg-blue-50"
                )}
                onClick={() => handleSelect(option)}
                data-combobox="option"
              >
                <span className="flex-1 truncate">{option[displayKey]}</span>
                {value?.toString() === option[valueKey]?.toString() && (
                  <Check className="h-4 w-4 text-blue-500 ml-2" />
                )}
              </div>
            ))
          ) : (
            <div className="relative flex items-center py-1.5 px-3 text-sm text-gray-500">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { FormCombo }
