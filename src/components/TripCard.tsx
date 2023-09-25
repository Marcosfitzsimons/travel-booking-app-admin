import {
  CalendarDays,
  Clock,
  DollarSign,
  HelpingHand,
  MapPin,
  Milestone,
  UserMinus2,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import DatePickerContainer from "../components/DatePickerContainer";
import TimePickerContainer from "../components/TimePickerContainer";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import moment from "moment";
import { Button } from "./ui/button";
import TripCardDataBox from "./TripCardDataBox";
import TripTime from "./TripTime";
import GorgeousBorder from "./GorgeousBorder";

type Trip = {
  _id: string;
  name: string;
  date: null | undefined | string;
  from: string;
  departureTime: string;
  to: string;
  arrivalTime: string;
  maxCapacity: number | undefined;
  price: number | undefined;
  passengers: any[];
};

type TripCardProps = {
  data: Trip;
  register: any;
  handleOnSubmitEdit: any;
  departureTimeValue: string;
  isSubmitted: boolean;
  arrivalTimeValue: string;
  errors: any;
  setDepartureTimeValue: any;
  setIsDialogOpen: any;
  isDialogOpen: boolean;
  handleSubmit: any;
  setStartDate: any;
  startDate: any;
  setArrivalTimeValue: any;
};

const TripCard = ({
  data,
  register,
  departureTimeValue,
  arrivalTimeValue,
  setDepartureTimeValue,
  setArrivalTimeValue,
  isSubmitted,
  handleOnSubmitEdit,
  setStartDate,
  startDate,
  handleSubmit,
  isDialogOpen,
  setIsDialogOpen,
  errors,
}: TripCardProps) => {
  const todayDate = moment().locale("es").format("ddd DD/MM");

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });

  const validateMaxCapacity = async (value: any) => {
    const maxCapacity = parseInt(value, 10);

    if (isNaN(maxCapacity)) {
      return "Por favor, ingresa un número válido.";
    }

    if (maxCapacity < data.passengers.length) {
      return "La capacidad máxima debe ser mayor o igual al número actual de pasajeros.";
    }

    return true;
  };

  return (
    <GorgeousBorder className="w-full max-w-[400px] mx-auto">
      <article className="w-full flex justify-center items-center relative mx-auto rounded-lg border shadow-input pb-4 max-w-[400px] bg-card dark:shadow-none">
        <div className="w-full px-2 pt-9 sm:px-4">
          <div className="flex flex-col gap-2">
            <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
              <span className="w-8 h-[4px] bg-red-700 rounded-full " />
              <span className="w-4 h-[4px] bg-red-700 rounded-full " />
              <span className="w-2 h-[4px] bg-red-700 rounded-full " />
            </div>
            <div className="absolute right-2 top-2 flex items-center gap-2 sm:right-4">
              <GorgeousBorder>
                <p className="text-teal-900 order-2 font-medium flex items-center select-none gap-1 rounded-lg border border-slate-800/60 bg-slate-200/30 dark:bg-slate-800/70 dark:border-slate-700/80 dark:text-white px-3">
                  <CalendarDays className="w-4 h-4 relative lg:w-5 lg:h-5" />
                  {data.date}
                </p>
              </GorgeousBorder>
              {data.date === todayDate && (
                <GorgeousBorder>
                  <p className="text-green-900 bg-green-300/30 border border-green-800/80 order-1 select-none font-medium rounded-lg dark:bg-[#75f5a8]/20 dark:border-[#a0eebf] dark:text-white px-3">
                    HOY
                  </p>
                </GorgeousBorder>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col mt-2 sm:gap-2">
                <h3 className="font-bold text-lg lg:text-xl">{data.name}</h3>
                <h4 className="text-sm font-light text-card-foreground">
                  Información acerca del viaje:
                </h4>
              </div>
              <GorgeousBorder>
                <div className="flex flex-col w-full gap-2 border px-2 py-1 shadow-inner rounded-lg dark:bg-[#171717]">
                  <div className="flex flex-col overflow-auto pb-2">
                    <TripCardDataBox
                      icon={<MapPin className="h-5 w-5 text-accent shrink-0" />}
                      text="Salida"
                    >
                      <div className="flex items-center gap-1">
                        <p>{data.from}</p>
                        <Separator className="w-1" />
                        <TripTime>{data.departureTime} hs</TripTime>
                      </div>
                    </TripCardDataBox>
                    <TripCardDataBox
                      icon={<MapPin className="h-5 w-5 text-accent shrink-0" />}
                      text="Destino"
                    >
                      <div className="flex items-center gap-1">
                        <p>{data.to}</p>
                        <Separator className="w-1" />
                        <TripTime>{data.arrivalTime} hs</TripTime>
                      </div>
                    </TripCardDataBox>
                    <TripCardDataBox
                      icon={
                        <DollarSign className="h-5 w-5 text-accent shrink-0" />
                      }
                      text="Precio"
                    >
                      {data.price}
                    </TripCardDataBox>
                  </div>
                </div>
              </GorgeousBorder>

              <Dialog
                open={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
              >
                <div className="lg:self-end">
                  <div className="mt-2 relative w-full after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                    <DialogTrigger className="relative w-full rounded-lg px-5 py-1.5 lg:py-0 bg-primary text-slate-100 hover:text-white dark:shadow-input dark:shadow-black/5 dark:text-slate-100 dark:hover:text-white lg:h-8">
                      Editar
                    </DialogTrigger>
                  </div>
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
                      Editar viaje
                    </DialogTitle>
                    <DialogDescription className="text-center lg:text-lg">
                      Hace cambios en el viaje
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex flex-col items-center gap-5">
                    <form
                      onSubmit={handleSubmit(handleOnSubmitEdit)}
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
                          <div className="grid w-full items-center gap-2">
                            <Label htmlFor="arrivalTime">
                              Horario de llegada:
                            </Label>
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
                                validate: validateMaxCapacity, // Using the custom validation function
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
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </article>
    </GorgeousBorder>
  );
};

export default TripCard;
