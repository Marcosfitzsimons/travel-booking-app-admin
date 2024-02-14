export const getCurrentMonth = () => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
  
    const currentDate = new Date().getMonth();
    const currentMonthName = months[currentDate];

    return currentMonthName
  }