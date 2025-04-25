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
  const [value, setValue] = useState(() => {
    if (!defaultValue) return "";
    
    if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
      return defaultValue;
    }
    
    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return defaultValue[valueKey] || "";
    }
    
    return "";
  });
  
  const [search, setSearch] = useState("")
  const [filteredOptions, setFilteredOptions] = useState(options.slice(0, 10))
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle options load
  useEffect(() => {
    if (options.length > 0 && defaultValue && initialLoad) {
      // Find the matching option if defaultValue is an object with displayKey
      if (typeof defaultValue === 'object' && defaultValue !== null && defaultValue[displayKey]) {
        const foundOption = options.find(opt => 
          opt[displayKey] === defaultValue[displayKey] || 
          opt[valueKey] === defaultValue[valueKey]
        );
        
        if (foundOption) {
          setValue(foundOption[valueKey]);
        }
      }
      // If defaultValue is just the display text (name), try to find that option
      else if (typeof defaultValue === 'string') {
        const foundOption = options.find(opt => 
          opt[displayKey] === defaultValue || 
          String(opt[valueKey]) === defaultValue
        );
        
        if (foundOption) {
          setValue(foundOption[valueKey]);
        }
      }
      
      setInitialLoad(false);
    }
  }, [options, defaultValue, initialLoad, displayKey, valueKey]);

  // Filter options based on search text
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
      // Using data attributes to identify our component elements
      const isInsideDropdown = event.target.closest('[data-combobox="container"]');
      if (!isInsideDropdown) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  // Handle opening the dropdown
  const handleOpen = () => {
    if (!readOnly) {
      if (!open) {
        setSearch("") // Reset search when opening
      }
      setOpen(!open)
    }
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
    
    const selectedOption = options.find((option) => 
      option[valueKey]?.toString() === value?.toString()
    );
    
    return selectedOption ? selectedOption[displayKey] : ""
  }

  return (
    <div className="relative w-full" data-combobox="container">
      <div className="relative">
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-66 pr-10",
            readOnly ? 'bg-gray-50' : '',
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
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          data-combobox="dropdown"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option[valueKey] || index}
                className={cn(
                  "relative flex cursor-pointer select-none items-center py-1.5 px-3 text-sm hover:bg-gray-100",
                  value?.toString() === option[valueKey]?.toString() && "bg-blue-50",
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
            <div className="relative flex items-center py-1.5 px-3 text-sm text-gray-500">No se encontraron resultados</div>
          )}
        </div>
      )}
    </div>
  )
}

export { FormCombo }