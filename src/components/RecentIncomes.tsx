import { Income } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { RecentIncomesProps } from "@/types/props";
import {
  getRecentIncomesFormatted,
  totalIncome,
} from "@/lib/utils/incomes/calculateIncomes";
import { Icons } from "./icons";
import { formatNumberWithDot } from "@/lib/utils/formatNumberWithDot";
import RecentIncomesDatatable from "./datatables/RecentIncomesDatatable";

const RecentIncomes = ({ incomes, loading }: RecentIncomesProps) => {
  const [recentIncomes, setRecentIncomes] = useState<Income[]>([]);

  useEffect(() => {
    setRecentIncomes(getRecentIncomesFormatted(incomes));
  }, [incomes]);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col gap-2 2xl:basis-[35%] ">
      <div className="absolute -top-10 self-end">
        <ActionButton
          text="Viajes semanales"
          icon={<Icons.map className="mr-2 h-5 w-5" />}
          linkTo={"/trips"}
        />
      </div>
      <div className="flex flex-col">
        <h2 className="font-semibold text-lg lg:text-xl">
          Ingresos recientes por viaje
        </h2>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Icons.handCoins className="w-4 h-4" />
          Este mes ganaste{" "}
          <span className="text-[#54d8b3] dark:text-[rgba(75,270,200,1)] font-semibold">
            ${formatNumberWithDot(totalIncome(incomes))}
          </span>
        </p>
      </div>
      <RecentIncomesDatatable loading={loading} recentIncomes={recentIncomes} />
    </div>
  );
};

export default RecentIncomes;
