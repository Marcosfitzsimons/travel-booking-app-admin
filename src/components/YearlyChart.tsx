import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MonthlyIncome } from "@/types/types";
import { convertNumberToSpanishMonth } from "@/lib/utils/incomes/calculateIncomes";

ChartJs.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface YearlyChartProps {
  yearlyIncomes: MonthlyIncome[];
}

const YearlyChart = ({ yearlyIncomes }: YearlyChartProps) => {
  const data = {
    labels: yearlyIncomes?.map((inc) => {
      const { month } = inc;
      const formattedMonth = convertNumberToSpanishMonth(month);
      return formattedMonth;
    }),
    datasets: [
      {
        label: "Ganancias mensuales",
        data: [
          ...yearlyIncomes.map((inc) => {
            const { totalIncomes } = inc;
            return totalIncomes;
          }),
        ],
        backgroundColor: "rgba(75, 270, 200, 1)",
        borderColor: "rgba(35, 200, 160, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "hsl(225, 25%, 65%)",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mes",
          color: "hsl(225, 25%, 65%)",
        },
        ticks: {
          color: "hsl(225, 25%, 65%)",
        },
      },

      y: {
        title: {
          display: true,
          text: "Ganancias",
          color: "hsl(225, 25%, 65%)",
        },
        ticks: {
          color: "hsl(225, 25%, 65%)",
        },
      },
    },
  };
  return (
    <div className="h-full bg-card border shadow-input rounded-lg dark:shadow-none">
      <Bar data={data} options={options} />
    </div>
  );
};

export default YearlyChart;
