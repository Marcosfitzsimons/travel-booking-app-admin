import { Income } from "@/context/AuthContext";
import { MonthlyIncome } from "@/types/types";
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
  
  // Limit to the first 6 elements
  const limited = sorted.slice(0, 6);

  const incomesFormatted = limited.map((inc: Income) => ({
    ...inc,
    date: moment(inc.date).format("DD/MM/YYYY"),
  }));

  return incomesFormatted;
}

const convertNumberToSpanishMonth = (month: number) => {
  const months: { [key: string]: string } = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
  };

  return months[month] || "Invalid Month";
};

const totalYearlyIncome = (incomes: MonthlyIncome[]) => {
  let totalIncome = 0;
  if (incomes?.length > 0) {
    incomes?.forEach((income) => {
      totalIncome += income.totalIncomes;
    });
  }
  return totalIncome;
};

const getTopMonthlyIncomes = (incomes: MonthlyIncome[]) => {
  const sortedIncomes = incomes.slice().sort((a: MonthlyIncome, b: MonthlyIncome) => b.totalIncomes - a.totalIncomes);
  const topIncomes = sortedIncomes.slice(0, 9); 
  return topIncomes;
};

export {
    totalIncome,
    totalTripIncomes,
    totalSpecialTripIncomes,
    getTopFiveIncomes,
    getLowestFiveIncomes,
    getRecentIncomesFormatted,
    convertNumberToSpanishMonth,
    totalYearlyIncome,
    getTopMonthlyIncomes
}