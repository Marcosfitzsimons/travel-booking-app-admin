import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import DatePickerContainer from "./DatePickerContainer";
import TimePickerContainer from "./TimePickerContainer";
import { NewTripFormProps } from "../types/props";
import { Checkbox } from "./ui/checkbox";
import { Users } from "lucide-react";

type Trip = {
  name: string;
  date: Date | null;
  from: string;
  departureTime: string; // or number
  maxCapacity: number;
  price: string;
  defaultPassengerCount: number;
};

const NewSpecialTripForm = ({ inputs }: NewTripFormProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [departureTimeValue, setDepartureTimeValue] = useState("10:00");
  const [isAddPassengers, setIsAddPassengers] = useState(false);
  const [defaultPassengerCount, setDefaultPassengerCount] = useState(1);
  const [err, setErr] = useState<null | string>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      date: null,
      from: "",
      departureTime: "07:00",
      price: "",
      maxCapacity: 19,
      defaultPassengerCount: defaultPassengerCount,
    },
  });

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleOnSubmit = async (data: Trip) => {
    const { defaultPassengerCount } = data;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/special-trips`,
        {
          ...data,
          date: startDate,
          departureTime: departureTimeValue,
          add_passengers: isAddPassengers,
          default_passenger_count: defaultPassengerCount,
        },
        { headers }
      );
      console.log(res);
      toast({
        description: "Viaje creado con éxito.",
      });
      navigate("/special-trips");
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setErr(errorMsg);
      toast({
        description: "Error al crear viaje. Intentar más tarde.",
      });
    }
  };

  const validateDefaultPassengerCount = async (
    value: any,
    maxCapacity: number
  ) => {
    const defaultPassengers = parseInt(value, 10);

    if (isNaN(defaultPassengers)) {
      return "Por favor, ingresa un número válido.";
    }

    if (defaultPassengers >= maxCapacity) {
      return "El número de pasajeros por defecto debe ser menor a la capacidad máxima.";
    }

    return true;
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="relative w-full flex flex-col gap-3 p-3 py-6"
    >
      <div className="w-full flex flex-col gap-2 items-center lg:basis-2/3 lg:grid lg:grid-cols-2 lg:gap-3">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="date">Fecha</Label>
          <DatePickerContainer
            setStartDate={setStartDate}
            startDate={startDate}
          />
        </div>
        <div className="w-full flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid w-full items-center gap-2 lg:w-[155px]">
            <Label htmlFor="departureTime">Horario de salida:</Label>
            <TimePickerContainer
              value={departureTimeValue}
              onChange={setDepartureTimeValue}
            />
          </div>
          {err && <p className="text-red-600 self-start">{err}</p>}{" "}
        </div>
        {inputs.map((input) => (
          <div key={input.id} className="grid w-full items-center gap-2">
            <Label htmlFor={input.id}>{input.label}</Label>
            <div className="relative flex items-center">
              {input.icon}
              <Input
                type={input.type}
                id={input.id}
                placeholder={input.placeholder}
                className="pl-8"
                {...register(input.id, input.validation)}
              />
            </div>
            {errors[input.id as keyof typeof errors] && (
              <p className="text-red-600">
                {errors[input.id as keyof typeof errors]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center self-start space-x-1">
            <Checkbox
              id="defaultPassengers"
              checked={isAddPassengers}
              onCheckedChange={() => setIsAddPassengers((prev) => !prev)}
            />
            <label
              htmlFor="defaultPassengers"
              className="text-sm font-medium flex items-center gap-[2px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Agregar pasajeros por defecto
            </label>
          </div>
          {isAddPassengers ? (
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="defaultPassengerCount">
                Pasajeros por defecto
              </Label>
              <div className="relative flex items-center">
                <Users className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                <Input
                  type="number"
                  id="defaultPassengerCount"
                  placeholder="5"
                  className="pl-8"
                  {...register("defaultPassengerCount", {
                    min: {
                      value: 1,
                      message:
                        "Pasajeros por defecto no pueden ser menor que 1",
                    },
                    validate: (value) =>
                      validateDefaultPassengerCount(
                        value,
                        getValues("maxCapacity")
                      ), // Using the custom validation function
                    max: {
                      value: 25,
                      message: "Pasajeros por defecto no pueden ser mayor a 25",
                    },
                  })}
                />
              </div>
              {errors.defaultPassengerCount && (
                <p className="text-red-600 text-sm">
                  {errors.defaultPassengerCount.message}
                </p>
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="w-full mt-2 lg:w-[9rem] lg:col-start-1 lg:col-end-3 lg:justify-self-center lg:self-center">
          <DefaultButton>Crear viaje</DefaultButton>
        </div>
      </div>
    </form>
  );
};

export default NewSpecialTripForm;
