import { UserPlus } from "lucide-react";
import BackButton from "../components/BackButton";
import NewUserForm from "../components/NewUserForm";
import SectionTitle from "../components/SectionTitle";
import { NewUserProps } from "@/types/props";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";

const NewUser = ({ title }: NewUserProps) => {
  return (
    <section className="flex flex-col gap-5">
      <div className="self-start">
        <BackButton linkTo="/users" />
      </div>
      <SectionTitle>
        <UserPlus className="w-6 h-6 text-accent sm:h-7 sm:w-7" />
        {title}
      </SectionTitle>

      <GorgeousBoxBorder className="w-full max-w-lg self-center lg:w-full lg:self-start lg:max-w-6xl">
        <div className="w-full max-w-lg self-center rounded-lg bg-card border shadow-input lg:w-full lg:self-start lg:max-w-6xl dark:shadow-none">
          <NewUserForm />
        </div>
      </GorgeousBoxBorder>
    </section>
  );
};

export default NewUser;
