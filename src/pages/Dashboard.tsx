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
  const [isLoading, setIsLoading] = useState(false);
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
          incomeDate.getFullYear() === 2023 &&
          incomeDate.getMonth() === monthValue - 1
        );
      });

      if (!existingIncomes) {
        const response = await axiosPrivate.get(
          `${baseUrl}/monthly-incomes/2023/${monthValue}`
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

  useEffect(() => {
    getIncomes();
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <Breadcrumb>
          <p className="flex items-center gap-1 text-card-foreground">
            <LayoutGrid className="w-5 h-5 text-accent" />
            Inicio
            <ChevronsRight className="w-5 h-5" />
            Panel de Control
          </p>
        </Breadcrumb>
        <SectionTitle>Panel de Control</SectionTitle>
      </div>
      <div className="w-full flex flex-col gap-12 mb-6 max-w-[1400px] 2xl:flex-row 2xl:justify-between">
        <Incomes incomes={incomes} isLoading={isLoading} error={error} />
        <RecentIncomes incomes={incomes} loading={isLoading} error={error} />
      </div>
    </section>
  );
};

export default Dashboard;
