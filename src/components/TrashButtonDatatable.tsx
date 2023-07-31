type TrashButtonProps = {
  icon: any;
  text: string;
};

const TrashButtonDatatable = ({ text, icon }: TrashButtonProps) => {
  return (
    <span className="pl-[21px] rounded-md text-[#b4343a] font-semibold transition-colors hover:text-red-300">
      {icon}
      {text}
    </span>
  );
};

export default TrashButtonDatatable;
