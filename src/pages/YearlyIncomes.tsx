import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import { BadgeDollarSign, CalendarDays, ChevronsRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import GorgeousBorder from "@/components/GorgeousBorder";
import Loading from "@/components/Loading";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import { BarChart3 } from "lucide-react";
import YearlyChart from "@/components/YearlyChart";
import {
  getTopMonthlyIncomes,
  totalYearlyIncome,
} from "@/lib/utils/incomes/calculateIncomes";
import TopMonthlyIncomes from "@/components/TopMonthlyIncomes";

const YearlyIncomes = () => {
  const [yearlyIncomes, setYearlyIncomes] = useState([]);
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const baseUrl = `/trips`;

  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getIncomes = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await axiosPrivate.get(`${baseUrl}/${currentYear}`);
      setYearlyIncomes(response.data);
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

  useEffect(() => {
    getIncomes();
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <Breadcrumb>
          <p className="flex items-center gap-1 text-card-foreground">
            <BarChart3 className="h-5 w-5 text-accent" />
            Ganancias
            <ChevronsRight className="w-5 h-5" />
            Resumen anual
          </p>
        </Breadcrumb>
        <SectionTitle>Resumen ganancias anuales</SectionTitle>
      </div>
      <div className="relative w-full flex flex-col gap-12 mb-6 max-w-[1400px] 2xl:flex-row 2xl:justify-between">
        <div className="relative w-full flex flex-col gap-2 2xl:basis-[70%]">
          <div className="flex flex-col items-center gap-1 lg:flex-row lg:justify-between">
            <div className="self-end">
              <GorgeousBoxBorder
                className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
              >
                <p className="rounded-lg bg-card p-1 border flex gap-1 shadow-input sm:px-3 dark:shadow-none">
                  <BadgeDollarSign className="hidden sm:flex shrink-0 w-5 h-5 self-center" />
                  Ganancias acumuladas este año
                  <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                    ${totalYearlyIncome(yearlyIncomes)}
                  </span>
                </p>
              </GorgeousBoxBorder>
            </div>

            <div className="self-end">
              <GorgeousBoxBorder>
                <p className="rounded-lg bg-card px-6 py-1 border flex items-center gap-1 shadow-input dark:shadow-none">
                  <CalendarDays className="w-5 h-5 relative bottom-[1px]" />
                  Año {currentYear}
                </p>
              </GorgeousBoxBorder>
            </div>
          </div>
          {error ? (
            <p className="text-center my-6">
              No se encontraron datos, intentar más tarde
            </p>
          ) : (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <GorgeousBorder>
                    <YearlyChart yearlyIncomes={yearlyIncomes} />
                  </GorgeousBorder>
                </>
              )}
            </>
          )}
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[30%] ">
          <TopMonthlyIncomes
            incomes={getTopMonthlyIncomes(yearlyIncomes)}
            error={error}
            loading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default YearlyIncomes;
