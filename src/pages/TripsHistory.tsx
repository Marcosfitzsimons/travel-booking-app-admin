import { Icons } from "../components/icons";
import Breadcrumb from "../components/Breadcrumb";
import SectionTitle from "../components/SectionTitle";
import { TripsHistoryProps } from "@/types/props";
import TripsHistoryDatatable from "../components/datatables/TripsHistoryDatatable";
import { useLocation } from "react-router-dom";
import SpecialTripsHistoryDatatable from "../components/datatables/SpecialTripsHistoryDatatable";

const TripsHistory = <TData, TValue>({
  columns,
  title,
}: TripsHistoryProps<TData, TValue>) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <section className="flex flex-col gap-5">
      <Breadcrumb
        page="Historial"
        icon={<Icons.history className="w-5 h-5 text-muted-foreground" />}
      >
        {title}
      </Breadcrumb>
      <SectionTitle>{title}</SectionTitle>
      {path === "/trips/history" ? (
        <TripsHistoryDatatable columns={columns} />
      ) : (
        <SpecialTripsHistoryDatatable columns={columns} />
      )}
    </section>
  );
};

export default TripsHistory;
