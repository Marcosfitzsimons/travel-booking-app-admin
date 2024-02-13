import { TotalCountCardProps } from "@/types/props";
import GorgeousBoxBorder from "./GorgeousBoxBorder";

const TotalCountCard = ({ icon, title, value }: TotalCountCardProps) => {
  return (
    <GorgeousBoxBorder>
      <article className="flex items-center gap-4 bg-input-bg py-4 px-8 border border-slate-400/60 shadow-input rounded-lg dark:border-slate-800  dark:shadow-none">
        <div className="">{icon}</div>
        <div className="flex flex-col">
          <h4 className="text-card-foreground">{title}</h4>
          <p className="text-lg font-bold flex items-center gap-1">
            <span
              className={`animate-pulse w-3 h-3 rounded-full ${
                value > 0 ? "bg-green-500" : "bg-red-600"
              }`}
            />
            {value}
          </p>
        </div>
      </article>
    </GorgeousBoxBorder>
  );
};

export default TotalCountCard;
