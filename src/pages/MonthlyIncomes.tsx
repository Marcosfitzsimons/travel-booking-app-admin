import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import {
  BadgeDollarSign,
  CalendarDays,
  CalendarRange,
  ChevronsRight,
  LineChart,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
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
import GorgeousBorder from "@/components/GorgeousBorder";
import { Separator } from "@radix-ui/react-separator";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import {
  totalIncome,
  totalSpecialTripIncomes,
  totalTripIncomes,
} from "@/lib/utils/incomes/calculateIncomes";
import IncomeStatistics from "@/components/IncomeStatistics";
import moment from "moment";

const MonthlyIncomes = () => {
  const [monthlyIncomes, setMonthlyIncomes] = useState<Income[]>([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [tripsIncomes, setTripsIncomes] = useState(0);
  const [specialTripsIncomes, setSpecialTripsIncomes] = useState(0);
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
          `${baseUrl}/monthly-incomes/2023/${monthValue}`
        );
        setMonthlyIncomes(response.data);
      }
      setTotalIncomes(totalIncome(monthlyIncomes));
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

  const incomesWithTotal = monthlyIncomes?.map((income) => ({
    ...income,
    date: moment(income.date).format("DD/MM/YYYY"),
    totalIncomes: income.incomes ? income.incomes : income.specialIncomes,
  }));
  console.log(incomesWithTotal);
  const sortedIncomes = incomesWithTotal.sort(
    (a, b) => b.totalIncomes - a.totalIncomes
  );

  // Get the top five incomes
  const topFiveIncomes = sortedIncomes.slice(0, 4);
  console.log(topFiveIncomes);

  const sortedLowestIncomes = incomesWithTotal.sort(
    (a, b) => a.totalIncomes - b.totalIncomes
  );

  // Get the lowest five incomes
  const lowestFiveIncomes = sortedLowestIncomes.slice(0, 4);

  console.log(lowestFiveIncomes);

  useEffect(() => {
    getIncomes();
  }, [monthValue]);

  useEffect(() => {
    setTotalIncomes(totalIncome(monthlyIncomes));
    setTripsIncomes(totalTripIncomes(monthlyIncomes));
    setSpecialTripsIncomes(totalSpecialTripIncomes(monthlyIncomes));
  }, [monthlyIncomes]);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <Breadcrumb>
          <p className="flex items-center gap-1 text-card-foreground">
            <LineChart className="h-5 w-5 text-accent" />
            Ganancias
            <ChevronsRight className="w-5 h-5" />
            Resumen mensual
          </p>
        </Breadcrumb>
        <SectionTitle>Resumen de ganancias mensuales</SectionTitle>
      </div>

      <div className="relative w-full flex flex-col gap-12 mb-6 max-w-[1400px] 2xl:flex-row 2xl:justify-between">
        <div className="relative w-full flex flex-col gap-2 2xl:basis-[70%]">
          <div className="flex flex-col items-center gap-3">
            <div className="lg:absolute lg:left-0 lg:-top-4">
              <GorgeousBoxBorder
                className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
              >
                <p className="rounded-lg bg-card p-1 border flex gap-1 shadow-input sm:px-3 dark:shadow-none">
                  <BadgeDollarSign className="hidden sm:flex shrink-0 w-5 h-5 self-center" />
                  Ganancias totales mes seleccionado
                  <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                    ${totalIncomes}
                  </span>
                </p>
                {totalIncomes === 0 ? (
                  ""
                ) : (
                  <div className="hidden xl:flex xl:absolute xl:rounded-lg xl:-right-[295px] xl:-top-1 xl:py-5 xl:w-[280px] xl:border-l">
                    <Separator className="w-4 h-[1px] bg-border absolute -left-4" />
                    <div className="absolute -top-3 left-3">
                      <Separator className="absolute -left-2 top-3 w-2 h-[1px] bg-border" />
                      <GorgeousBoxBorder>
                        <span className="flex items-center gap-1 shadow-input bg-card border px-3 rounded-lg dark:shadow-none">
                          <BadgeDollarSign className="w-4 h-4" />
                          Viajes semanales{" "}
                          <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                            ${tripsIncomes}
                          </span>
                        </span>
                      </GorgeousBoxBorder>
                    </div>
                    <div className="absolute -bottom-3 left-3">
                      <Separator className="absolute -left-2 top-[13px] w-2 h-[1px] bg-border" />
                      <GorgeousBoxBorder>
                        <span className="flex items-center gap-1 bg-card shadow-input border px-3 rounded-lg dark:shadow-none">
                          <BadgeDollarSign className="w-4 h-4" />
                          Viajes particulares{" "}
                          <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                            ${specialTripsIncomes}
                          </span>
                        </span>
                      </GorgeousBoxBorder>
                    </div>
                  </div>
                )}
              </GorgeousBoxBorder>
            </div>

            <div className="self-end">
              <Select
                value={monthValue.toString()}
                onValueChange={(v) => setMonthValue(Number(v))}
              >
                <SelectTrigger className="w-[180px] ">
                  <CalendarDays className="w-5 h-5 relative bottom-[1px]" />
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
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
                <>
                  <GorgeousBorder>
                    <MonthlyChart monthlyIncomes={monthlyIncomes} />
                  </GorgeousBorder>
                </>
              )}
            </>
          )}
        </div>
        <div className="relative bottom-8 w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[30%] ">
          <IncomeStatistics
            icon={
              <TrendingUp className="w-5 h-5 text-[#3d8f78] dark:text-[rgba(75,270,200,1)]" />
            }
            title="Viajes con mayores ingresos"
            incomes={topFiveIncomes}
            error={error}
            loading={isLoading}
          />
          <IncomeStatistics
            icon={<TrendingDown className="w-5 h-5 text-destructive" />}
            title="Viajes con menores ingresos"
            incomes={lowestFiveIncomes}
            error={error}
            loading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default MonthlyIncomes;
