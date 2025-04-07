"use client"

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormNumberInput } from "@/components/ui/inputs/form-number-input";
import Mixture from "@/components/ui/inputs/mixture";

const Page = () => {
    const [editable, setEditable] = useState(false);
    const numberRef = useRef(null);
    const vehicle = {
        id: 1,
        name: "Hilux mod 2020",
        purchaseDate: "2024-01-01T03:00:00.000+00:00",
        purchaseDatePrice: 60000,
    }
    
    return (
        <div className="min-h-screen p-4 max-w-2xl mx-auto">
            <Link href="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a vehículos
            </Link>
            <FormNumberInput
                readOnly={editable}
                defaultValue={14500}
                ref={numberRef}
                required
            />
            <Mixture
                readOnly={editable}
                defaultValue={14500}
                ref={numberRef}
                required
            />
        </div>
    );
};
  

export default Page;
