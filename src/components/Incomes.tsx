import Chart from "./Chart";
import { BadgeDollarSign, CalendarDays } from "lucide-react";
import Loading from "./Loading";
import Error from "./Error";
import { Income } from "@/context/AuthContext";
import { IncomesProps } from "@/types/props";
import GorgeousBorder from "./GorgeousBorder";

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
          <GorgeousBorder
            className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
          >
            <p className="rounded-lg bg-card p-1 border flex gap-1 shadow-input sm:px-3 dark:shadow-none">
              <BadgeDollarSign className="hidden sm:flex shrink-0 w-5 h-5 self-center" />
              Ganancias totales de este mes
              <span className="font-bold dark:text-white">
                ${totalIncome()}
              </span>
            </p>
          </GorgeousBorder>
        </div>
        <div className="self-end">
          <GorgeousBorder>
            <p className="rounded-lg bg-card px-3 py-1 border flex items-center gap-1 shadow-input dark:shadow-none">
              <CalendarDays className="w-5 h-5 relative bottom-[1px]" />
              {currentMonthName}
            </p>
          </GorgeousBorder>
        </div>
      </div>
      {error ? (
        <Error />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <GorgeousBorder>
              <Chart incomes={incomes} />
            </GorgeousBorder>
          )}
        </>
      )}
    </div>
  );
};

export default Incomes;
