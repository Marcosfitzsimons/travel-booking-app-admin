import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import DatePickerContainer from "./DatePickerContainer";
import TimePickerContainer from "./TimePickerContainer";
import { Separator } from "./ui/separator";
import { NewTripFormProps } from "@/types/props";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { Trip } from "@/types/types";
import { Check, Loader2, X } from "lucide-react";

const NewTripForm = ({ inputs }: NewTripFormProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [arrivalTimeValue, setArrivalTimeValue] = useState("10:00");
  const [departureTimeValue, setDepartureTimeValue] = useState("10:00");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      date: "",
      from: "",
      departureTime: "10:00",
      arrivalTime: "10:00",
      to: "",
      price: undefined,
      maxCapacity: 19,
    },
  });

  const handleOnSubmit = async (data: Trip) => {
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
      await axiosPrivate.post(`/trips`, {
        ...data,
        date: startDate,
        departureTime: departureTimeValue,
        arrivalTime: arrivalTimeValue,
      });
      setLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Viaje ha
            sido creado con éxito
          </div>
        ),
      });
      navigate("/trips");
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
            <Label htmlFor="departureTime">Horario de salida</Label>
            <TimePickerContainer
              value={departureTimeValue}
              onChange={setDepartureTimeValue}
            />
          </div>
          <Separator className="w-2" />
          <div className="grid w-full items-center gap-2 lg:w-[155px]">
            <Label htmlFor="arrivalTime">Horario de llegada</Label>
            <TimePickerContainer
              value={arrivalTimeValue}
              onChange={setArrivalTimeValue}
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
              <p className="text-red-600 text-sm">
                {errors[input.id as keyof typeof errors]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="w-full mt-2 lg:w-[9rem] lg:justify-self-end lg:self-end">
          <DefaultButton loading={loading}>Crear viaje</DefaultButton>
        </div>
      </div>
    </form>
  );
};

export default NewTripForm;
