import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import { passengerColumns } from "../datatablesource";
import BackButton from "../components/BackButton";
import PassengersDatatable from "../components/PassengersDatatable";
import { Check, Loader2, UserPlus, Users, X } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Loading from "../components/Loading";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/ui/use-toast";
import { Separator } from "../components/ui/separator";
import ActionButton from "@/components/ActionButton";
import TripCard from "@/components/TripCard";
import DialogAnonPassenger from "@/components/DialogAnonPassenger";
import { convertToDatePickerFormat } from "@/lib/utils/convertToDatePickerFormat";
import { Passenger, Trip } from "@/types/types";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Error from "@/components/Error";
import Incomes from "@/components/Incomes";

const INITIAL_STATES = {
  _id: "",
  name: "",
  date: null,
  from: "",
  available: true,
  departureTime: "",
  to: "",
  arrivalTime: "",
  maxCapacity: undefined,
  price: undefined,
  passengers: [],
};

const SingleTrip = () => {
  const [tripData, setTripData] = useState(INITIAL_STATES);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [departureTimeValue, setDepartureTimeValue] = useState("");
  const [arrivalTimeValue, setArrivalTimeValue] = useState("");
  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);

  const isMaxCapacity = passengers.length === tripData.maxCapacity;
  const passengersCount = `${passengers.length} / ${tripData.maxCapacity}`;

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  let { id } = useParams();
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
      to: "",
      price: undefined,
      maxCapacity: undefined,
    },
  });

  const handleOnSubmitEdit = async (data: Trip) => {
    if (
      !isDirty &&
      tripData.arrivalTime === arrivalTimeValue &&
      tripData.departureTime === departureTimeValue
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
          Editando viaje...
        </div>
      ),
    });
    try {
      const res = await axiosPrivate.put(`/trips/${id}`, {
        ...data,
        date: startDate,
        departureTime: departureTimeValue,
        arrivalTime: arrivalTimeValue,
      });
      setIsSubmitted(false);
      formatDate(res.data.date);
      setTripData({ ...res.data, date: formatDate(res.data.date) });
      setIsDialogOpen(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Viaje ha
            sido editado con éxito
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
        title: "Error al editar viaje",
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
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Cancelando lugar...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`/passengers/${passengerId}/${id}`);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Lugar
            cancelado con éxito
          </div>
        ),
      });
      setIsLoading(false);
      const updatedPassengers = passengers.filter((passenger) => {
        const isMatchingId = passenger._id === passengerId;
        const isMatchingCreatedBy = passenger.createdBy?._id === passengerId;
        return !(isMatchingId || isMatchingCreatedBy);
      });
      setPassengers(updatedPassengers);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setLoading(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            cancelar lugar
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al cancelar lugar. Por favor, intentar más tarde",
      });
    }
  };

  const formatDate = (date: string) => {
    const momentDate = moment.utc(date);
    const timezone = "America/Argentina/Buenos_Aires";
    const timezone_date = momentDate.tz(timezone);
    const formatted_date = timezone_date.format("ddd DD/MM");
    // with more info: const formatted_date = timezone_date.format("ddd  DD/MM/YYYY HH:mm:ss [GMT]Z (z)");
    return formatted_date;
  };

  const fetchData = async () => {
    setLoading(true);
    setErr(false);
    try {
      const res = await axiosPrivate.get(`/trips/${user?._id}/${id}`);
      setLoading(false);
      setPassengers(res.data.passengers);
      const formattedDate = formatDate(res.data.date);
      setTripData({ ...res.data, date: formattedDate });
      const tripData = { ...res.data };
      setDepartureTimeValue(tripData.departureTime);
      setArrivalTimeValue(tripData.arrivalTime);
      setStartDate(convertToDatePickerFormat(res.data.date));
      reset({
        name: tripData.name,
        from: tripData.from,
        to: tripData.to,
        price: tripData.price,
        maxCapacity: tripData.maxCapacity,
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setErr(true);
      setLoading(false);
      const errorMsg = err.response?.data?.msg;
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            cargar información
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
    <section className="flex flex-col gap-3 w-full max-w-[1400px]">
      <div className="self-start">
        <BackButton linkTo="/trips" />
      </div>
      {err ? (
        <Error />
      ) : (
        <>
          <SectionTitle>Información acerca del viaje</SectionTitle>
          {loading ? (
            <Loading />
          ) : (
            <>
              <TripCard
                setIsDialogOpen={setIsDialogOpen}
                isDialogOpen={isDialogOpen}
                data={tripData}
                handleOnSubmitEdit={handleOnSubmitEdit}
                register={register}
                departureTimeValue={departureTimeValue}
                arrivalTimeValue={arrivalTimeValue}
                setArrivalTimeValue={setArrivalTimeValue}
                setStartDate={setStartDate}
                errors={errors}
                handleSubmit={handleSubmit}
                isSubmitted={isSubmitted}
                startDate={startDate}
                setDepartureTimeValue={setDepartureTimeValue}
              />
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
                          <p className="px-4 py-4 font-medium flex flex-col items-center justify-center select-none gap-2 rounded-lg bg-card border shadow-input dark:shadow-none">
                            <span>¡Combi completa!</span>
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2 md:flex-row md:items-center ">
                            <DialogAnonPassenger
                              id={id}
                              setPassengers={setPassengers}
                            />

                            <Separator
                              orientation="vertical"
                              className="h-4 shrink-0 bg-border hidden lg:flex"
                            />

                            <ActionButton
                              text="Agregar pasajero"
                              linkTo={`/passengers/newPassenger/${id}`}
                              icon={
                                <UserPlus className="absolute cursor-pointer left-3 top-[5px] h-5 w-5" />
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {passengers && passengers.length > 0 ? (
                  <PassengersDatatable
                    tripPassengers={passengers}
                    columns={passengerColumns}
                    tripId={id}
                    handleDelete={handleDelete}
                    setPassengers={setPassengers}
                    loading={isLoading}
                  />
                ) : (
                  <div className="mx-auto my-3">
                    <p>El viaje no tiene pasajeros por el momento</p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default SingleTrip;
