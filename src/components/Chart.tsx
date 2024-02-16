import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { Income } from "@/context/AuthContext";
import { useState } from "react";
import { useTheme } from "../context/ThemeProvider";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  incomes: Income[];
}

function Chart({ incomes }: ChartProps) {
  const { theme } = useTheme();

  const allIncomes = incomes?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime(); // Sort by date in ascending order
  });

  const data = {
    labels: allIncomes?.map((inc) => {
      const { date } = inc;
      const formattedDate = moment(date).format("DD-MM-YYYY");
      return formattedDate;
    }),
    datasets: [
      {
        label: "Ganancias viajes semanales",
        data: [
          ...allIncomes.map((inc) => {
            const { date, incomes, specialIncomes } = inc;
            const formattedDate = moment(date).format("DD-MM-YYYY");
            return { x: formattedDate, incomes, specialIncomes };
          }),
        ],
        backgroundColor: "rgba(75, 270, 200, 1)",
        borderColor: "rgba(35, 200, 160, 1)",
        tension: 0.2,
        parsing: {
          yAxisKey: "incomes",
        },
      },
      {
        label: "Ganancias viajes particulares",
        data: [
          ...allIncomes.map((inc) => {
            const { date, specialIncomes, incomes } = inc;
            const formattedDate = moment(date).format("DD-MM-YYYY");
            return { x: formattedDate, specialIncomes, incomes };
          }),
        ],
        backgroundColor: "#06b6d4",
        borderColor: "#0e7490",
        tension: 0.2,
        parsing: {
          yAxisKey: "specialIncomes",
        },
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
          text: "Fecha",
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
      <Line data={data} options={options} />
    </div>
  );
}

export default Chart;
