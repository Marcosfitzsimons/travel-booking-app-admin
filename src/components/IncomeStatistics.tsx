import { Income } from "@/context/AuthContext";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { BadgeDollarSign, Loader2 } from "lucide-react";
import { IncomeStatisticsProps } from "@/types/props";

const IncomeStatistics = ({
  icon,
  title,
  error,
  loading,
  incomes,
}: IncomeStatisticsProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <h2 className="flex items-center gap-1 font-semibold text-lg lg:text-xl">
        {icon}
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {error ? (
          <p>Ha ocurrido un error al cargar información</p>
        ) : (
          <>
            {loading ? (
              <p className="self-center my-10">
                <Loader2 className="w-5 h-5 animate-spin" />
              </p>
            ) : (
              <>
                {incomes?.map((inc: Income) => (
                  <GorgeousBoxBorder key={inc._id}>
                    <li className="relative w-full flex items-center justify-between p-2 bg-card rounded-lg border shadow-input max-w-md dark:shadow-none">
                      <div className="flex items-center gap-2">
                        <BadgeDollarSign className="shrink-0 mx-2" />
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{inc.name}</h3>
                          <p className="text-sm text-card-foreground">
                            {inc.date}
                          </p>
                        </div>
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

export default IncomeStatistics;
