import { Box } from "@mui/material";
import SectionTitle from "@/components/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import { ChevronsRight, GanttChartSquare } from "lucide-react";

const Overview = () => {
  return (
    <Box className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          <GanttChartSquare className="h-5 w-5 text-accent" />
          Ventas
          <ChevronsRight className="w-5 h-5" />
          Resumen general
        </p>
      </Breadcrumb>
      <SectionTitle>Resumen general</SectionTitle>
      <p className="text-card-foreground flex flex-col items-center justify-center gap-2">
        YEARLY RESUME GRAPH WITH TOTAL INCOMES PER MONTH{" "}
        <span> ASIDE: A LIST WITH MONTHS WITH HIGHEST INCOMES</span>
      </p>
    </Box>
  );
};

export default Overview;
