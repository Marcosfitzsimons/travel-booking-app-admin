import { Link } from "react-router-dom";
import { Button } from "./ui/button";

type ActionButtonProps = {
  linkTo: string;
  icon: any;
  text: string;
};

const ActionButtonDatatable = ({ linkTo, icon, text }: ActionButtonProps) => {
  return (
    <div className="flex items-center self-center">
      <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
        <Button className="h-[28px] px-[13px] pl-[32px] relative bg-teal-800/60 text-white shadow-input md:text-[15px] hover:text-white dark:text-slate-100 dark:bg-teal-700/60 dark:hover:text-white dark:shadow-none">
          <Link to={linkTo}>
            {icon}
            {text}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ActionButtonDatatable;
