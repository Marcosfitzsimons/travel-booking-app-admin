import { BadgeDollarSign, TrendingUp } from "lucide-react";
import Loading from "./Loading";
import { MonthlyIncome } from "@/types/types";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { convertNumberToSpanishMonth } from "@/lib/utils/incomes/calculateIncomes";
import { TopMonthlyIncomesProps } from "@/types/props";

const TopMonthlyIncomes = ({
  incomes,
  error,
  loading,
}: TopMonthlyIncomesProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[30%] ">
      <h2 className="flex items-center gap-1 font-semibold text-lg lg:text-xl">
        <TrendingUp className="w-5 h-5 text-[#3d8f78] lg:w-6 lg:h-6 dark:text-[rgba(75,270,200,1)]" />
        Meses con mayores ganancias
      </h2>
      <ul className="flex flex-col gap-2">
        {error ? (
          <p>Ha ocurrido un error al cargar información</p>
        ) : (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                {incomes.map((inc: MonthlyIncome) => (
                  <GorgeousBoxBorder key={inc.month}>
                    <li className="w-full flex items-center justify-between p-2 bg-card rounded-lg border shadow-input max-w-md dark:shadow-none">
                      <div className="flex items-center gap-2">
                        <BadgeDollarSign className="shrink-0 mx-2" />
                        <h3 className="font-semibold">
                          {convertNumberToSpanishMonth(inc.month)}
                        </h3>
                      </div>
                      <span className="text-[#3d8f78] dark:text-[rgba(75,270,200,1)] font-semibold">
                        ${inc.totalIncomes}
                      </span>
                    </li>
                  </GorgeousBoxBorder>
                ))}
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default TopMonthlyIncomes;
