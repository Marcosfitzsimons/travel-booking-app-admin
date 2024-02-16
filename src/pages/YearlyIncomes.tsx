import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import GorgeousBorder from "@/components/GorgeousBorder";
import Loading from "@/components/Loading";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import YearlyChart from "@/components/YearlyChart";
import { getTopMonthlyIncomes } from "@/lib/utils/incomes/calculateIncomes";
import TopMonthlyIncomes from "@/components/TopMonthlyIncomes";
import { currentYear } from "@/lib/utils/getCurrentYear";
import { Icons } from "@/components/icons";

const YearlyIncomes = () => {
  const [yearlyIncomes, setYearlyIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(yearlyIncomes);

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
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al cargar información
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
        <Breadcrumb
          page="Ganancias"
          icon={<Icons.barChart3 className="h-5 w-5" />}
        >
          Resumen anual
        </Breadcrumb>
        <SectionTitle>Resumen ganancias anuales</SectionTitle>
      </div>
      <div className="relative w-full flex flex-col gap-12 mb-6 max-w-[1400px] 2xl:flex-row 2xl:justify-between">
        <div className="relative w-full flex flex-col gap-2 2xl:basis-[70%]">
          <div className="self-end">
            <GorgeousBoxBorder>
              <p className="rounded-lg py-1 px-5 flex items-center border border-slate-400/60 shadow-input dark:shadow-none dark:border-slate-800">
                <Icons.calendar className="mr-2 w-5 h-5 relative bottom-[1px]" />
                Año {currentYear}
              </p>
            </GorgeousBoxBorder>
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
            yearlyIncomes={yearlyIncomes}
            loading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default YearlyIncomes;
