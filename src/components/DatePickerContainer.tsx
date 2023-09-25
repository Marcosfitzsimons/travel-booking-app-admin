import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/es"; // without this line it didn't work
import GorgeousBorder from "./GorgeousBorder";
moment.locale("es");

const DatePickerContainer = ({ startDate, setStartDate }: any) => {
  setDefaultLocale("es");
  registerLocale("es", es);

  return (
    <GorgeousBorder className="relative flex w-full before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300">
      <CalendarDays className="absolute left-3 top-2 z-40 w-5 h-5 text-accent" />
      <DatePicker
        dateFormat={"EEE dd/MM"}
        locale="es"
        className="capitalize cursor-pointer w-full pl-[38px] py-1.5 font-medium bg-card rounded-lg border border-slate-400/60 shadow-input placeholder:text-foreground dark:border-slate-800 dark:text-white dark:placeholder:hover:text-white dark:shadow-none !outline-none"
        selected={startDate}
        placeholderText="Seleccionar fecha"
        minDate={new Date()}
        onChange={(date) => setStartDate(date)}
      />
    </GorgeousBorder>
  );
};

export default DatePickerContainer;
