import { NewPublicationProps } from "@/types/props";
import BackButton from "../components/BackButton";
import NewPublicationForm from "../components/NewPublicationForm";
import SectionTitle from "../components/SectionTitle";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import Breadcrumb from "@/components/Breadcrumb";
import { Icons } from "@/components/icons";

const NewPublication = ({ inputs, title }: NewPublicationProps) => {
  return (
    <section className="flex flex-col gap-5">
      <div className="self-start">
        <BackButton linkTo="/publications" />
      </div>
      <Breadcrumb
        page="Publicaciones"
        icon={<Icons.newspaper className="w-5 h-5" />}
      >
        Crear publicación
      </Breadcrumb>
      <SectionTitle>{title}</SectionTitle>

      <GorgeousBoxBorder className="w-full self-center max-w-xl lg:max-w-3xl lg:self-start">
        <div className="relative px-2 py-10 rounded-lg bg-card w-full max-w-xl self-center border lg:max-w-3xl lg:self-start lg:px-4">
          <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px]">
            <span className="w-8 h-[4px] bg-red-700 rounded-full " />
            <span className="w-4 h-[4px] bg-red-700 rounded-full " />
            <span className="w-2 h-[4px] bg-red-700 rounded-full " />
          </div>
          <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px]">
            <span className="w-8 h-[4px] bg-red-700 rounded-full " />
            <span className="w-4 h-[4px] bg-red-700 rounded-full " />
            <span className="w-2 h-[4px] bg-red-700 rounded-full " />
          </div>
          <NewPublicationForm inputs={inputs} />
        </div>
      </GorgeousBoxBorder>
    </section>
  );
};

export default NewPublication;
