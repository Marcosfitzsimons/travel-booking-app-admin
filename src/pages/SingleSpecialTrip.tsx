import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import { specialPassengerColumns } from "../datatablesource";
import BackButton from "../components/BackButton";
import SpecialPassengersDatatable from "../components/datatables/SpecialPassengersDatatable";
import SectionTitle from "../components/SectionTitle";
import Loading from "../components/Loading";
import DefaultButton from "../components/DefaultButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/ui/use-toast";
import DatePickerContainer from "../components/DatePickerContainer";
import TimePickerContainer from "../components/TimePickerContainer";
import { Separator } from "../components/ui/separator";
import { convertToDatePickerFormat } from "@/lib/utils/convertToDatePickerFormat";
import { SpecialTrip, UpdateSpecialTripPayload } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import DialogAnonSpecialPassenger from "@/components/dialogs/DialogAnonSpecialPassenger";
import Error from "@/components/Error";
import TripTime from "@/components/TripTime";
import TripCardDataBox from "@/components/TripCardDataBox";
import TripDate from "@/components/TripDate";
import TodayDate from "@/components/TodayDate";
import GorgeousBorder from "@/components/GorgeousBorder";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import { validateMaxCapacity } from "@/lib/utils/validateMaxCapacity";
import { Icons } from "@/components/icons";
import { convertToArgDate } from "@/lib/utils/convertToArgDate";

const INITIAL_STATES = {
  _id: "",
  name: "",
  date: null,
  from: "",
  departureTime: "",
  to: "",
  maxCapacity: undefined,
  price: undefined,
  passengers: [],
};

