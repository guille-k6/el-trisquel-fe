"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"

import { FormDatePicker } from "./inputs/form-date-picker"
import { FormNumberInput } from "./inputs/form-number-input"
import { FormTextInput } from "./inputs/form-text-input"
import { FormCombo } from "./inputs/formCombo/form-combo"

export function SmartFilter({
  filtersList,
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  applyButtonText = "Filtrar",
  clearButtonText = "Limpiar",
  className = "",
}) {

    const hasActiveFilters = () => {
        return filtersList.some((config) => {
            const value = filters[config.propertyName]
            return value !== null && value !== undefined && value !== ""
        })
    }

    const getSelectedOption = (config) => {
        if (config.type !== "SELECT" || !config.options) return null

        const value = filters[config.propertyName]
        const valueKey = config.valueKey || "id"

        return config.options.find((option) => option[valueKey] === value) || null
    }

    const renderFilterInput = (config) => {
        const { type, propertyName, placeholder, options, displayKey = "name", valueKey = "id" } = config
        const value = filters[propertyName]

        switch (type) {
        case "DATE":
            return (<FormDatePicker id={propertyName} value={value || ""} onChange={(e) => onFilterChange(propertyName, e.target.value)}/>)

        case "SELECT":
            if (!options) {
                console.warn(`SELECT filter "${propertyName}" requires options array`)
                return null
            }
            const selectedOption = getSelectedOption(config)
            return (
            <FormCombo id={propertyName} options={options} placeholder={placeholder || `Seleccionar ${config.displayName.toLowerCase()}`}
                onChange={(option) => onFilterChange(propertyName, option?.[valueKey] || null)}
                displayKey={displayKey} valueKey={valueKey} defaultValue={selectedOption}
            />)

        case "TEXT":
            return (<FormTextInput id={propertyName} value={value || ""} placeholder={placeholder || `Buscar por ${config.displayName.toLowerCase()}`} 
                    onChange={(e) => onFilterChange(propertyName, e.target.value)}
                    />)

        case "NUMBER":
            return (<FormNumberInput id={propertyName} value={value || ""} placeholder={placeholder || `Filtrar por ${config.displayName.toLowerCase()}`} 
                    onChange={(e) => onFilterChange(propertyName, e.target.value ? Number(e.target.value) : null)}
                    />)

        default:
            console.warn(`Unknown filter type: ${type}`)
            return null
        }
    }

  const getGridCols = () => {
    const count = filtersList.length
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2"
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    if (count <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  }

  return (
    <Card className={`mb-6 ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className={`grid ${getGridCols()} gap-4 flex-1`}>
            {filtersList.map((config) => (
              <div key={config.propertyName} className="space-y-2">
                <Label htmlFor={config.propertyName}>
                  {config.displayName}
                  {config.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {renderFilterInput(config)}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={onApplyFilters} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              {applyButtonText}
            </Button>

            {hasActiveFilters() && (
              <Button onClick={onClearFilters} variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" />
                {clearButtonText}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}