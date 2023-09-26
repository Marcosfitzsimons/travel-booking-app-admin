import { TripItemProps } from "@/types/props";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import TrashButtonDatatable from "./TrashButtonDatatable";
import {
  CalendarDays,
  Check,
  DollarSign,
  Edit,
  HelpingHand,
  Loader2,
  Milestone,
  Trash2,
  UserMinus2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DayCardType, PredefinedTrip } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import TimePickerContainer from "./TimePickerContainer";
import { translateDayOfWeek } from "@/lib/utils/translateDayOfWeek";
import GorgeousBorder from "./GorgeousBorder";
import GorgeousBoxBorder from "./GorgeousBoxBorder";

const TripItem = ({
  name,
  handleDelete,
  id,
  arrivalTime,
  departureTime,
  day,
  from,
  to,
  price,
  maxCapacity,
  items,
  setItems,
}: TripItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [departureTimeValue, setDepartureTimeValue] = useState("");
  const [arrivalTimeValue, setArrivalTimeValue] = useState("");
  console.log(items);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      from: "",
      to: "",
      price: 0,
      maxCapacity: 0,
    },
  });

  const { toast } = useToast();

  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleOnSubmitEdit = async (data: PredefinedTrip) => {
    if (
      !isDirty &&
      arrivalTime === arrivalTimeValue &&
      departureTime === departureTimeValue
    ) {
      return toast({
        variant: "destructive",
        description: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Es necesario
            realizar cambios antes de enviar
          </div>
        ),
      });
    }
    setIsSubmitted(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Editando viaje fijo...
        </div>
      ),
    });
    try {
      const res = await axiosPrivate.put(`/predefined-trips/${day}/${id}`, {
        updatedTripData: {
          ...data,
          departureTime: departureTimeValue,
          arrivalTime: arrivalTimeValue,
        },
      });
      setIsSubmitted(false);
      const editedIndex = items.findIndex(
        (item: DayCardType) => item._id === res.data._id
      );

      if (editedIndex !== -1) {
        // Create a new copy of the items array with the edited trip
        const updatedItems = [...items];
        updatedItems[editedIndex] = res.data;

        // Update the items state in the parent component
        setItems(updatedItems);
      }
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Viaje fijo
            ha sido editado con éxito
          </div>
        ),
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setIsSubmitted(false);
      toast({
        variant: "destructive",
        title: "Error al editar viaje fijo",
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al editar viaje fijo. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    setDepartureTimeValue(departureTime);
    setArrivalTimeValue(arrivalTime);
    reset({
      name: name,
      from: from,
      to: to,
      price: price,
      maxCapacity: maxCapacity,
    });
  }, []);

  return (
    <GorgeousBoxBorder className="">
      <li className="flex flex-col rounded-lg p-2 shadow-input border bg-input dark:shadow-none">
        <div className="flex flex-col">
          <p className="font-semibold">{name}</p>
          <span className="text-card-foreground text-sm">
            Horario de salida: {departureTime}
          </span>
        </div>
        <div className="flex items-center gap-2.5 self-end">
          <Dialog
            open={isDialogOpen}
            onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
          >
            <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
              <DialogTrigger asChild>
                <Button
                  className="h-[32px] px-3.5 pl-[35px] relative bg-teal-800/60 text-white shadow-input hover:text-white
dark:text-slate-100 dark:bg-teal-700/60 dark:hover:text-white dark:shadow-none"
                >
                  <Edit className="absolute left-3.5 w-4 h-4" />
                  Editar
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent
              className="relative pb-10"
              onOpenAutoFocus={(e) => e.preventDefault}
            >
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
                  Editar viaje fijo
                </DialogTitle>
                <DialogDescription className="text-center lg:text-lg">
                  Hace cambios en el viaje fijo
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(handleOnSubmitEdit)}
                className="relative w-full max-w-2xl mx-auto flex flex-col gap-3 py-6"
              >
                <div className="absolute top-0 right-0">
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
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
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
                      <p className="text-red-600 text-sm">
                        {errors.from.message}
                      </p>
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
                      <p className="text-red-600 text-sm">
                        {errors.to.message}
                      </p>
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
                      <p className="text-red-600 text-sm">
                        {errors.price.message}
                      </p>
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
                <DialogFooter className="max-w-[10rem] mx-auto">
                  <div className="w-full relative mt-2 after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                    <Button
                      disabled={isSubmitted}
                      className="relative w-full h-8 rounded-lg px-5 py-1.5 lg:py-0 bg-primary text-slate-100 hover:text-white dark:shadow-input dark:shadow-black/5 dark:text-slate-100 dark:hover:text-white"
                    >
                      Guardar cambios
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <div className="relative flex items-center">
              <AlertDialogTrigger>
                <TrashButtonDatatable
                  icon={
                    <Trash2 className="absolute left-1 top-[3px] h-4 w-4 md:h-[18px] md:w-[18px] md:left-0 md:top-[2px]" />
                  }
                  text="Borrar"
                />
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no podrá deshacerse. Esto eliminará
                  permanentemente este viaje fijo
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="md:w-auto">
                  No, volver al listado de viajes
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(day, id)}
                  className="w-full md:w-auto"
                >
                  Si, borrar viaje
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </li>
    </GorgeousBoxBorder>
  );
};

export default TripItem;
