import Breadcrumb from "@/components/Breadcrumb";
import Incomes from "@/components/Incomes";
import SectionTitle from "@/components/SectionTitle";
import RecentIncomes from "@/components/RecentIncomes";
import { ChevronsRight, LayoutGrid, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [monthValue, setMonthValue] = useState(() => new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [noIncomes, setNoIncomes] = useState(false);
  const [error, setError] = useState(false);

  const { setIncomes, incomes, setAuth } = useAuth();

  const baseUrl = `/trips`;
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getIncomes = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const existingIncomes = incomes.find((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getFullYear() === currentYear &&
          incomeDate.getMonth() === monthValue - 1
        );
      });

      if (!existingIncomes) {
        const response = await axiosPrivate.get(
          `${baseUrl}/monthly-incomes/${currentYear}/${monthValue}`
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
      if (errorMsg === "No se han encontrado ingresos") {
        setNoIncomes(true);
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<X className="h-5 w-5 text-destructive shrink-0" />} No hay
              ingresos disponibles
            </div>
          ) as any,
          description: "No se han registrado ingresos hasta el momento",
        });
      } else {
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
    }
  };

  useEffect(() => {
    getIncomes();
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <Breadcrumb
          page="Inicio"
          icon={<LayoutGrid className="w-5 h-5 text-muted-foreground" />}
        >
          Panel de Control
        </Breadcrumb>
        <SectionTitle>Panel de Control</SectionTitle>
      </div>
      <div className="w-full flex flex-col gap-10 mb-5 max-w-[1400px] 2xl:flex-row 2xl:justify-between">
        {noIncomes ? (
          <p className="w-full 2xl:basis-[70%]">
            No se han registrado ingresos hasta el momento
          </p>
        ) : (
          <Incomes incomes={incomes} isLoading={isLoading} error={error} />
        )}
        <RecentIncomes incomes={incomes} loading={isLoading} error={error} />
      </div>
    </section>
  );
};

export default Dashboard;
