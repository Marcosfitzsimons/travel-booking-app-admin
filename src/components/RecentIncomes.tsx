import { Income } from "@/context/AuthContext";
import { BadgeDollarSign, History, Map } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import ActionButton from "./ActionButton";
import GorgeousBoxBorder from "./GorgeousBoxBorder";

interface RecentIncomesProps {
  incomes: Income[];
  loading: boolean;
  error: boolean;
}

const RecentIncomes = ({ incomes, loading, error }: RecentIncomesProps) => {
  const [recentIncomes, setRecentIncomes] = useState<Income[]>([]);

  useEffect(() => {
    const incomesWithTotal = incomes?.map((income) => ({
      ...income,
      totalIncomes: income.incomes ? income.incomes : income.specialIncomes,
    }));

    const sorted = incomesWithTotal.sort((a, b) => {
      // Compare the dates as strings
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
    // Limit to the first 7 elements
    const limited = sorted.slice(0, 7);

    const incomesFormatted = limited.map((inc: Income) => ({
      ...inc,
      date: moment(inc.date).format("DD/MM/YYYY"),
    }));

    setRecentIncomes(incomesFormatted);
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
      <h2 className="flex items-center gap-1 font-semibold text-lg">
        <History className="w-5 h-5 text-accent" />
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

export default RecentIncomes;
