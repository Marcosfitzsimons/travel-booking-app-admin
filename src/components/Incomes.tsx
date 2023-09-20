import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import Chart from "./Chart";
import { CalendarDays, X } from "lucide-react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import Error from "./Error";

const Incomes = () => {
  // CREATE A NEW PAGE WHERE WITH SELECT COMPONENT
  // IN EACH MONTH, AND RECEIVE DATA OF THAT SPECIFIC MONTH
  // AND CHECK WHY I CAN'T DISPLAYING THE DATA BASED ON THE SELECT CORRECTLY...
  const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { setIncomes, incomes } = useAuth();

  const baseUrl = `/trips`;

  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const currentDate = new Date().getMonth();
  const currentMonthName = months[currentDate];

  const getIncomes = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const existingIncomes = incomes.find((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getFullYear() === 2023 &&
          incomeDate.getMonth() === monthValue - 1
        );
      });

      if (!existingIncomes) {
        console.log("Fetching incomes...");
        const response = await axiosPrivate.get(
          `${baseUrl}/incomes/2023/${monthValue}`
        );
        setIncomes(response.data);
      }
      setIsLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setError(true);
      setIsLoading(false);
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

  const totalIncome = () => {
    let totalIncome = 0;
    if (incomes.length > 0) {
      incomes.forEach((income) => {
        totalIncome += income.incomes;
      });
    }
    return totalIncome;
  };

  useEffect(() => {
    getIncomes();
  }, [monthValue]);

  return (
    <div className="relative w-full basis-[65%]">
      <p className="flex gap-1 absolute left-0 -top-6">
        Ganancias totales de este mes:
        <span className="font-bold">${totalIncome()}</span>
      </p>
      <div className="absolute right-0 -top-9">
        <div
          className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
        >
          <p className="flex gap-1 h-[32px] px-4 items-center justify-between bg-card rounded-lg border border-slate-800/20 shadow-input placeholder:text-neutral-500 dark:placeholder:text-pink-1-100/70 dark:bg-[hsl(0,0%,11%)] dark:border-slate-800 dark:text-white dark:shadow-none !outline-none">
            <CalendarDays className="w-5 h-5 relative bottom-[1px]" />
            {currentMonthName}
          </p>
        </div>
      </div>
      {error ? <Error /> : <>{isLoading ? <Loading /> : <Chart />}</>}
    </div>
  );
};

export default Incomes;