const SingleSpecialTrip = () => {
  const [tripData, setTripData] = useState(INITIAL_STATES);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [departureTimeValue, setDepartureTimeValue] = useState("10:00");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMaxCapacity = passengers.length === tripData.maxCapacity;
  const passengersCount = `${passengers.length} / ${tripData.maxCapacity}`;

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });

  const { setAuth } = useAuth();
  let { id } = useParams();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      from: "",
      date: undefined,
      to: "",
      departureTime: "",
      price: "",
      maxCapacity: "",
    },
  });

  const handleOnSubmit = async (data: UpdateSpecialTripPayload) => {
    if (
      !isDirty &&
      tripData.departureTime === departureTimeValue &&
      tripData.date === convertToArgDate(date)
    ) {
      return toast({
        variant: "destructive",
        description: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />} Es
            necesario realizar cambios antes de enviar
          </div>
        ),
      });
    }
    setIsSubmitted(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Icons.spinner className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Editando viaje...
        </div>
      ),
    });
    try {
      const res = await axiosPrivate.put(`/special-trips/${id}`, {
        ...data,
        date: date,
        departureTime: departureTimeValue,
      });
      setIsSubmitted(false);
      setIsDialogOpen(false);
      setTripData({ ...res.data, date: convertToArgDate(res.data.date) });
      toast({
        description: (
          <div className="flex gap-1">
            {<Icons.check className="h-5 w-5 text-green-600 shrink-0" />} Viaje
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
        title: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al editar viaje
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al editar viaje. Por favor, intentar más tarde",
      });
    }
  };

  const handleDelete = async (passengerId: string) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Icons.spinner className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Cancelando lugar...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`/special-passengers/${passengerId}/${id}`, {});
      toast({
        description: (
          <div className="flex gap-1">
            {<Icons.check className="h-5 w-5 text-green-600 shrink-0" />} Lugar
            cancelado con éxito
          </div>
        ),
      });
      setIsLoading(false);
      setPassengers(passengers.filter((item) => item._id !== passengerId));
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al cancelar lugar
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al cancelar lugar. Por favor, intentar más tarde",
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosPrivate.get(`/special-trips/${id}`);
      setLoading(false);
      setPassengers(res.data.passengers);
      setTripData({ ...res.data, date: convertToArgDate(res.data.date) });
      const tripData = { ...res.data };
      reset({
        name: tripData.name,
        from: tripData.from,
        to: tripData.to,
        price: tripData.price,
        maxCapacity: tripData.maxCapacity,
      });
      setDepartureTimeValue(tripData.departureTime);
      setDate(convertToDatePickerFormat(res.data.date));
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setError(true);
      setLoading(false);
      const errorMsg = err.response?.data?.msg;
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al cargar información
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al cargar información acerca del viaje. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-5 w-full max-w-[1400px]">
      <div className="self-start">
        <BackButton linkTo="/special-trips" />
      </div>
      <SectionTitle>Información acerca del viaje</SectionTitle>
      {error ? (
        <Error />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-5">
              <GorgeousBorder className="w-full max-w-[400px] mx-auto">
                <article className="w-full flex justify-center items-center relative mx-auto rounded-lg border shadow-input pb-4 max-w-[400px] bg-card dark:shadow-none">
                  <div className="w-full px-2 pt-9 sm:px-4">
                    <div className="flex flex-col gap-2">
                      <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
                        <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                        <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                        <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                      </div>
                      <div className="absolute right-2 top-2 flex items-center flex-row-reverse gap-2 sm:right-4">
                        <TripDate date={tripData.date} />
                        <TodayDate />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-col mt-2 sm:gap-2">
                          <h3 className="font-bold text-lg lg:text-xl">
                            {tripData.name}
                          </h3>
                          <h4 className="text-sm font-light text-card-foreground">
                            Información acerca del viaje
                          </h4>
                        </div>
                        <GorgeousBoxBorder>
                          <div className="flex flex-col w-full gap-2 border px-2 py-1 shadow-inner rounded-lg dark:bg-[#171717]">
                            <div className="flex flex-col overflow-auto pb-2">
                              <TripCardDataBox
                                icon={
                                  <Icons.mapPin className="h-5 w-5 text-accent shrink-0" />
                                }
                                text="Salida"
                              >
                                <div className="flex items-center gap-1">
                                  <p>{tripData.from}</p>
                                  <Separator className="w-1" />
                                  <TripTime>
                                    {tripData.departureTime} hs
                                  </TripTime>
                                </div>
                              </TripCardDataBox>
                              <TripCardDataBox
                                icon={
                                  <Icons.mapPin className="h-5 w-5 text-accent shrink-0" />
                                }
                                text="Destino"
                              >
                                <div className="flex items-center gap-1">
                                  <p>{tripData.to}</p>
                                </div>
                              </TripCardDataBox>
                              <div className="w-full flex items-center justify-between gap-1">
                                <div className="basis-1/2">
                                  <TripCardDataBox
                                    icon={
                                      <Icons.dollarSign className="h-5 w-5 text-accent shrink-0" />
                                    }
                                    text="Precio"
                                  >
                                    {tripData.price}
                                  </TripCardDataBox>
                                </div>
                                <div className="basis-1/2">
                                  <TripCardDataBox
                                    icon={
                                      <Icons.users className="h-5 w-5 text-accent shrink-0" />
                                    }
                                    text="Capacidad máxima"
                                  >
                                    {tripData.maxCapacity}
                                  </TripCardDataBox>
                                </div>
                              </div>
                            </div>
                          </div>
                        </GorgeousBoxBorder>

                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
                        >
                          <div
                            className={`mt-2 w-full flex flex-col gap-3 lg:flex-row lg:items-center ${
                              isMaxCapacity
                                ? "lg:justify-between"
                                : "lg:justify-end"
                            }`}
                          >
                            {isMaxCapacity ? (
                              <p className="font-medium self-center">
                                ¡Combi completa!
                              </p>
                            ) : (
                              ""
                            )}
                            <div className="">
                              <div className=" relative w-full after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                                <DialogTrigger className="relative w-full rounded-lg px-5 py-1.5 lg:py-0 bg-primary text-slate-100 hover:text-white shadow-input dark:text-slate-100 dark:hover:text-white dark:shadow-none lg:h-8">
                                  Editar
                                </DialogTrigger>
                              </div>
                            </div>
                          </div>
                          <DialogContent className="relative pb-10">
                            <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
                              <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                              <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                              <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                            </div>
                            <div className="absolute bottom-[0.75rem] right-2.5 sm:left-4 flex flex-col rotate-180 gap-[3px] transition-transform ">
                              <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                              <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                              <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                            </div>
                            <DialogHeader>
                              <DialogTitle className="text-center text-2xl lg:text-3xl">
                                Editar viaje
                              </DialogTitle>
                              <DialogDescription className="text-center lg:text-lg">
                                Hace cambios en el viaje.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="w-full flex flex-col items-center gap-5">
                              <form
                                key={1}
                                onSubmit={handleSubmit(handleOnSubmit)}
                                className="w-full flex flex-col items-center gap-3"
                              >
                                <div className="grid w-full max-w-2xl items-center gap-2">
                                  <Label htmlFor="name">Nombre del viaje</Label>
                                  <div className="relative flex items-center">
                                    <Icons.helpingHand className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                                    <Input
                                      type="text"
                                      id="name"
                                      className="pl-8"
                                      {...register("name", {
                                        required: {
                                          value: true,
                                          message:
                                            "Por favor, ingresar nombre del viaje.",
                                        },
                                        minLength: {
                                          value: 3,
                                          message:
                                            "Nombre del viaje no puede ser tan corto.",
                                        },
                                        maxLength: {
                                          value: 30,
                                          message:
                                            "Nombre del viaje no puede ser tan largo.",
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
                                  <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="date">Fecha</Label>
                                    <DatePickerContainer
                                      isModal={true}
                                      setDate={setDate}
                                      isForm={true}
                                      date={date}
                                    />
                                  </div>

                                  <div className="w-full flex items-center max-w-2xl gap-2">
                                    <div className="grid w-full items-center gap-2">
                                      <Label htmlFor="departureTime">
                                        Horario de salida:
                                      </Label>
                                      <TimePickerContainer
                                        value={departureTimeValue}
                                        onChange={setDepartureTimeValue}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="w-full flex flex-col max-w-2xl gap-2 sm:flex-row sm:items-center">
                                  <div className="grid w-full max-w-md items-center gap-2">
                                    <Label htmlFor="from">Desde</Label>
                                    <div className="relative flex items-center">
                                      <Icons.milestone className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                                      <Input
                                        type="text"
                                        id="from"
                                        className="pl-8"
                                        {...register("from", {
                                          required: {
                                            value: true,
                                            message:
                                              "Por favor, ingresar lugar de salida.",
                                          },
                                          minLength: {
                                            value: 3,
                                            message:
                                              "Lugar de salida no puede ser tan corto.",
                                          },
                                          maxLength: {
                                            value: 25,
                                            message:
                                              "Lugar de salida no puede ser tan largo.",
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
                                      <Icons.milestone className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                                      <Input
                                        type="text"
                                        id="to"
                                        className="pl-8"
                                        {...register("to", {
                                          required: {
                                            value: true,
                                            message:
                                              "Por favor, ingresar lugar de llegada.",
                                          },
                                          minLength: {
                                            value: 3,
                                            message:
                                              "Lugar de llegada no puede ser tan corto.",
                                          },
                                          maxLength: {
                                            value: 25,
                                            message:
                                              "Lugar de llegada no puede ser tan largo.",
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
                                      <Icons.dollarSign className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                                      <Input
                                        type="number"
                                        id="price"
                                        className="pl-8"
                                        {...register("price", {
                                          required: {
                                            value: true,
                                            message:
                                              "Por favor, ingresar precio/persona del viaje",
                                          },
                                          min: {
                                            value: 0,
                                            message:
                                              "Precio no puede ser menor a 0",
                                          },
                                          max: {
                                            value: 30000,
                                            message:
                                              "Precio no puede ser mayor a $30.000",
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
                                    <Label htmlFor="maxCapacity">
                                      Capacidad máxima
                                    </Label>
                                    <div className="relative flex items-center">
                                      <Icons.userMinus className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                                      <Input
                                        type="number"
                                        id="maxCapacity"
                                        className="pl-8"
                                        {...register("maxCapacity", {
                                          required:
                                            "Por favor, ingresar capacidad máxima del viaje.",
                                          validate: (value: string) =>
                                            validateMaxCapacity(
                                              value,
                                              passengers.length
                                            ),
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
                                <DialogFooter>
                                  <div className="w-[min(28rem,100%)] flex justify-center">
                                    <DefaultButton loading={isSubmitted}>
                                      Guardar cambios
                                    </DefaultButton>
                                  </div>
                                </DialogFooter>
                              </form>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </article>
              </GorgeousBorder>
              <Separator className="self-center w-2 mt-1" />

              <div className="flex flex-col gap-2">
                <div className="w-full flex flex-col gap-2">
                  <h3 className="text-center font-bold text-xl uppercase dark:text-white lg:text-3xl">
                    Pasajeros
                  </h3>
                  <div className="flex flex-col item-center gap-1 md:flex-row md:justify-between">
                    <div className="flex items-center justify-center gap-1 text-sm order-2 md:text-base md:order-1 md:self-end">
                      <GorgeousBoxBorder>
                        <article className="flex items-center gap-4 bg-card py-4 px-8 border shadow-input rounded-lg dark:shadow-none">
                          <div className="">
                            <Icons.users className="text-accent h-8 w-8 shrink-0 " />
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-card-foreground">Pasajeros</h4>
                            <p className="text-lg font-bold flex items-center gap-1">
                              <span
                                className={`animate-pulse w-3 h-3 rounded-full ${
                                  isMaxCapacity ? "bg-red-600" : "bg-green-500"
                                }`}
                              />
                              {passengersCount}
                            </p>
                          </div>
                        </article>
                      </GorgeousBoxBorder>
                    </div>
                    <div className="flex items-center justify-center relative md:order-2 md:self-end">
                      <div className="flex items-center relative">
                        {isMaxCapacity ? (
                          <GorgeousBoxBorder>
                            <p className="px-4 py-4 font-medium flex flex-col items-center justify-center select-none gap-2 rounded-lg bg-card border shadow-input dark:shadow-none">
                              <span>¡Combi completa!</span>
                            </p>
                          </GorgeousBoxBorder>
                        ) : (
                          <DialogAnonSpecialPassenger
                            id={id}
                            setPassengers={setPassengers}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <SpecialPassengersDatatable
                  isLoading={isLoading}
                  tripPassengers={passengers}
                  columns={specialPassengerColumns}
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default SingleSpecialTrip;
