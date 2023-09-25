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
import useAuth from "@/hooks/useAuth";
import moment from "moment";

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

const MonthlyChart = ({ monthlyIncomes }) => {
  const data = {
    labels: monthlyIncomes?.map((inc) => {
      const { date } = inc;
      const formattedDate = moment(date).format("DD-MM-YYYY");
      return formattedDate;
    }),
    datasets: [
      {
        label: "Ganancias",
        data: [
          ...monthlyIncomes?.map((inc) => {
            const { incomes } = inc;
            return incomes;
          }),
        ],
        backgroundColor: "rgba(75, 270, 200, 1)",
        borderColor: "rgba(35, 200, 160, 1)",
        tension: 0.2,
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
    <div className="h-full bg-card border shadow-input rounded-lg dark:shadow-none">
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyChart;
