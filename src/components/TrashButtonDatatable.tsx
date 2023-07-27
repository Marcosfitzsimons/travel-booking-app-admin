type TrashButtonProps = {
  icon: any;
  text: string;
  isLoading: boolean;
};

const TrashButtonDatatable = ({ text, icon, isLoading }: TrashButtonProps) => {
  return (
    <button
      disabled={isLoading}
      className="pl-[21px] rounded-md text-[#b4343a] font-semibold transition-colors hover:text-red-300"
    >
      {icon}
      {text}
    </button>
  );
};

export default TrashButtonDatatable;
