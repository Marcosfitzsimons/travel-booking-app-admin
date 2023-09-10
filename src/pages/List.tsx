import SectionTitle from "../components/SectionTitle";
import UsersDatatable from "../components/UsersDatatable";
import TripsDatatable from "../components/TripsDatatable";
import SpecialTripsDatatable from "../components/SpecialTripsDatatable";
import { useLocation } from "react-router-dom";
import { ListProps } from "@/types/props";
import Breadcrumb from "@/components/Breadcrumb";
import { ChevronsRight } from "lucide-react";

const List = ({ icon, title, columns, linkText }: ListProps) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          Listas
          <ChevronsRight className="w-5 h-5" />
          {title}
        </p>
      </Breadcrumb>
      <SectionTitle>
        {icon}
        {title}
      </SectionTitle>
      {path === "users" ? (
        <UsersDatatable columns={columns} linkText={linkText} />
      ) : path === "trips" || path === "" ? (
        <TripsDatatable columns={columns} linkText={linkText} />
      ) : path === "special-trips" ? (
        <SpecialTripsDatatable columns={columns} linkText={linkText} />
      ) : null}
    </section>
  );
};

export default List;
