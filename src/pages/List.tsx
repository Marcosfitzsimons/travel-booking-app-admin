import SectionTitle from "../components/SectionTitle";
import UsersDatatable from "../components/UsersDatatable";
import TripsDatatable from "../components/TripsDatatable";
import SpecialTripsDatatable from "../components/SpecialTripsDatatable";
import { useLocation } from "react-router-dom";

interface Column {
  field: string;
  headerName: string;
  flex?: number | undefined;
  width?: number | undefined;
  renderCell?: (params: any) => any;
}

type ListProps = {
  title: string;
  columns: Column[];
  linkText: string;
  icon: any;
};

const List = ({ icon, title, columns, linkText }: ListProps) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return (
    <section className="flex flex-col gap-6">
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
