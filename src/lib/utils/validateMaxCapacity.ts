
export const validateMaxCapacity = (value: string, passengersLength: number) => {
    const maxCapacity = parseInt(value, 10);

    if(maxCapacity === 0) {
      return "La capacidad máxima no puede ser 0";
    }

    if (isNaN(maxCapacity)) {
      return "Por favor, ingresa un número válido";
    }

    if (maxCapacity < passengersLength) {
      return "La capacidad máxima debe ser mayor o igual al número actual de pasajeros";
    }

    return true;
  };