import { Income } from "@/context/AuthContext";

const totalIncome = (incomes: Income[]) => {
    let totalIncome = 0;
    if (incomes?.length > 0) {
      incomes?.forEach((income: Income) => {
        totalIncome += income.incomes ? income.incomes : income.specialIncomes;
      });
    }
    return totalIncome;
  };

  const totalTripIncomes = (incomes: Income[]) => {
    let totalIncome = 0;
    if (incomes?.length > 0) {
      const onlyTripsIncomes = incomes?.filter((inc) => inc.incomes > 0);
      onlyTripsIncomes?.forEach((income: Income) => {
        totalIncome += income.incomes ? income.incomes : income.specialIncomes;
      });
    }
    return totalIncome;
  };

  const totalSpecialTripIncomes = (incomes: Income[]) => {
    let totalIncome = 0;
    if (incomes?.length > 0) {
      const onlyTripsIncomes = incomes?.filter(
        (inc) => inc.specialIncomes > 0
      );
      onlyTripsIncomes?.forEach((income: Income) => {
        totalIncome += income.incomes ? income.incomes : income.specialIncomes;
      });
    }
    return totalIncome;
  };

  export {
    totalIncome,
    totalTripIncomes,
    totalSpecialTripIncomes
}