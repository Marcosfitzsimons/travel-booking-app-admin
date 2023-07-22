function convertToSpanishMonth(month: string) {
    const months: { [key: string]: string } = {
      January: "Enero",
      February: "Febrero",
      March: "Marzo",
      April: "Abril",
      May: "Mayo",
      June: "Junio",
      July: "Julio",
      August: "Agosto",
      September: "Septiembre",
      October: "Octubre",
      November: "Noviembre",
      December: "Diciembre",
    };

    // Convert the input to title case (e.g., "january" to "January")
    const formattedMonth =
      month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

    return months[formattedMonth] || "Invalid Month";
  }

 export {
    convertToSpanishMonth,
 }
