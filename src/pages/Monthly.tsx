import { useMemo } from "react";
import { Box } from "@mui/material";
import SectionTitle from "@/components/SectionTitle";
import useFetch from "@/hooks/useFetch";
import { ResponsiveLine } from "@nivo/line";
import { convertToSpanishMonth } from "@/lib/utils/convertToSpanishMonth";
import Breadcrumb from "@/components/Breadcrumb";
import { CalendarRange, ChevronsRight } from "lucide-react";

const Monthly = () => {
  const { data, loading }: any = useFetch(`/sales`);
  const [formattedData] = useMemo(() => {
    if (!data || !data.monthlyData) return [[], []]; // Add a check for data and monthlyData existence

    const { monthlyData } = data;

    const totalSalesLine = {
      id: "Ingresos",
      color: "hsl(347, 70%, 50%)",
      data: [] as { x: string; y: number }[],
    };

    Object.values(monthlyData).forEach(({ month, totalSales }: any) => {
      totalSalesLine.data = [
        ...totalSalesLine.data,
        { x: convertToSpanishMonth(month), y: totalSales },
      ];
    });

    const formattedData = [totalSalesLine];
    return [formattedData];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          <CalendarRange className="h-5 w-5 text-accent" />
          Ventas
          <ChevronsRight className="w-5 h-5" />
          Resumen mensual
        </p>
      </Breadcrumb>
      <SectionTitle>Ventas mensuales</SectionTitle>
      <p className="text-card-foreground">Gráfico de ingresos mensuales.</p>
      <Box height="75vh">
        {data ? (
          <ResponsiveLine
            data={formattedData}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            colors={{ datum: "color" }}
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
            axisBottom={
              {
                orient: "bottom",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 90,
                legend: "Mes",
                legendOffset: 60,
                legendPosition: "middle",
              } as any
            }
            axisLeft={
              {
                orient: "left",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Total",
                legendOffset: -50,
                legendPosition: "middle",
              } as any
            }
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
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
            ]}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </Box>
  );
};

export default Monthly;
