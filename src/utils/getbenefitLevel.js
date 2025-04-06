export const getThirdDigitFromLeft = (str) => {
    if (str.length < 10 || str.length > 10) {
        return null; 
    }
    return str[2]; 
}

