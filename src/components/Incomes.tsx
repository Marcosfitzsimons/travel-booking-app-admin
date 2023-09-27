import Chart from "./Chart";
import { BadgeDollarSign, CalendarDays } from "lucide-react";
import Loading from "./Loading";
import Error from "./Error";
import { Income } from "@/context/AuthContext";
import { IncomesProps } from "@/types/props";
import GorgeousBoxBorder from "./GorgeousBoxBorder";

const Incomes = ({ incomes, error, isLoading }: IncomesProps) => {
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

  const totalIncome = () => {
    let totalIncome = 0;
    if (incomes?.length > 0) {
      incomes?.forEach((income: Income) => {
        totalIncome += income.incomes ? income.incomes : income.specialIncomes;
      });
    }
    return totalIncome;
  };

  return (
    <div className="relative w-full flex flex-col gap-2 2xl:basis-[70%]">
      <div className="flex flex-col items-center gap-3">
        <div className="lg:absolute lg:left-0 lg:-top-0">
          <GorgeousBoxBorder>
            <p className="rounded-lg bg-card p-1 border flex gap-1 shadow-input sm:px-3 dark:shadow-none">
              <BadgeDollarSign className="hidden sm:flex shrink-0 w-5 h-5 self-center" />
              Ganancias totales de este mes
              <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                ${totalIncome()}
              </span>
            </p>
          </GorgeousBoxBorder>
        </div>
        <div className="self-end">
          <GorgeousBoxBorder>
            <p className="rounded-lg bg-card px-3 py-1 border flex items-center gap-1 shadow-input dark:shadow-none">
              <CalendarDays className="w-5 h-5 relative bottom-[1px]" />
              {currentMonthName}
            </p>
          </GorgeousBoxBorder>
        </div>
      </div>
      {error ? (
        <Error />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <GorgeousBoxBorder>
              <Chart incomes={incomes} />
            </GorgeousBoxBorder>
          )}
        </>
      )}
    </div>
  );
};

export default Incomes;
