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
          color: "hsl(225, 25%, 65%)",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha",
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
    <div className="h-full border border-slate-400/60 shadow-input rounded-lg dark:shadow-none dark:border-slate-800">
      <Line data={data} options={options} />
    </div>
  );
}

export default Chart;
