import { Clock, Clock2, X } from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import GorgeousBorder from "./GorgeousBorder";

type TimePickerProps = {
  value: string;
  onChange: any;
};

const TimePickerContainer = ({ onChange, value }: TimePickerProps) => {
  return (
    <div className="flex flex-1 items-center">
      <GorgeousBorder className="w-full">
        <Clock2 className="absolute z-30 h-[18px] w-[18px] text-accent top-[10px] left-[10px]" />
        <TimePicker
          disableClock
          className="w-full pl-8 pr-2.5 py-1.5 relative text-sm bg-input rounded-lg border border-slate-800/20 shadow-input placeholder:text-foreground dark:bg-[hsl(0,0%,11%)] dark:border-slate-800 dark:placeholder:text-zinc-300 dark:text-zinc-300 dark:placeholder:hover:text-white dark:hover:text-white dark:shadow-none !outline-none"
          onChange={onChange}
          clearIcon={<X className="w-4 h-4" />}
          required
          value={value}
        />
      </GorgeousBorder>
    </div>
  );
};

export default TimePickerContainer;
