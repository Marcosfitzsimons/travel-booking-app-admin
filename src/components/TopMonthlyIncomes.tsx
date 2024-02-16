import Loading from "./Loading";
import { MonthlyIncome } from "@/types/types";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import {
  convertNumberToSpanishMonth,
  totalYearlyIncome,
} from "@/lib/utils/incomes/calculateIncomes";
import { TopMonthlyIncomesProps } from "@/types/props";
import { Icons } from "./icons";
import { formatNumberWithDot } from "@/lib/utils/formatNumberWithDot";

const TopMonthlyIncomes = ({
  incomes,
  error,
  loading,
  yearlyIncomes,
}: TopMonthlyIncomesProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[30%] ">
      <div className="flex flex-col">
        <h2 className="font-semibold text-lg lg:text-xl">
          Meses con mayores ingresos
        </h2>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Icons.handCoins className="w-4 h-4" />
          Este año ganaste
          <span className="text-income-accent font-semibold">
            ${formatNumberWithDot(totalYearlyIncome(yearlyIncomes))}
          </span>
        </p>
      </div>
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
                        <Icons.currency className="shrink-0 mx-2" />
                        <h3 className="font-semibold">
                          {convertNumberToSpanishMonth(inc.month)}
                        </h3>
                      </div>
                      <span className="text-income-accent font-semibold">
                        ${formatNumberWithDot(inc.totalIncomes)}
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
