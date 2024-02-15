export function formatNumberWithDot(number: number): string {
    // Convert the number to a string
    let numberStr: string = number.toString();
    
    if (number < 1000) {
        return numberStr;
    }
    
    let formattedNumber: string = '';
    
    let dotPosition: number = numberStr.length % 3;
    if (dotPosition === 0) {
        dotPosition = 3;
    }
    
    if (dotPosition !== numberStr.length) {
        formattedNumber += numberStr.slice(0, dotPosition) + '.';
    }
    
    for (let i = dotPosition; i < numberStr.length; i += 3) {
        formattedNumber += numberStr.slice(i, i + 3);
        if (i + 3 < numberStr.length) {
            formattedNumber += '.';
        }
    }
    
    return formattedNumber;
}
