import { validateInsuranceCode } from "./function";

export const getThirdDigitFromLeft = (str) => {
    if (!validateInsuranceCode(str)) {
        return null;
    }
    return str[2];
}

