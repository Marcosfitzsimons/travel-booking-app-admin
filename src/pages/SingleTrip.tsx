import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import axios from "axios";
import { passengerColumns } from "../datatablesource";
import BackButton from "../components/BackButton";
import PassengersDatatable from "../components/PassengersDatatable";
import { Crop, Heart, Milestone, UserPlus, Users } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Loading from "../components/Loading";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/ui/use-toast";
import { Separator } from "../components/ui/separator";
import { AuthContext } from "../context/AuthContext";
import ActionButton from "@/components/ActionButton";
import TripCard from "@/components/TripCard";
import DialogAnonPassenger from "@/components/DialogAnonPassenger";

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
  passengers: Passenger[];
};

type addressCda = {
  street: string;
  streetNumber: number | undefined;
  crossStreets: string;
};

type UserData = {
  _id: string;
  username: string;
  fullName: string;
  addressCda: addressCda;
  addressCapital: string;
  email: string;
  phone: number | undefined;
  dni: number | undefined;
  image?: string;
  myTrips: Trip[];
};

type Passenger = {
  _id: string;
  createdBy?: UserData;
  addressCda?: addressCda;
  addressCapital?: string;
  fullName?: string;
  isPaid: boolean;
  dni?: string;
};

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
  const [error, setError] = useState<unknown | boolean>(false);
  const [err, setErr] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<any>(null);

  const isMaxCapacity = passengers.length === data.maxCapacity;
  const passengersCount = `${passengers.length} / ${data.maxCapacity}`;

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });

  const { user } = useContext(AuthContext);

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

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleOnSubmitEdit = async (data: Trip) => {
    setIsSubmitted(true);
    try {
      const res = await axios.put(
        `https://fabebus-api-example.onrender.com/api/trips/${id}`,
        {
          ...data,
          date: startDate,
          departureTime: departureTimeValue,
          arrivalTime: arrivalTimeValue,
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

  const handleDelete = async (passengerId: string) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://fabebus-api-example.onrender.com/api/passengers/${passengerId}/${id}`,
        { headers }
      );
      toast({
        description: "Lugar cancelado con éxito.",
      });
      setIsLoading(false);
      setPassengers(passengers.filter((item) => item._id !== passengerId));
    } catch (err: any) {
      console.log(err);
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

  const formatDate = (date: string) => {
    const momentDate = moment.utc(date);
    const timezone = "America/Argentina/Buenos_Aires";
    const timezone_date = momentDate.tz(timezone);
    const formatted_date = timezone_date.format("ddd DD/MM");
    // with more info: const formatted_date = timezone_date.format("ddd  DD/MM/YYYY HH:mm:ss [GMT]Z (z)");
    return formatted_date;
  };

  const datePickerFormat = (date: string) => {
    const momentDate = moment.utc(date);
    const selectedDate = momentDate.toDate();
    return selectedDate;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await axios.get(
        `https://fabebus-api-example.onrender.com/api/trips/${user?._id}/${id}`,
        {
          headers,
        }
      );
      setPassengers(res.data.passengers);
      const formattedDate = formatDate(res.data.date);
      setData({ ...res.data, date: formattedDate });
      const tripData = { ...res.data };
      setDepartureTimeValue(tripData.departureTime);
      setArrivalTimeValue(tripData.arrivalTime);
      setStartDate(datePickerFormat(res.data.date));
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
        <BackButton linkTo="/trips" />
      </div>
      <SectionTitle>Información acerca del viaje</SectionTitle>
      {loading ? (
        <Loading />
      ) : (
        <>
          <TripCard
            data={data}
            err={err}
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
                          setErr={setErr}
                          id={id}
                          err={err}
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
