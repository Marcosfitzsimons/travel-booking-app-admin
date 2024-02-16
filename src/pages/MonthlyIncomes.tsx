import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
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
import {
  convertNumberToSpanishMonth,
  getLowestFiveIncomes,
  getTopFiveIncomes,
  totalIncome,
  totalSpecialTripIncomes,
  totalTripIncomes,
} from "@/lib/utils/incomes/calculateIncomes";
import { currentYear } from "@/lib/utils/getCurrentYear";
import { Icons } from "@/components/icons";
import { formatNumberWithDot } from "@/lib/utils/formatNumberWithDot";
import MonthlyIncomesTabs from "@/components/MonthlyIncomesTabs";
import MonthlyIncomesDatatable from "@/components/datatables/MonthlyIncomesDatatable";

const MonthlyIncomes = () => {
  const [monthlyIncomes, setMonthlyIncomes] = useState<Income[]>([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [tripsIncomes, setTripsIncomes] = useState(0);
  const [specialTripsIncomes, setSpecialTripsIncomes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [monthValue, setMonthValue] = useState(() => new Date().getMonth() + 1);
  const [noIncomes, setNoIncomes] = useState(false);

  const baseUrl = `/trips`;

  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getIncomes = async () => {
    setIsLoading(true);
    setError(false);
    setNoIncomes(false);
    try {
      const existingIncomes = monthlyIncomes.find((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getFullYear() === currentYear &&
          incomeDate.getMonth() === monthValue - 1
        );
      });

      if (!existingIncomes) {
        console.log("Fetching incomes...");
        const response = await axiosPrivate.get(
          `${baseUrl}/monthly-incomes/${currentYear}/${monthValue}`
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

      if (errorMsg === "No se han encontrado ingresos") {
        setNoIncomes(true);
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<Icons.close className="h-5 w-5 text-destructive shrink-0" />} No
              hay ingresos disponibles
            </div>
          ) as any,
          description: "No se han registrado ingresos hasta el momento",
        });
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
              Error al cargar información
            </div>
          ) as any,
          description: errorMsg
            ? errorMsg
            : "Ha ocurrido un error al cargar información. Por favor, intentar más tarde",
        });
      }
    }
  };

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
      <div className="flex flex-col gap-5">
        <Breadcrumb
          page="Ganancias"
          icon={<Icons.lineChart className="h-5 w-5" />}
        >
          Resumen mensual
        </Breadcrumb>
        <SectionTitle>Resumen ganancias mensuales</SectionTitle>
      </div>

      <div className="relative w-full flex flex-col gap-12 mb-6 max-w-[1400px] 2xl:flex-row 2xl:justify-between">
        <div className="relative w-full flex flex-col gap-2 2xl:basis-[65%]">
          <div className="self-end">
            <Select
              value={monthValue.toString()}
              onValueChange={(v) => setMonthValue(Number(v))}
            >
              <SelectTrigger className="w-[180px]">
                <Icons.calendar className="shrink-0 h-4 w-4" />
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

          {error ? (
            <p className="text-center my-6">
              No se encontraron viajes para el mes seleccionado
            </p>
          ) : (
            <>
              {noIncomes ? (
                <p className="w-full 2xl:basis-[70%]">
                  No se han registrado ingresos para el mes seleccionado
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
            </>
          )}
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[35%]">
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg lg:text-xl">
              Mayores y menores ingresos en{" "}
              {convertNumberToSpanishMonth(monthValue)}
            </h2>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Icons.handCoins className="w-4 h-4" />
              Este mes ganaste
              <span className="text-income-accent font-semibold">
                ${formatNumberWithDot(totalIncomes)}
              </span>
            </p>
          </div>
          {totalIncomes !== 0 ? (
            <MonthlyIncomesTabs
              higherIncomes={getTopFiveIncomes(monthlyIncomes)}
              lowestIncomes={getLowestFiveIncomes(monthlyIncomes)}
              loading={isLoading}
            />
          ) : (
            <MonthlyIncomesDatatable incomes={[]} loading={isLoading} />
          )}
        </div>
      </div>
    </section>
  );
};

export default MonthlyIncomes;
