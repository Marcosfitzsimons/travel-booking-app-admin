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

function Chart() {
  const { incomes } = useAuth();

  const data = {
    labels: incomes.map((inc) => {
      const { date } = inc;
      const formattedDate = moment(date).format("DD-MM-YYYY");
      return formattedDate;
    }),
    datasets: [
      {
        label: "Ganancias",
        data: [
          ...incomes.map((inc) => {
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
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ganancias",
        },
      },
    },
  };

  return (
    <div className="h-full bg-card dark:bg-black/80 border shadow-input rounded-lg dark:shadow-none">
      <Line data={data} options={options} />
    </div>
  );
}

export default Chart;
