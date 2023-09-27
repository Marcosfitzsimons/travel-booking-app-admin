import { Income } from "@/context/AuthContext";
import moment from "moment";

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

const getTopFiveIncomes = (incomes: Income[]) => {
  const incomesWithTotal = incomes?.map((income) => ({
    ...income,
    date: moment(income.date).format("DD/MM/YYYY"),
    totalIncomes: income.incomes ? income.incomes : income.specialIncomes,
  }));

  const sortedIncomes = incomesWithTotal.sort(
    (a, b) => b.totalIncomes - a.totalIncomes
  );

  const topFiveIncomes = sortedIncomes.slice(0, 4);

  return topFiveIncomes;
};

const getLowestFiveIncomes = (incomes: Income[]) => {
  const incomesWithTotal = incomes?.map((income) => ({
    ...income,
    date: moment(income.date).format("DD/MM/YYYY"),
    totalIncomes: income.incomes ? income.incomes : income.specialIncomes,
  }));

  const sortedLowestIncomes = incomesWithTotal.sort(
    (a, b) => a.totalIncomes - b.totalIncomes
  );

  const lowestFiveIncomes = sortedLowestIncomes.slice(0, 4);

  return lowestFiveIncomes;
};

const getRecentIncomesFormatted = (incomes: Income[]) => {
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

  return incomesFormatted;
}

export {
    totalIncome,
    totalTripIncomes,
    totalSpecialTripIncomes,
    getTopFiveIncomes,
    getLowestFiveIncomes,
    getRecentIncomesFormatted
}