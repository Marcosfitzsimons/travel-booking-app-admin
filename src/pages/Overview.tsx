import { Box } from "@mui/material";
import SectionTitle from "@/components/SectionTitle";
import OverviewChart from "@/components/OverviewChart";
import Breadcrumb from "@/components/Breadcrumb";
import { ChevronsRight } from "lucide-react";

const Overview = () => {
  return (
    <Box className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          Ventas
          <ChevronsRight className="w-5 h-5" />
          Resumen general
        </p>
      </Breadcrumb>
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
