"use client"

import { useEffect, useState } from "react"
import { FormCombo } from "@/components/ui/inputs/formCombo/form-combo";
import { fetchVehicles } from "@/lib/vehicle/api";


export default function Page() {
    const [vehicles, setVehicles] = useState([])

    useEffect(() => {
      async function loadVehicles() {
        const data = await fetchVehicles()
        setVehicles(data)
      }
  
      loadVehicles()
    }, [])

    const handleVehicleSelect = (vehicle) => {
        console.log("Selected vehicle:", vehicle)
    }
    
    return (
        <div className="min-h-screen p-4 max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <FormCombo options={vehicles} placeholder="Vehículo..." onChange={handleVehicleSelect} />
            </div>
        </div>
    );
};
