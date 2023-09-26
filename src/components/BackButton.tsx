import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router-dom";

type ButtonProps = {
  linkTo: string;
};

const BackButton = ({ linkTo }: ButtonProps) => {
  return (
    <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-200/20 after:transition dark:focus-within:after:shadow-slate-300/60 dark:before:ring-slate-800/40 dark:before:border-slate-300/60">
      <Link
        to={linkTo}
        className="h-8 py-2 pr-[15px] pl-8 outline-none inline-flex items-center justify-center text-sm font-medium transition-colors rounded-lg shadow-input bg-card border hover:bg-white dark:bg-card dark:shadow-none dark:hover:text-white"
      >
        <ChevronsLeft className="w-5 h-5 absolute left-2.5 aspect-square cursor-pointer" />
        Volver
      </Link>
    </div>
  );
};

export default BackButton;
