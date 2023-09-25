import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import { CalendarDays, CalendarRange, ChevronsRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import MonthlyChart from "@/components/MonthlyChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/Loading";
import { Income } from "@/context/AuthContext";

const MonthlyIncomes = () => {
  const [monthlyIncomes, setMonthlyIncomes] = useState<Income[]>([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [monthValue, setMonthValue] = useState(() => new Date().getMonth() + 1);
  const baseUrl = `/trips`;

  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getIncomes = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const existingIncomes = monthlyIncomes.find((income) => {
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
        setMonthlyIncomes(response.data);
      }
      setTotalIncomes(totalIncome());
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
      setTotalIncomes(0);
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
    if (monthlyIncomes.length > 0) {
      monthlyIncomes.forEach((income) => {
        totalIncome += income.incomes;
      });
    }
    return totalIncome;
  };

  useEffect(() => {
    getIncomes();
  }, [monthValue]);

  useEffect(() => {
    // Calculate total income when monthlyIncomes changes
    setTotalIncomes(totalIncome());
  }, [monthlyIncomes]);

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          <CalendarRange className="h-5 w-5 text-accent" />
          Ganancias
          <ChevronsRight className="w-5 h-5" />
          Resumen mensual
        </p>
      </Breadcrumb>
      <SectionTitle>Resumen de ganancias mensuales</SectionTitle>

      <div className="relative w-full my-12 sm:mt-6 max-w-[1400px]">
        <p className="flex gap-1 absolute left-0 -top-7 lg:text-lg">
          Ganancias totales mes seleccionado:
          <span className="font-bold dark:text-white">${totalIncomes}</span>
        </p>

        <div className="absolute right-0 -top-16 sm:-top-9">
          <Select
            value={monthValue.toString()}
            onValueChange={(v) => setMonthValue(Number(v))}
          >
            <div
              className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
            >
              <SelectTrigger className="w-[180px] flex gap-1 h-[32px] px-4 items-center justify-between bg-card rounded-lg border border-slate-800/20 shadow-input placeholder:text-neutral-500 dark:placeholder:text-pink-1-100/70 dark:bg-[hsl(0,0%,11%)] dark:border-slate-800 dark:text-white dark:shadow-none !outline-none">
                <CalendarDays className="w-5 h-5 relative bottom-[1px]" />

                <SelectValue placeholder="Mes" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectItem value="1">Enero</SelectItem>
              <SelectItem value="2">Febrero</SelectItem>
              <SelectItem value="3">Marzo</SelectItem>
              <SelectItem value="4">Abril</SelectItem>
              <SelectItem value="5">Mayo</SelectItem>
              <SelectItem value="6">Junio</SelectItem>
              <SelectItem value="7">Julio</SelectItem>
              <SelectItem value="8">Agosto</SelectItem>
              <SelectItem value="9">Septiembre</SelectItem>
              <SelectItem value="10">Octubre</SelectItem>
              <SelectItem value="11">Noviembre</SelectItem>
              <SelectItem value="12">Diciembre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {error ? (
          <p className="text-center my-6">
            No se encontraron datos para el mes seleccionado
          </p>
        ) : (
          <>
            {isLoading ? (
              <Loading />
            ) : (
              <MonthlyChart monthlyIncomes={monthlyIncomes} />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MonthlyIncomes;
