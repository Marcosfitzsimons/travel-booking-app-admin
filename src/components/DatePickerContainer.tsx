import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/es"; // without this line it didn't work
import GorgeousBorder from "./GorgeousBorder";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { DatePickerProps } from "@/types/props";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
moment.locale("es");

const DatePickerContainer = ({
  date,
  setDate,
  isForm,
  isModal,
}: DatePickerProps) => {
  setDefaultLocale("es");
  registerLocale("es", es);

  return (
    <Popover modal={isModal}>
      <GorgeousBorder>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] h-9 justify-start text-left font-normal capitalize transition-colors cursor-pointer bg-input-bg rounded-lg border shadow-input dark:border-slate-800 dark:hover:text-white dark:placeholder:hover:text-white dark:shadow-none !outline-none",
              !date && "text-muted-foreground",
              isForm && "w-full pl-9"
            )}
          >
            <CalendarDays
              className={`mr-2 shrink-0 ${
                isForm
                  ? "z-30 h-5 w-5 text-accent absolute left-[10px]"
                  : "h-4 w-4"
              }`}
            />
            {date ? (
              <span className="capitalize">
                {format(date, "EEE dd/MM", { locale: es })}
              </span>
            ) : (
              <span>Seleccionar fecha</span>
            )}
          </Button>
        </PopoverTrigger>
      </GorgeousBorder>
      <PopoverContent className="flex flex-col items-center w-auto p-2">
        {!isModal && (
          <div className="w-full px-4">
            <Select
              onValueChange={(value) =>
                setDate(addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Hoy</SelectItem>
                <SelectItem value="1">Mañana</SelectItem>
                <SelectItem value="3">En 3 días</SelectItem>
                <SelectItem value="7">En una semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={es}
          disabled={{ before: new Date() }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerContainer;
