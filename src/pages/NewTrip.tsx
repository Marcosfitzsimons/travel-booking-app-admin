import BackButton from "../components/BackButton";
import NewTripForm from "../components/NewTripForm";
import SectionTitle from "../components/SectionTitle";

interface InputValidation {
  required: {
    value: boolean;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
}
interface TripInput {
  id: any;
  label: string;
  type: string;
  name: any;
  placeholder?: string;
  validation?: InputValidation;
}

type NewTripProps = {
  inputs: TripInput[];
  title: string;
};

const NewTrip = ({ inputs, title }: NewTripProps) => {
  return (
    <section className="flex flex-col gap-5">
      <SectionTitle>{title}</SectionTitle>
      <div className="self-start mb-2">
        <BackButton linkTo="/trips" />
      </div>
      <div className="relative px-5 py-10 rounded-lg bg-card w-full max-w-md self-center border lg:max-w-3xl lg:self-start">
        <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>
        <div className="absolute bottom-[0.75rem] right-2.5 sm:left-4 flex flex-col rotate-180 gap-[3px] transition-transform ">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>
        <NewTripForm inputs={inputs} />
      </div>
    </section>
  );
};

export default NewTrip;
