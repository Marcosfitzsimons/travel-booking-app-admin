import Breadcrumb from "@/components/Breadcrumb";
import BackButton from "../components/BackButton";
import NewSpecialTripForm from "../components/NewSpecialTripForm";
import SectionTitle from "../components/SectionTitle";
import { NewTripProps } from "../types/props";
import { ChevronsRight, Map } from "lucide-react";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";

const NewSpecialTrip = ({ inputs, title }: NewTripProps) => {
  return (
    <section className="flex flex-col gap-5">
      <div className="self-start">
        <BackButton linkTo="/special-trips" />
      </div>
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          <Map className="w-5 h-5 text-accent" />
          Viajes particulares
          <ChevronsRight className="w-5 h-5" />
          Crear viaje
        </p>
      </Breadcrumb>
      <SectionTitle>{title}</SectionTitle>
      <GorgeousBoxBorder className="w-full max-w-md self-center lg:max-w-3xl lg:self-start">
        <div className="relative px-5 py-10 rounded-lg bg-card w-full border">
          <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
            <span className="w-8 h-[4px] bg-red-700 rounded-full " />
            <span className="w-4 h-[4px] bg-red-700 rounded-full " />
            <span className="w-2 h-[4px] bg-red-700 rounded-full " />
          </div>
          <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px] transition-transform ">
            <span className="w-8 h-[4px] bg-red-700 rounded-full " />
            <span className="w-4 h-[4px] bg-red-700 rounded-full " />
            <span className="w-2 h-[4px] bg-red-700 rounded-full " />
          </div>
          <NewSpecialTripForm inputs={inputs} />
        </div>
      </GorgeousBoxBorder>
    </section>
  );
};

export default NewSpecialTrip;
