import { Income } from "@/context/AuthContext";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { History, Map, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import ActionButton from "./ActionButton";

const RecentIncomes = () => {
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const baseUrl = `/trips`;

  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getRecentIncomes = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosPrivate.get(`${baseUrl}/recentIncomes`);
      const incomes = response.data;
      const incomesFormatted = incomes.map((inc: Income) => ({
        ...inc,
        date: moment(inc.date).format("DD/MM/YYYY"),
      }));
      setLoading(false);
      setRecentIncomes(incomesFormatted);
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
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            cargar información
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al cargar información. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    getRecentIncomes();
  }, []);

  return (
    <div className="relative hidden 2xl:basis-[30%] 2xl:flex 2xl:flex-col 2xl:gap-1">
      <div className="flex absolute right-0 -top-9">
        <ActionButton
          text="Viajes semanales"
          icon={<Map className="absolute left-[13px] top-[6px] h-5 w-5" />}
          linkTo={"/trips"}
        />
      </div>
      <h2 className="flex items-center gap-1 font-semibold text-lg">
        <History className="w-5 h-5 text-accent" />
        Ingresos acumulados en últimos viajes
      </h2>
      <ul className="flex flex-col gap-2">
        {error ? (
          <p>Ha ocurrido un error al cargar información</p>
        ) : (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                {recentIncomes.map((inc: Income) => (
                  <li
                    key={inc._id}
                    className="w-full flex items-center justify-between p-2 bg-card rounded-lg border shadow-input max-w-md dark:shadow-none"
                  >
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{inc.name}</h3>
                      <p className="text-sm text-card-foreground">{inc.date}</p>
                    </div>
                    <span className="text-[#268f71] dark:text-[rgba(75,270,200,1)] font-semibold">
                      ${inc.incomes}
                    </span>
                  </li>
                ))}
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default RecentIncomes;
