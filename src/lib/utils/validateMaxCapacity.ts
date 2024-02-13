
export const validateMaxCapacity = (value: string, passengersLength: number) => {
    const maxCapacity = parseInt(value, 10);

    if (isNaN(maxCapacity)) {
      return "Por favor, ingresa un número válido";
    }

    if (maxCapacity < passengersLength) {
      return "La capacidad máxima debe ser mayor o igual al número actual de pasajeros";
    }

    return true;
  };