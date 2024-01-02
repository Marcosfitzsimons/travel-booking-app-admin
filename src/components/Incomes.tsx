import Chart from "./Chart";
import { BadgeDollarSign, CalendarDays } from "lucide-react";
import Loading from "./Loading";
import Error from "./Error";
import { IncomesProps } from "@/types/props";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { totalIncome } from "@/lib/utils/incomes/calculateIncomes";

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

  return (
    <div className="relative w-full flex flex-col gap-2 2xl:basis-[70%]">
      <div className="flex flex-col items-center gap-1 lg:flex-row lg:justify-between">
        <div className="self-end">
          <GorgeousBoxBorder
            className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
          >
            <p className="rounded-lg bg-card p-1 border flex gap-1 shadow-input sm:px-3 dark:shadow-none">
              <BadgeDollarSign className="hidden sm:flex shrink-0 w-5 h-5 self-center" />
              Ganancias acumuladas este mes
              <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                ${totalIncome(incomes)}
              </span>
            </p>
          </GorgeousBoxBorder>
        </div>
        <div className="self-end">
          <GorgeousBoxBorder>
            <p className="rounded-lg bg-card px-6 py-1 border flex items-center gap-1 shadow-input dark:shadow-none">
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
