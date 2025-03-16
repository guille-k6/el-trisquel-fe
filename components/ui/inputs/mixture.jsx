"use client"

import { forwardRef } from "react"
import { FormNumberInput } from "./form-number-input";
import { FormTextInput } from "./form-text-input";

/**
 * test components
 */
const Mixture = forwardRef(({readOnly, defaultValue, ...props}, ref) => {
    if(readOnly){
        return (
            <FormTextInput
                readOnly={readOnly}
                defaultValue={'14500 pepee'}
                ref={ref}
                required
            />
            
        )
    } else {
        return (
            <FormNumberInput
                readOnly={readOnly}
                defaultValue={14500}
                ref={ref}
                required
            />
        );
    }
});

export default Mixture;
