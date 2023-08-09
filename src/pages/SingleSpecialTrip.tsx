import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import axios from "axios";
import { specialPassengerColumns } from "../datatablesource";
import BackButton from "../components/BackButton";
import SpecialPassengersDatatable from "../components/SpecialPassengersDatatable";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Fingerprint,
  Heart,
  HelpingHand,
  MapPin,
  Milestone,
  User,
  UserMinus2,
  UserPlus,
  Users,
} from "lucide-react";
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
import Logo from "../components/Logo";
import TimePickerContainer from "../components/TimePickerContainer";
import { Separator } from "../components/ui/separator";
import { Button } from "@/components/ui/button";
import { convertToDatePickerFormat } from "@/lib/utils/convertToDatePickerFormat";

type SpecialTrip = {
  name: string;
  date: Date | null | undefined;
  from: string;
  departureTime: string;
  to: string;
  maxCapacity: string;
  price: string;
};

type SpecialPassenger = {
  fullName?: string;
  dni?: number | undefined;
};

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
  const [data, setData] = useState(INITIAL_STATES);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [departureTimeValue, setDepartureTimeValue] = useState("10:00");
  const [error, setError] = useState<unknown | boolean>(false);
  const [err, setErr] = useState<null | string>(null);

  const isMaxCapacity = data.passengers.length === data.maxCapacity;
  const passengersCount = `${data.passengers.length} / ${data.maxCapacity}`;

  const todayDate = moment().locale("es").format("ddd DD/MM");

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });
  let { id } = useParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      from: "",
      date: null,
      to: "",
      departureTime: "",
      price: "",
      maxCapacity: "",
    },
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    defaultValues: {
      fullName: "",
      dni: undefined,
    },
  });

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formatDate = (date: string) => {
    const momentDate = moment.utc(date);
    const timezone = "America/Argentina/Buenos_Aires";
    const timezone_date = momentDate.tz(timezone);
    const formatted_date = timezone_date.format("ddd DD/MM");
    // with more info: const formatted_date = timezone_date.format("ddd  DD/MM/YYYY HH:mm:ss [GMT]Z (z)");
    return formatted_date;
  };

  const handleOnSubmit = async (data: SpecialTrip) => {
    setIsSubmitted(true);
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
        }/special-trips/${id}`,
        {
          ...data,
          date: startDate,
          departureTime: departureTimeValue,
        },
        { headers }
      );
      setIsSubmitted(false);
      formatDate(res.data.date);
      setData({ ...res.data, date: formatDate(res.data.date) });
      toast({
        description: "Viaje ha sido editado con éxito.",
      });
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setErr(errorMsg);
      setIsSubmitted(false);
      toast({
        description: "Error al editar viaje. Intentar más tarde.",
      });
    }
  };

  const handleOnSubmitPassenger = async (data: SpecialPassenger) => {
    setIsSubmitted2(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
        }/special-passengers/${id}`,
        {
          ...data,
        },
        { headers }
      );
      toast({
        description: "Pasajero ha sido creado con éxito.",
      });
      fetchData();
      setIsSubmitted2(false);
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setErr(errorMsg);
      setIsSubmitted2(false);

      toast({
        description: "Error al crear pasajero. Intentar más tarde.",
      });
    }
  };

  const handleOnSubmitAnonymousPassenger = async () => {
    setIsSubmitted2(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
        }/special-passengers/${id}`,
        {},
        { headers }
      );
      toast({
        description: "Pasajero anónimo ha sido creado con éxito.",
      });
      fetchData();
      setIsSubmitted2(false);
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setErr(errorMsg);
      setIsSubmitted2(false);
      toast({
        description: "Error al crear pasajero anónimo. Intentar más tarde.",
      });
    }
  };

  const handleDelete = async (passengerId: string) => {
    setLoading(true);
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
        }/special-passengers/${passengerId}/${id}`,
        { headers }
      );
      toast({
        description: "Lugar cancelado con éxito.",
      });
      setLoading(false);
      setPassengers(passengers.filter((item) => item._id !== passengerId));
    } catch (err: any) {
      setLoading(false);
      setErr(err.message);
      toast({
        variant: "destructive",
        description: `Error al cancelar lugar, intente más tarde. ${
          err ? `"${err}"` : ""
        }`,
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
        }/special-trips/${id}`,
        {
          headers,
        }
      );
      formatDate(res.data.date);
      setPassengers(res.data.passengers);
      setData({ ...res.data, date: formatDate(res.data.date) });
      const tripData = { ...res.data };
      reset({
        name: tripData.name,
        from: tripData.from,
        date: tripData.date,
        to: tripData.to,
        departureTime: tripData.departureTime,
        price: tripData.price,
        maxCapacity: tripData.maxCapacity,
      });
      setDepartureTimeValue(tripData.departureTime);
      setStartDate(convertToDatePickerFormat(res.data.date));
    } catch (err) {
      setError(err);
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-3 w-full max-w-[1400px]">
      <div className="self-start">
        <BackButton linkTo="/special-trips" />
      </div>
      <SectionTitle>Información acerca del viaje</SectionTitle>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-3 ">
          <article
            className={`${
              isMaxCapacity ? "dark:border-zinc-800" : "dark:border"
            }  w-full flex justify-center items-center relative mx-auto rounded-md shadow-input pb-4 max-w-[400px] bg-card border dark:shadow-none`}
          >
            <div className="w-full px-2 pt-9 sm:px-4">
              <div className="flex flex-col gap-2">
                <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
                  <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-2 sm:right-4">
                  <p className="text-teal-900 order-2 font-medium flex items-center select-none gap-1 rounded-lg border border-slate-800/60 bg-slate-200/30 dark:bg-slate-800/70 dark:border-slate-200/80 dark:text-white px-3">
                    <CalendarDays className="w-4 h-4 relative lg:w-5 lg:h-5" />
                    {data.date}
                  </p>
                  {data.date === todayDate && (
                    <p className="text-green-900 bg-green-300/30 border border-green-800/80 order-1 select-none font-medium rounded-lg dark:bg-[#75f5a8]/20 dark:border-[#86dda9] dark:text-white px-3">
                      HOY
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col mt-2 sm:gap-2">
                    <h3 className="font-bold text-lg lg:text-xl">
                      {data.name}
                    </h3>
                    <h4 className="text-sm font-light text-card-foreground">
                      Información acerca del viaje:
                    </h4>
                  </div>
                  <div className="flex flex-col w-full bg-card gap-2 border py-4 px-1 shadow-inner rounded-md dark:bg-[#171717]">
                    <div className="flex flex-col gap-2 overflow-auto pb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-accent shrink-0 " />
                        <span className="font-medium shrink-0 dark:text-white">
                          Salida:
                        </span>{" "}
                        <span className="shrink-0">{data.from}</span>
                        <Separator className="w-2 bg-border-color dark:bg-border-color-dark" />
                        <Clock className="h-4 w-4 text-accent shrink-0 " />
                        <span className="shrink-0">
                          {data.departureTime} hs.
                        </span>
                      </div>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-accent shrink-0 " />
                        <span className="dark:text-white shrink-0 font-medium">
                          Destino:
                        </span>{" "}
                        <span className="shrink-0">{data.to}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-accent " />
                        <span className="dark:text-white font-medium">
                          Precio:{" "}
                        </span>
                        <span className="">${data.price}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-accent " />
                        <span className="dark:text-white font-medium">
                          Capacidad máxima:
                        </span>{" "}
                        {data.maxCapacity}
                      </p>
                    </div>
                  </div>

                  <Dialog>
                    <div className="lg:self-end">
                      <div className="mt-2 relative w-full after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                        <DialogTrigger className="relative w-full rounded-lg px-5 py-1.5 lg:py-0 bg-primary text-slate-100 hover:text-white dark:shadow-input dark:shadow-black/5 dark:text-slate-100 dark:hover:text-white lg:h-8">
                          Editar
                        </DialogTrigger>
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
                              <HelpingHand className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
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
                                setStartDate={setStartDate}
                                id="date"
                                startDate={startDate}
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
                              {err && (
                                <p className="text-red-600 text-sm self-start">
                                  {err}
                                </p>
                              )}{" "}
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
                                <Milestone className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
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
                              <Label htmlFor="maxCapacity">
                                Capacidad máxima
                              </Label>
                              <div className="relative flex items-center">
                                <UserMinus2 className="z-30 h-5 w-5 text-accent absolute left-[10px]" />
                                <Input
                                  type="number"
                                  id="maxCapacity"
                                  className="pl-8"
                                  {...register("maxCapacity", {
                                    required: {
                                      value: true,
                                      message:
                                        "Por favor, ingresar capacidad máxima del viaje.",
                                    },
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
                            <p className="text-red-600 text-sm self-start">
                              {err}
                            </p>
                          )}
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
            {isMaxCapacity && (
              <p className="absolute px-4 py-4 font-medium order-3 flex flex-col items-center justify-center select-none gap-2 rounded-lg bg-white border border-border-color dark:border-zinc-500 dark:bg-black dark:text-white">
                <Logo />
                <span>¡Combi completa!</span>
                <span className="flex items-center gap-1">
                  <Heart
                    className="w-4 h-4 relative top-[1px] dark:text-black"
                    fill="red"
                  />
                </span>
              </p>
            )}
          </article>
          <Separator className="self-center w-4 my-4" />
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2">
              <h3 className=" text-center font-bold text-xl uppercase dark:text-white lg:text-3xl">
                Pasajeros
              </h3>
              <div className="flex flex-col item-center gap-1 md:flex-row md:justify-between">
                <div className="flex items-center justify-center gap-1 text-sm order-2 md:text-base md:order-1 md:self-end">
                  <article className="flex items-center gap-4 bg-card py-4 px-8 border shadow-input rounded-lg dark:shadow-none">
                    <div className="">
                      <Users className="text-accent h-8 w-8 shrink-0 " />
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
                </div>
                <div className="flex items-center justify-center relative md:order-2 md:self-end">
                  <div className="flex items-center relative">
                    {isMaxCapacity ? (
                      <p className="text-green-900 bg-green-300/30 border order-2 border-green-800/80 select-none font-medium rounded-md dark:bg-[#75f5a8]/30 dark:border-[#4ca770] dark:text-white px-1">
                        Combi completa
                      </p>
                    ) : (
                      <Dialog>
                        <div className="flex items-center self-center ">
                          <DialogTrigger asChild>
                            <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                              <Button
                                className="h-[32px] px-3.5 pl-[35px] relative bg-teal-800/60 text-white shadow-input hover:text-white
dark:text-slate-100 dark:bg-teal-700/60 md:text-base dark:hover:text-white dark:shadow-none"
                              >
                                <UserPlus className="absolute cursor-pointer left-3 top-[6px] h-5 w-5" />
                                Agregar pasajero
                              </Button>
                            </div>
                          </DialogTrigger>
                        </div>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-center text-2xl lg:text-3xl">
                              Agregar pasajero
                            </DialogTitle>
                            <DialogDescription className="text-center lg:text-lg">
                              Información acerca del pasajero
                            </DialogDescription>
                          </DialogHeader>
                          <div className="w-full flex flex-col items-center gap-5">
                            <div className="w-full flex flex-col items-center gap-5">
                              <form
                                key={2}
                                onSubmit={handleSubmit2(
                                  handleOnSubmitPassenger
                                )}
                                className="w-full flex flex-col items-center gap-3"
                              >
                                <div className="w-full flex flex-col gap-3 max-w-sm">
                                  <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="fullName">
                                      Nombre completo
                                    </Label>
                                    <div className="relative flex items-center">
                                      <User className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[1px]" />
                                      <Input
                                        type="text"
                                        id="fullName"
                                        className="pl-[32px]"
                                        {...register2("fullName", {
                                          required: {
                                            value: true,
                                            message:
                                              "Por favor, ingresar nombre completo.",
                                          },
                                          minLength: {
                                            value: 3,
                                            message:
                                              "Nombre completo no puede ser tan corto.",
                                          },
                                          maxLength: {
                                            value: 25,
                                            message:
                                              "Nombre completo no puede ser tan largo.",
                                          },
                                        })}
                                      />
                                    </div>
                                    {errors2.fullName && (
                                      <p className="text-red-600 text-sm">
                                        {errors2.fullName.message}
                                      </p>
                                    )}
                                  </div>
                                  <div className="relative bottom-[1px] grid w-full items-center gap-2">
                                    <Label
                                      className="flex items-center gap-1"
                                      htmlFor="dni"
                                    >
                                      DNI
                                      <span className="relative text-xs text-accent md:bottom-[2px]">
                                        (opcional)
                                      </span>
                                    </Label>
                                    <div className="relative flex items-center">
                                      <Fingerprint className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[1px]" />
                                      <Input
                                        type="number"
                                        className="pl-[32px]"
                                        id="dni"
                                        {...register2("dni")}
                                      />
                                    </div>
                                    {errors2.dni && (
                                      <p className="text-red-600 text-sm">
                                        {errors2.dni.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {err && (
                                  <p className="text-red-600 self-start">
                                    {err}
                                  </p>
                                )}
                                <DialogFooter className="w-full mt-4 flex flex-col items-center gap-2 sm:flex-col sm:items-center">
                                  <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                                    <Button
                                      disabled={isSubmitted2}
                                      type="submit"
                                      className="w-auto h-8 z-20 rounded-lg bg-primary text-slate-100 hover:text-white dark:text-slate-100 dark:hover:text-white dark:bg-primary"
                                    >
                                      Crear pasajero
                                    </Button>
                                  </div>
                                  <p className="">o</p>
                                  <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                                    <Button
                                      onClick={handleOnSubmitAnonymousPassenger}
                                      disabled={isSubmitted2}
                                      type="button"
                                      className="w-auto h-8 z-20 rounded-lg bg-black/80 text-slate-100 hover:text-white dark:text-slate-100 dark:hover:text-white"
                                    >
                                      Crear pasajero anónimo
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </form>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {data.passengers && data.passengers.length > 0 ? (
              <SpecialPassengersDatatable
                tripPassengers={passengers}
                columns={specialPassengerColumns}
                tripId={id}
                handleDelete={handleDelete}
              />
            ) : (
              <div className="mx-auto flex flex-col items-center gap-3">
                <p>El viaje no tiene pasajeros por el momento.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SingleSpecialTrip;
