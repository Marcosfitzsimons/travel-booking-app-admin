import { useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { ResponsiveLine } from "@nivo/line";
import { convertToSpanishMonth } from "@/lib/utils/convertToSpanishMonth";

type OverviewChartProps = {
  isDashboard?: boolean;
};

const OverviewChart = ({ isDashboard = false }: OverviewChartProps) => {
  const { data, loading }: any = useFetch(
    `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/sales`
  );
  console.log("🚀 ~ file: OverviewChart.tsx:13 ~ OverviewChart ~ data:", data);

  const [totalSalesLine] = useMemo(() => {
    if (!data || !data.monthlyData) return [[], []]; // Add a check for data and monthlyData existence

    const { monthlyData }: any = data;

    const totalSalesLine = {
      id: "Total Ingresos",
      color: "hsl(347, 70%, 50%)",
      data: [] as { x: string; y: number }[],
    };

    Object.values(monthlyData).reduce(
      (acc: any, { month, totalSales }: any) => {
        const curSales = acc.sales + totalSales;
        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: convertToSpanishMonth(month), y: curSales },
        ];

        return { sales: curSales };
      },
      { sales: 0 }
    );

    return [[totalSalesLine]]; // Return the values as arrays
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || loading) return <span>loading...</span>;
  return (
    <ResponsiveLine
      data={totalSalesLine}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          if (isDashboard) return v.slice(0, 3);
          return v;
        },
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Mes",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : `Ingresos totales por Año`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};
export default OverviewChart;
