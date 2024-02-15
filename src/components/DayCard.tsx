import { DayCardProps } from "@/types/props";
import TripItem from "./TripItem";
import { translateDayOfWeek } from "@/lib/utils/translateDayOfWeek";
import NewPredefinedTripDialog from "./dialogs/NewPredefinedTripDialog";
import GorgeousBorder from "./GorgeousBorder";

const DayCard = ({
  day,
  trips,
  handleDelete,
  setItems,
  items,
}: DayCardProps) => {
  const dayInSpanish = translateDayOfWeek(day);

  return (
    <GorgeousBorder className="w-full max-w-md">
      <article
        className={`relative w-full min-h-[22rem] max-w-md flex flex-col items-center ${
          trips.length > 0 ? "justify-start" : "justify-center"
        } gap-3 p-3 rounded-lg border bg-card shadow-input dark:shadow-none`}
      >
        <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>
        <h3 className="absolute top-4 font-bold text-lg lg:text-2xl">
          {dayInSpanish}
        </h3>

        {trips.length > 0 ? (
          <div className=" w-full flex flex-1 flex-col items-center justify-between gap-1 mt-10">
            <div className=" w-full flex flex-col gap-1">
              {trips.length > 0 && (
                <p className="flex items-center gap-[3px] self-end text-sm">
                  <span className="font-medium text-accent">
                    {trips.length}
                  </span>
                  viaje
                  {trips.length > 1 && "s"} fijo
                  {trips.length > 1 && "s"}
                </p>
              )}
              <ul className="w-full flex flex-col gap-2">
                {trips.map((trip) => (
                  <TripItem
                    key={trip._id}
                    id={trip._id}
                    setItems={setItems}
                    items={items}
                    day={day}
                    from={trip.from}
                    to={trip.to}
                    maxCapacity={trip.maxCapacity}
                    price={trip.price}
                    handleDelete={handleDelete}
                    departureTime={trip.departureTime}
                    arrivalTime={trip.arrivalTime}
                    name={trip.name}
                  />
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <NewPredefinedTripDialog day={day} setItems={setItems} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-card-foreground">
              No hay viajes fijos para este día
            </p>
            <NewPredefinedTripDialog day={day} setItems={setItems} />
          </div>
        )}
      </article>
    </GorgeousBorder>
  );
};

export default DayCard;
