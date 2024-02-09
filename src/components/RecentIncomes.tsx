import { Income } from "@/context/AuthContext";
import { BadgeDollarSign, History, Map } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import ActionButton from "./ActionButton";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { RecentIncomesProps } from "@/types/props";
import { getRecentIncomesFormatted } from "@/lib/utils/incomes/calculateIncomes";

const RecentIncomes = ({ incomes, loading, error }: RecentIncomesProps) => {
  const [recentIncomes, setRecentIncomes] = useState<Income[]>([]);
  console.log(recentIncomes);
  useEffect(() => {
    setRecentIncomes(getRecentIncomesFormatted(incomes));
  }, [incomes]);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[30%] ">
      <div className="absolute -top-10 self-end">
        <ActionButton
          text="Viajes semanales"
          icon={<Map className="absolute left-[13px] top-[6px] h-5 w-5" />}
          linkTo={"/trips"}
        />
      </div>
      <h2 className="flex items-center gap-1 font-semibold text-lg lg:text-xl">
        <History className="w-5 h-5 text-accent lg:w-6 lg:h-6" />
        Ingresos acumulados en últimos viajes
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
                {recentIncomes.map((inc: Income) => (
                  <GorgeousBoxBorder key={inc._id}>
                    <li className="w-full flex items-center justify-between p-2 bg-card rounded-lg border shadow-input max-w-md dark:shadow-none">
                      <div className="flex items-center gap-2">
                        <BadgeDollarSign className="shrink-0 mx-2" />
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{inc.name}</h3>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-card-foreground">
                              {inc.date}
                            </p>
                            {inc.incomes ? (
                              <span className="bg-[rgb(82,182,152)] text-xs rounded-full px-2 font-semibold text-white select-none">
                                Viaje semanal
                              </span>
                            ) : (
                              <span className="text-xs rounded-full px-2 bg-[#06b6d4] font-semibold text-white select-none dark:bg-[#0e7490]">
                                Viaje particular
                              </span>
                            )}
                          </div>
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

export default RecentIncomes;
