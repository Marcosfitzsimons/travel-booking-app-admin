import { Button } from "./ui/button";

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  isMaxCapacity?: boolean;
  onClick?: any;
};

const DefaultButton = ({
  onClick,
  children,
  loading,
  isMaxCapacity,
}: Props) => {
  return (
    <div className="relative w-full after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
      <Button
        disabled={loading || isMaxCapacity}
        onClick={onClick}
        className="relative w-full bg-primary text-slate-100 shadow-input hover:text-white lg:h-8 dark:text-slate-100 dark:bg-primary dark:hover:text-white dark:shadow-none h-8"
      >
        {children}
      </Button>
    </div>
  );
};

export default DefaultButton;
