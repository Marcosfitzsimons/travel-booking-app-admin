import BackButton from "../components/BackButton";
import NewUserForm from "../components/NewUserForm";
import SectionTitle from "../components/SectionTitle";
import { NewUserProps } from "@/types/props";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import Breadcrumb from "@/components/Breadcrumb";
import { Icons } from "@/components/icons";

const NewUser = ({ title }: NewUserProps) => {
  return (
    <section className="flex flex-col gap-5">
      <div className="self-start">
        <BackButton linkTo="/users" />
      </div>
      <Breadcrumb page="Usuarios" icon={<Icons.users className="w-5 h-5" />}>
        Crear usuario
      </Breadcrumb>
      <SectionTitle>{title}</SectionTitle>

      <GorgeousBoxBorder className="w-full max-w-lg self-center lg:w-full lg:self-start lg:max-w-6xl">
        <div className="w-full max-w-lg self-center rounded-lg bg-card border shadow-input lg:w-full lg:self-start lg:max-w-6xl dark:shadow-none">
          <NewUserForm />
        </div>
      </GorgeousBoxBorder>
    </section>
  );
};

export default NewUser;
