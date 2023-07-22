import { Box } from "@mui/material";
import SectionTitle from "@/components/SectionTitle";
import OverviewChart from "@/components/OverviewChart";

const Overview = () => {
  return (
    <Box m="1.5rem 0">
      <SectionTitle>Resumen general</SectionTitle>
      <p className="text-card-foreground">
        Resumen de los ingresos totales año 2021
      </p>
      <Box height="75vh">
        <OverviewChart />
      </Box>
    </Box>
  );
};

export default Overview;
