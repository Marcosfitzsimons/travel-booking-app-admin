import Breadcrumb from "@/components/Breadcrumb";
import Incomes from "@/components/Incomes";
import SectionTitle from "@/components/SectionTitle";
import RecentIncomes from "@/components/RecentIncomes";
import { ChevronsRight, LayoutGrid } from "lucide-react";

const Dashboard = () => {
  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          <LayoutGrid className="w-5 h-5 text-accent" />
          Inicio
          <ChevronsRight className="w-5 h-5" />
          Panel de Control
        </p>
      </Breadcrumb>
      <SectionTitle>Panel de Control</SectionTitle>
      <div className="w-full flex justify-between mt-6 max-w-[1400px]">
        <Incomes />
        <RecentIncomes />
      </div>
    </section>
  );
};

export default Dashboard;
