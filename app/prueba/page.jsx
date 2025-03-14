"use client"

import { TextInput } from "@/components/ui/inputs/text-input";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page = () => {
    const vehicle = {
        id: 1,
        name: "Hilux mod 2020",
        purchaseDate: "2024-01-01T03:00:00.000+00:00",
        purchaseDatePrice: 60000,
    }
    const [editable, setEditable] = useState(false);
    const inputRef = useRef(null);
    
    return (
        <div className="min-h-screen p-4 max-w-2xl mx-auto">
            <Link href="/vehiculos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a vehículos
            </Link>

            <TextInput readOnly={!editable} defaultValue={vehicle.name} ref={inputRef}/>
            {editable ? (<Button onClick={e => setEditable(!editable)}>Editar</Button>) :
                        (<Button onClick={e => setEditable(!editable)}>Guardar</Button>)
            }
            
        </div>
    );
};

export default Page;
