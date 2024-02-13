import { Clock, User as UserIcon } from "lucide-react";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import TodayDate from "./components/TodayDate";
import {
  Passenger,
  Publication,
  SpecialPassenger,
  SpecialTrip,
  Trip,
  User,
} from "./types/types";
import { ColumnDef } from "@tanstack/react-table";
import { convertToArgentineTimezone } from "./lib/utils/convertToArgentineTimezone";

const formatDate = (date: string) => {
  const momentDate = moment.utc(date, "YYYY-MM-DDTHH:mm:ss.SSSZ");
  const timezone = "America/Argentina/Buenos_Aires";
  const timezone_date = momentDate.tz(timezone);
  const formatted_date = timezone_date.format("ddd DD/MM");
  // with more info: const formatted_date = timezone_date.format("ddd  DD/MM/YYYY HH:mm:ss [GMT]Z (z)");
  return formatted_date;
};

moment.locale("es", {
  weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
});

const getTodayDate = moment().format("ddd DD/MM");

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Nombre completo",
    cell: ({ row }) => {
      const user = row.original as User;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
              src={user.image || ""}
              alt="avatar"
            />
            <AvatarFallback>
              <UserIcon className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          {user.fullName}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Celular",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "dni",
    header: "DNI",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "username",
    header: "Usuario",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    enableGlobalFilter: false,
    header: "Estado cuenta",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.getValue("status") === "Active" ? (
            <p className="text-green-600">Activa</p>
          ) : (
            <p className="text-red-600">Pendiente</p>
          )}
        </div>
      );
    },
  },
];

