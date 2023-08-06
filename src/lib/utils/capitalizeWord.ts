export const capitalizeWord = (string: any) => {
    const firstLetter = string.charAt(0).toUpperCase();
    const restOfString = string.slice(1).toLowerCase();
    return firstLetter + restOfString;
  };