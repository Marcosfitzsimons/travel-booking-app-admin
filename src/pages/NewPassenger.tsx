import BackButton from "../components/BackButton";
import SectionTitle from "../components/SectionTitle";
import { useParams } from "react-router-dom";
import NewPassengerDatatable from "../components/NewPassengerDatatable";
import { NewPassengerProps } from "@/types/props";

const NewPassenger = ({ title, columns }: NewPassengerProps) => {
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
