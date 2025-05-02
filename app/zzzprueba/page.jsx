"use client"

import { useEffect, useState } from "react"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo"
import { fetchVehicles } from "@/lib/vehicle/api"
import { FormCheckInput } from "@/components/ui/inputs/form-check"

export default function Page() {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicles, setSelectedVehicles] = useState({})
  const [isChecked, setChecked] = useState(false);
  
  const testData = [
    { num: 1, nombre: "pepe" },
    { num: 2, nombre: "pepe2" },
    { num: 3, nombre: "pepe3" },
  ]

  useEffect(() => {
    async function loadVehicles() {
      const data = await fetchVehicles()
      setVehicles(data)
    }
    loadVehicles()
  }, [])

  function handleVehicleSelect(id) {
    return function(vehicle) {
        setSelectedVehicles(function(prev) {
        return {
        ...prev,
        [id]: vehicle
        };
    });
    };
  }

  function handleCheckChange(e){
    console.log(e.target.checked);
    
    setChecked(e.target.checked)
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold mb-4">Selected Vehicles:</h2>
        <pre className="bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-60">
          {JSON.stringify(selectedVehicles, null, 2)}
        </pre>
      </div>
      
      <div className="space-y-4">
        {testData.map((data) => (
          <div key={data.num} className="border p-4 rounded-md bg-white shadow-sm">
            <label className="block text-sm font-medium mb-2">
              Vehicle for {data.nombre} (ID: {data.num})
            </label>
            <FormCheckInput
              value={isChecked}
              onChange={handleCheckChange}
              disabled={true}
            />
            <FormCombo 
              options={vehicles}
              placeholder="Select a vehicle..."
              onChange={handleVehicleSelect(data.num)}
              displayKey="name"
              valueKey="id"
              defaultValue={data.num === 1 && vehicles.length > 0 ? vehicles[0] : undefined}
            />
            {selectedVehicles[data.num] && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedVehicles[data.num].name || JSON.stringify(selectedVehicles[data.num])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}