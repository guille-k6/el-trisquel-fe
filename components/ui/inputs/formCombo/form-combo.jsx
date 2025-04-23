"use client"

import { forwardRef, useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FormCombo = forwardRef(
  (
    {
      options = [],
      placeholder = "Select an option...",
      readOnly,
      defaultValue,
      onChange,
      displayKey = "name",
      valueKey = "id",
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(defaultValue || "")
    const [search, setSearch] = useState("")
    const [filteredOptions, setFilteredOptions] = useState(options.slice(0, 10))
    const containerRef = useRef(null)
    const inputRef = useRef(null)
    const combinedRef = (node) => {
      // Forward the ref to both our internal ref and the external ref
      inputRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    // Filter options based on search text
    useEffect(() => {
      if (!search) {
        setFilteredOptions(options.slice(0, 10))
      } else {
        const filtered = options
          .filter((option) => option[displayKey].toLowerCase().includes(search.toLowerCase()))
          .slice(0, 10)
        setFilteredOptions(filtered)
      }
    }, [search, options, displayKey])

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    // Handle opening the dropdown
    const handleOpen = () => {
      if (!open) {
        setSearch("") // Reset search when opening
      }
      setOpen(!open)
    }

    // Handle selection
    const handleSelect = (option) => {
      setValue(option[valueKey])
      setSearch("") // Reset search after selection
      setOpen(false)
      if (onChange) {
        onChange(option)
      }
    }

    // Find display text for selected value
    const getDisplayText = () => {
      if (!value) return ""
      const selectedOption = options.find((option) => option[valueKey] === value)
      return selectedOption ? selectedOption[displayKey] : ""
    }

    return (
      <div className="relative w-full" ref={containerRef}>
        <div className="relative">
          <input
            type="text"
            ref={combinedRef}
            className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66 pr-10`}
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
          <button
            type="button"
            onClick={handleOpen}
            className="absolute right-0 top-0 h-full px-2 flex items-center justify-center"
            tabIndex={-1}
          >
            <ChevronsUpDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {open && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option[valueKey] || index}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center py-1.5 px-3 text-sm hover:bg-gray-100",
                    value === option[valueKey] && "bg-blue-50",
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span className="flex-1 truncate">{option[displayKey]}</span>
                  {value === option[valueKey] && <Check className="h-4 w-4 text-blue-500 ml-2" />}
                </div>
              ))
            ) : (
              <div className="relative flex items-center py-1.5 px-3 text-sm text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
    )
  },
)

FormCombo.displayName = "FormCombo"

export { FormCombo }