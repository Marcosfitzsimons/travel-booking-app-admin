import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import TimePickerContainer from "../TimePickerContainer";
import { Input } from "../ui/input";
import { DayCardType, PredefinedTrip } from "@/types/types";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  CalendarDays,
  Check,
  DollarSign,
  HelpingHand,
  Loader2,
  Milestone,
  UserMinus2,
  X,
} from "lucide-react";
import { NewPredefinedTripDialogProps } from "@/types/props";
import { translateDayOfWeek } from "@/lib/utils/translateDayOfWeek";
import { Button } from "../ui/button";
import GorgeousBorder from "../GorgeousBorder";

const NewPredefinedTripDialog = ({
  day,
  setItems,
}: NewPredefinedTripDialogProps) => {
  const [arrivalTimeValue, setArrivalTimeValue] = useState("10:00");
  const [departureTimeValue, setDepartureTimeValue] = useState("10:00");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [err, setErr] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      from: "",
      departureTime: "10:00",
      arrivalTime: "10:00",
      to: "",
      price: undefined,
      maxCapacity: 19,
    },
  });

  const handleOnSubmitTrip = async (data: PredefinedTrip) => {
    setIsSubmitted(true);
    setErr(false);
    // update...
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Creando viaje fijo...
        </div>
      ),
    });
    try {
      const res = await axiosPrivate.post(
        `/predefined-trips/new-predefined-trip/${day}`,
        {
          tripData: {
            ...data,
            departureTime: departureTimeValue,
            arrivalTime: arrivalTimeValue,
          },
        }
      );
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Viaje fijo
            ha sido creado con éxito
          </div>
        ),
      });
      setItems((prevItems: DayCardType[]) => {
        const dayIndex = prevItems.findIndex((item) => item.dayOfWeek === day);

        // Create a copy of the items array to avoid mutating the state directly
        const updatedItems = [...prevItems];

        if (dayIndex !== -1) {
          updatedItems[dayIndex].trips = res.data.trips;
        }

        return updatedItems;
      });
      setIsSubmitted(false);
      setIsDialogOpen(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setIsSubmitted(false);
      setErr(true);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al crear
            viaje fijo
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al crear viaje fijo. Por favor, intentar más tarde",
      });
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <div className="flex items-center relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 after:transition focus-within:after:shadow-slate-400 dark:after:shadow-highlight dark:after:shadow-zinc-500/50 dark:focus-within:after:shadow-slate-100 dark:hover:text-white">
        <DialogTrigger asChild>
          <Button className="h-8 py-0.5 px-5 outline-none inline-flex items-center justify-center font-medium transition-colors text-base rounded-lg shadow-input bg-card border border-slate-400/60 hover:bg-white  dark:border-slate-800 dark:hover:bg-black dark:shadow-none dark:hover:text-white">
            Agregar viaje
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="py-10">
        <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>
        <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px] transition-transform ">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl lg:text-3xl">
            Agregar viaje fijo
          </DialogTitle>
          <DialogDescription className="text-center lg:text-lg">
            Información acerca del viaje fijo
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleOnSubmitTrip)}
          className="w-full flex flex-col gap-3 py-6"
        >
          <div className="relative w-full flex max-w-2xl mx-auto flex-col items-center gap-3">
            <div className="absolute -top-6 right-0">
              <GorgeousBorder>
                <p className="flex select-none gap-1 h-[32px] px-4 items-center justify-between bg-card rounded-lg border border-slate-400/60 shadow-input placeholder:text-neutral-500 dark:bg-card dark:border-slate-800 dark:text-white dark:shadow-none !outline-none">
                  <CalendarDays className="w-5 h-5 relative bottom-[1px]" />
                  {translateDayOfWeek(day)}
                </p>
              </GorgeousBorder>
            </div>
            <div className="grid w-full max-w-2xl items-center gap-2">
              <Label htmlFor="name">Nombre del viaje</Label>
              <div className="relative flex items-center">
                <HelpingHand className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                <Input
                  type="text"
                  id="name"
                  className="pl-8"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Por favor, ingresar nombre del viaje.",
                    },
                    minLength: {
                      value: 3,
                      message: "Nombre del viaje no puede ser tan corto.",
                    },
                    maxLength: {
                      value: 30,
                      message: "Nombre del viaje no puede ser tan largo.",
                    },
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="w-full flex flex-col max-w-2xl gap-2 sm:flex-row sm:items-center">
              <div className="w-full flex items-center max-w-2xl gap-2">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="departureTime">Horario de salida:</Label>
                  <TimePickerContainer
                    value={departureTimeValue}
                    onChange={setDepartureTimeValue}
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="arrivalTime">Horario de llegada:</Label>
                  <TimePickerContainer
                    value={arrivalTimeValue}
                    onChange={setArrivalTimeValue}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col max-w-2xl gap-2 sm:flex-row sm:items-center">
              <div className="grid w-full max-w-md items-center gap-2">
                <Label htmlFor="from">Desde</Label>
                <div className="relative flex items-center">
                  <Milestone className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                  <Input
                    type="text"
                    id="from"
                    className="pl-8"
                    {...register("from", {
                      required: {
                        value: true,
                        message: "Por favor, ingresar lugar de salida.",
                      },
                      minLength: {
                        value: 3,
                        message: "Lugar de salida no puede ser tan corto.",
                      },
                      maxLength: {
                        value: 25,
                        message: "Lugar de salida no puede ser tan largo.",
                      },
                    })}
                  />
                </div>

                {errors.from && (
                  <p className="text-red-600 text-sm">{errors.from.message}</p>
                )}
              </div>
              <div className="grid w-full max-w-md items-center gap-2">
                <Label htmlFor="to">Hasta</Label>
                <div className="relative flex items-center">
                  <Milestone className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                  <Input
                    type="text"
                    id="to"
                    className="pl-8"
                    {...register("to", {
                      required: {
                        value: true,
                        message: "Por favor, ingresar lugar de llegada.",
                      },
                      minLength: {
                        value: 3,
                        message: "Lugar de llegada no puede ser tan corto.",
                      },
                      maxLength: {
                        value: 25,
                        message: "Lugar de llegada no puede ser tan largo.",
                      },
                    })}
                  />
                </div>

                {errors.to && (
                  <p className="text-red-600 text-sm">{errors.to.message}</p>
                )}
              </div>
            </div>

            <div className="w-full flex items-center max-w-2xl gap-2">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="price">Precio</Label>
                <div className="relative flex items-center">
                  <DollarSign className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                  <Input
                    type="number"
                    id="price"
                    className="pl-8"
                    {...register("price", {
                      required: {
                        value: true,
                        message:
                          "Por favor, ingresar precio/persona del viaje.",
                      },
                    })}
                  />
                </div>

                {errors.price && (
                  <p className="text-red-600 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="maxCapacity">Capacidad máxima</Label>
                <div className="relative flex items-center">
                  <UserMinus2 className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                  <Input
                    type="number"
                    id="maxCapacity"
                    className="pl-8"
                    {...register("maxCapacity", {
                      required:
                        "Por favor, ingresar capacidad máxima del viaje.",
                    })}
                  />
                </div>
                {errors.maxCapacity && (
                  <p className="text-red-600 text-sm">
                    {errors.maxCapacity.message}
                  </p>
                )}
              </div>
            </div>
            {err && (
              <p className="text-red-600 text-sm self-start lg:col-start-1 lg:col-end-3 lg:justify-self-center">
                Ha ocurrido un error. Intentar más tarde
              </p>
            )}
            <div className="mx-auto">
              <div className="w-full relative mt-2 after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                <Button
                  className="relative w-full h-8 rounded-lg px-10 py-1.5 lg:py-0 bg-primary text-slate-100 hover:text-white dark:shadow-input dark:shadow-black/5 dark:text-slate-100 dark:hover:text-white"
                  disabled={isSubmitted}
                >
                  Crear viaje
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPredefinedTripDialog;
