import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import DatePickerContainer from "./DatePickerContainer";
import TimePickerContainer from "./TimePickerContainer";
import { NewTripFormProps } from "../types/props";
import { Checkbox } from "./ui/checkbox";
import { Check, Loader2, Users, X } from "lucide-react";
import { NewSpecialTrip } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";

const NewSpecialTripForm = ({ inputs }: NewTripFormProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [departureTimeValue, setDepartureTimeValue] = useState("10:00");
  const [isAddPassengers, setIsAddPassengers] = useState(false);
  const [defaultPassengerCount, setDefaultPassengerCount] = useState(1);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

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

  const handleOnSubmit = async (data: NewSpecialTrip) => {
    const { defaultPassengerCount } = data;
    setLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Creando viaje...
        </div>
      ),
    });
    try {
      await axiosPrivate.post(`/special-trips`, {
        ...data,
        date: startDate,
        departureTime: departureTimeValue,
        add_passengers: isAddPassengers,
        default_passenger_count: defaultPassengerCount,
      });
      setLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Viaje creado
            con éxito
          </div>
        ),
      });
      navigate("/special-trips");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setLoading(false);
      const errorMsg = err.response?.data?.msg;
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al crear
            viaje
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al crear viaje. Por favor, intentar más tarde",
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
          <DefaultButton loading={loading}>Crear viaje</DefaultButton>
        </div>
      </div>
    </form>
  );
};

export default NewSpecialTripForm;
