export function formatNumberWithDot(number: number): string {
    // Convert the number to a string
    let numberStr: string = number.toString();
    
    // If the number is less than 1000, return it as is
    if (number < 1000) {
        return numberStr;
    }
    
    // Initialize the formatted string
    let formattedNumber: string = '';
    
    // Determine the position to start adding dots
    let dotPosition: number = numberStr.length % 3;
    if (dotPosition === 0) {
        dotPosition = 3;
    }
    
    // Add the first part before the first dot (if necessary)
    if (dotPosition !== numberStr.length) {
        formattedNumber += numberStr.slice(0, dotPosition) + '.';
    }
    
    // Iterate over the rest of the string, adding dots every three characters
    for (let i = dotPosition; i < numberStr.length; i += 3) {
        formattedNumber += numberStr.slice(i, i + 3);
        if (i + 3 < numberStr.length) {
            formattedNumber += '.';
        }
    }
    
    return formattedNumber;
}
