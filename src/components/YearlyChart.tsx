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
import { useTheme } from "@/context/ThemeProvider";

ChartJs.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface YearlyChartProps {
  yearlyIncomes: MonthlyIncome[];
}

const YearlyChart = ({ yearlyIncomes }: YearlyChartProps) => {
  const { theme } = useTheme();

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
          color:
            theme === "light"
              ? "hsl(215.4, 16.3%, 46.9%)"
              : "hsl(215, 20.2%, 75.1%)",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mes",
          color:
            theme === "light"
              ? "hsl(215.4, 16.3%, 46.9%)"
              : "hsl(215, 20.2%, 75.1%)",
        },
        ticks: {
          color:
            theme === "light"
              ? "hsl(215.4, 16.3%, 46.9%)"
              : "hsl(215, 20.2%, 75.1%)",
        },
        grid: {
          display: false,
        },
      },

      y: {
        title: {
          display: true,
          text: "Ganancias",
          color:
            theme === "light"
              ? "hsl(215.4, 16.3%, 46.9%)"
              : "hsl(215, 20.2%, 75.1%)",
        },
        ticks: {
          color:
            theme === "light"
              ? "hsl(215.4, 16.3%, 46.9%)"
              : "hsl(215, 20.2%, 75.1%)",
        },
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="h-full border border-slate-400/60 shadow-input rounded-lg dark:shadow-none dark:border-slate-800">
      <Bar data={data} options={options} />
    </div>
  );
};

export default YearlyChart;
