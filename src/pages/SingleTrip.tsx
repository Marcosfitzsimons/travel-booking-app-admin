import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import { passengerColumns } from "../datatablesource";
import BackButton from "../components/BackButton";
import PassengersDatatable from "../components/PassengersDatatable";
import { UserPlus, Users } from "lucide-react";
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
  const [data, setData] = useState(INITIAL_STATES);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [departureTimeValue, setDepartureTimeValue] = useState("");
  const [arrivalTimeValue, setArrivalTimeValue] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<any>(null);

  const isMaxCapacity = passengers.length === data.maxCapacity;
  const passengersCount = `${passengers.length} / ${data.maxCapacity}`;

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const user = auth?.user;

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
      date: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      price: undefined,
      maxCapacity: undefined,
    },
  });

  const handleOnSubmitEdit = async (data: Trip) => {
    setIsSubmitted(true);
    setError(false);
    try {
      const res = await axiosPrivate.put(`/trips/${id}`, {
        ...data,
        date: startDate,
        departureTime: departureTimeValue,
        arrivalTime: arrivalTimeValue,
      });
      setIsSubmitted(false);
      formatDate(res.data.date);
      setData({ ...res.data, date: formatDate(res.data.date) });
      toast({
        description: "Viaje ha sido editado con éxito.",
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setError(true);
      setIsSubmitted(false);
      toast({
        variant: "destructive",
        title: "Error al cancelar su lugar",
        description: errorMsg
          ? errorMsg
          : "Error al editar viaje, intente más tarde.",
      });
    }
  };

  const handleDelete = async (passengerId: string) => {
    setIsLoading(true);
    try {
      await axiosPrivate.delete(`/passengers/${passengerId}/${id}`);
      toast({
        description: "Lugar cancelado con éxito.",
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
      setLoading(false);
      setError(true);
      toast({
        variant: "destructive",
        description: `Error al cancelar lugar, intente más tarde. ${
          err.response.data.msg ? err.response.data.msg : ""
        }`,
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
    try {
      const res = await axiosPrivate.get(`/trips/${user?._id}/${id}`, {});
      setPassengers(res.data.passengers);
      const formattedDate = formatDate(res.data.date);
      setData({ ...res.data, date: formattedDate });
      const tripData = { ...res.data };
      setDepartureTimeValue(tripData.departureTime);
      setArrivalTimeValue(tripData.arrivalTime);
      setStartDate(convertToDatePickerFormat(res.data.date));
      reset({
        name: tripData.name,
        from: tripData.from,
        to: tripData.to,
        departureTime: tripData.departureTime,
        arrivalTime: tripData.arrivalTime,
        price: tripData.price,
        maxCapacity: tripData.maxCapacity,
      });
    } catch (err) {
      setError(true);
      toast({
        variant: "destructive",
        description:
          "Error al cargar información acerca del viaje, intente más tarde.",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-3 w-full max-w-[1400px]">
      <div className="self-start">
        <BackButton linkTo="/trips" />
      </div>
      <SectionTitle>Información acerca del viaje</SectionTitle>
      {error && (
        <p className="text-red-600">Ha ocurrido un error. Intentar más tarde</p>
      )}
      {loading ? (
        <Loading />
      ) : (
        <>
          <TripCard
            data={data}
            err={error}
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
                          setErr={setError}
                          id={id}
                          err={error}
                          fetchData={fetchData}
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
                fetchData={fetchData}
              />
            ) : (
              <div className="mx-auto flex flex-col items-center gap-3">
                <p>El viaje no tiene pasajeros por el momento.</p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default SingleTrip;