export const tripColumns: ColumnDef<Trip>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = formatDate(date);
      const isToday = formattedDate === getTodayDate;

      return (
        <div className="flex items-center gap-1">
          <p>{formattedDate}</p>
          {date && isToday ? <TodayDate /> : ""}
        </div>
      );
    },
  },
  { accessorKey: "name", header: "Nombre" },
  {
    accessorKey: "from",
    header: "Salida",
    cell: ({ row }) => {
      const trip = row.original;
      return (
        <div className="flex flex-col gap-[2px]">
          {trip.from}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {trip.departureTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "to",
    header: "Llegada",
    cell: ({ row }) => {
      const trip = row.original;
      return (
        <div className="flex flex-col gap-[2px]">
          {trip.to}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {trip.arrivalTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="">${price}</div>;
    },
  },
  {
    accessorKey: "passengers",
    header: "Pasajeros",
    cell: ({ row }) => {
      const passengers = row.getValue("passengers") as Passenger[];
      return passengers ? (
        <div className="">{passengers.length}</div>
      ) : (
        <span>0</span>
      );
    },
  },
  {
    accessorKey: "maxCapacity",
    header: "Cap. Máxima",
    cell: ({ row }) => {
      const maxCapacity = row.getValue("maxCapacity") as number;
      return <div className="">{maxCapacity}</div>;
    },
  },
];

export const userTripsColumns: ColumnDef<UserTrips>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = formatDate(date);
      const isToday = formattedDate === getTodayDate;

      return (
        <div className="flex items-center gap-1">
          <p>{formattedDate}</p>
          {date && isToday ? <TodayDate /> : ""}
        </div>
      );
    },
  },
  { accessorKey: "name", header: "Nombre" },
  {
    accessorKey: "from",
    header: "Salida",
    cell: ({ row }) => {
      const trip = row.original;
      return (
        <div className="flex flex-col gap-[2px]">
          {trip.from}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {trip.departureTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "to",
    header: "Llegada",
    cell: ({ row }) => {
      const trip = row.original;
      return (
        <div className="flex flex-col gap-[2px]">
          {trip.to}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {trip.arrivalTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="">${price}</div>;
    },
  },
];

export type UserTrips = {
  id: string;
  name: string;
  date: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  maxCapacity: number;
  price: number;
  available: boolean;
};

export const specialTripColumns: ColumnDef<SpecialTrip>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = formatDate(date);
      const isToday = formattedDate === getTodayDate;

      return (
        <div className="flex items-center gap-1">
          <p>{formattedDate}</p>
          {date && isToday ? <TodayDate /> : ""}
        </div>
      );
    },
  },
  { accessorKey: "name", header: "Nombre" },
  {
    accessorKey: "from",
    header: "Salida",
    cell: ({ row }) => {
      const specialTrip = row.original;
      return (
        <div className="flex flex-col gap-[2px]">
          {specialTrip.from}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {specialTrip.departureTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="">${price}</div>;
    },
  },
  {
    accessorKey: "passengers",
    header: "Pasajeros",
    cell: ({ row }) => {
      const passengers = row.getValue("passengers") as Passenger[];
      return passengers ? (
        <div className="">{passengers.length}</div>
      ) : (
        <span>0</span>
      );
    },
  },
  {
    accessorKey: "maxCapacity",
    header: "Cap. máxima",
    cell: ({ row }) => {
      const maxCapacity = row.getValue("maxCapacity") as number;
      return <div className="mx-auto">{maxCapacity}</div>;
    },
  },
];

export const passengerColumns: ColumnDef<Passenger>[] = [
  {
    accessorKey: "user",
    header: "Nombre completo",
    cell: ({ row }) => {
      const passenger = row.original;
      const isPassenger = passenger.createdBy;
      return (
        <div className="flex items-center gap-2">
          {isPassenger ? (
            <>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                  src={passenger.createdBy?.image || ""}
                  alt="avatar"
                />
                <AvatarFallback>
                  <UserIcon className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <span>{passenger.createdBy?.fullName}</span>
            </>
          ) : (
            <span>
              {passenger.fullName ? passenger.fullName : "Pasajero anónimo"}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "addressCda",
    header: "Dirección (Carmen)",
    cell: ({ row }) => {
      const passenger = row.original;
      const isPassenger = passenger.createdBy;
      return (
        <div className="">
          {isPassenger ? (
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1">
                <span>{passenger.createdBy?.addressCda.street}</span>
                <span>{passenger.createdBy?.addressCda.streetNumber}</span>
              </p>
              <span>Entre: {passenger.createdBy?.addressCda.crossStreets}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1">
                <span>
                  {passenger.addressCda ? passenger.addressCda.street : "-"}
                </span>
                <span>
                  {passenger.addressCda
                    ? passenger.addressCda.streetNumber
                    : "-"}
                </span>
              </p>
              <span>
                {passenger.addressCda
                  ? `Entre: ${passenger.addressCda.crossStreets}`
                  : "-"}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "addressCapital",
    header: "Dirección (Capital)",
    cell: ({ row }) => {
      const passenger = row.original;
      const isPassenger = passenger.createdBy;

      return (
        <p className="">
          {isPassenger ? (
            <span>{passenger.createdBy?.addressCapital}</span>
          ) : (
            <span>
              {passenger.addressCapital ? passenger.addressCapital : "-"}
            </span>
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Celular",
    cell: ({ row }) => {
      const passenger = row.original;
      const isPassenger = passenger.createdBy;
      return (
        <p className="">
          {isPassenger ? <span>{passenger.createdBy?.phone}</span> : "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "dni",
    header: "DNI",
    cell: ({ row }) => {
      const passenger = row.original;
      const isPassenger = passenger.createdBy;
      return (
        <p className="">
          {isPassenger ? <span>{passenger.createdBy?.dni}</span> : "-"}
        </p>
      );
    },
  },
];

export const specialPassengerColumns: ColumnDef<SpecialPassenger>[] = [
  {
    accessorKey: "fullName",
    header: "Nombre completo",
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string;
      return (
        <p className="flex items-center gap-2">
          {fullName ? fullName : "Pasajero anónimo"}
        </p>
      );
    },
  },
  {
    accessorKey: "dni",
    header: "DNI",
    cell: ({ row }) => {
      const dni = row.getValue("dni") as string;
      return <p className="">{dni ? dni : "-"}</p>;
    },
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => {
      const _id = row.getValue("_id") as string;
      return <p className="flex items-center gap-2">{_id}</p>;
    },
  },
];

export const publicationsColumns: ColumnDef<Publication>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "subtitle",
    header: "Subtítulo",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const { datePart, timePart } = convertToArgentineTimezone(createdAt);
      return (
        <div className="flex items-center gap-2 text-sm">
          {datePart}{" "}
          <span className="text-muted-foreground text-xs font-extralight">
            {timePart}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const publication = row.original as Publication;
      return (
        <>
          {publication.image && (
            <div className="relative h-24 w-18 ">
              <img
                src={publication.image}
                alt="Imagen de la publicación"
                className="h-24 w-18"
              />
            </div>
          )}
        </>
      );
    },
  },
];
