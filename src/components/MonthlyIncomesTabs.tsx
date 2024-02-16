import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "./icons";
import { MonthlyIncomesTabsProps } from "@/types/props";
import MonthlyIncomesDatatable from "./datatables/MonthlyIncomesDatatable";
import { useState } from "react";

const MonthlyIncomesTabs = ({
  higherIncomes,
  lowestIncomes,
  loading,
}: MonthlyIncomesTabsProps) => {
  const [selectedTab, setSelectedTab] = useState("higher");
  return (
    <Tabs
      defaultValue="higher"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="higher" className="flex items-center">
          <Icons.trendingUp className="mr-2 w-5 h-5 text-income-accent" />
          Mayores ingresos
        </TabsTrigger>
        <TabsTrigger value="lower" className="flex items-center">
          <Icons.trendingDown className="mr-2 w-5 h-5 text-destructive" />
          Menores ingresos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="higher">
        <MonthlyIncomesDatatable incomes={higherIncomes} loading={loading} />
      </TabsContent>
      <TabsContent value="lower">
        <MonthlyIncomesDatatable incomes={lowestIncomes} loading={loading} />
      </TabsContent>
    </Tabs>
  );
};

export default MonthlyIncomesTabs;
