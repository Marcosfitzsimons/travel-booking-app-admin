import BackButton from "../components/BackButton";
import SectionTitle from "../components/SectionTitle";
import { useParams } from "react-router-dom";
import NewPassengerDatatable from "../components/datatables/NewPassengerDatatable";
import { NewPassengerProps } from "@/types/props";

const NewPassenger = <TData, TValue>({
  title,
  columns,
}: NewPassengerProps<TData, TValue>) => {
  let { id: tripId } = useParams();

  return (
    <section className="flex flex-col gap-5">
      <div className="self-start">
        <BackButton linkTo={`/trips/${tripId}`} />{" "}
      </div>
      <SectionTitle>{title}</SectionTitle>

      <NewPassengerDatatable columns={columns} tripId={tripId} />
    </section>
  );
};

export default NewPassenger;
