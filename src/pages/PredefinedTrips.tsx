import Breadcrumb from "@/components/Breadcrumb";
import DayCard from "@/components/DayCard";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { sortByWeeklyOrder } from "@/lib/utils/sortByWeeklyOrder";
import { DayCardType } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PredefinedTrips = () => {
  const [items, setItems] = useState<DayCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { toast } = useToast();

  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const getPredefinedTrips = async () => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.get(`/predefined-trips`);
      const items = res.data;

      sortByWeeklyOrder(items);
      setItems(items);
      console.log(items);
      setIsLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setIsLoading(false);
      setError(true);
      console.log(err);
    }
  };

  const handleDelete = async (day: string, id: string) => {
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Icons.spinner className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando viaje fijo...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`predefined-trips/${day}/${id}`);
      // filter items array, only the trips array inside of day selected.
      const updatedItems = items.map((item) => {
        if (item.dayOfWeek === day) {
          // Filter the trips array to exclude the deleted trip
          const updatedTrips = item.trips.filter((trip) => trip._id !== id);
          return { ...item, trips: updatedTrips };
        }
        return item;
      });
      setItems(updatedItems);
      toast({
        description: (
          <div className="flex gap-1">
            {<Icons.check className="h-5 w-5 text-green-600 shrink-0" />} Viaje
            fijo ha sido eliminado con éxito
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
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al eliminar viaje fijo
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar viaje. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    getPredefinedTrips();
  }, []);

  return (
    <section className="flex flex-col gap-5 mb-6">
      <Breadcrumb
        page="Viajes semanales"
        icon={<Icons.map className="w-5 h-5 " />}
      >
        Viajes fijos
      </Breadcrumb>
      <SectionTitle>Viajes fijos</SectionTitle>
      {error ? (
        <Error />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="w-full flex flex-col items-center gap-2 md:gap-4 md:grid md:items-start md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <DayCard
                  setItems={setItems}
                  items={items}
                  key={item._id}
                  day={item.dayOfWeek}
                  handleDelete={handleDelete}
                  trips={item.trips}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default PredefinedTrips;
