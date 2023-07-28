import { Check, Clock, User, X } from "lucide-react";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

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

const todayDate = moment().format("ddd DD/MM");

export const userColumns = [
  {
    field: "user",
    headerName: "Nombre completo",
    width: 230,
    renderCell: (params: any) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
              src={params.row.image || ""}
              alt="avatar"
            />
            <AvatarFallback>
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          {params.row.fullName}
        </div>
      );
    },
  },
  {
    field: "phone",
    headerName: "Celular",
    width: 180,
  },
  {
    field: "dni",
    headerName: "DNI",
    width: 180,
  },
  {
    field: "username",
    headerName: "Usuario",
    width: 160,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
  },
];

export const tripColumns = [
  {
    field: "date",
    headerName: "Fecha",
    width: 140,
    renderCell: (params: any) => {
      const formattedDate = formatDate(params.row.date);
      const isToday = formattedDate === todayDate;

      return (
        <div className="flex items-center gap-1">
          <>
            {params.row.date && isToday ? (
              <span className="text-green-900 bg-green-300/30 border order-2 border-green-800/80 select-none font-medium rounded-md dark:bg-[#75f5a8]/30 dark:border-[#4ca770] dark:text-white px-1">
                HOY
              </span>
            ) : (
              ""
            )}
            <p>{formattedDate}</p>
          </>
        </div>
      );
    },
  },
  { field: "name", headerName: "Nombre", flex: 1 },
  {
    field: "from",
    headerName: "Salida",
    flex: 1,
    renderCell: (params: any) => {
      return (
        <div className="flex flex-col gap-[2px]">
          {params.row.from}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {params.row.departureTime}
          </div>
        </div>
      );
    },
  },
  {
    field: "to",
    headerName: "Llegada",
    flex: 1,
    renderCell: (params: any) => {
      return (
        <div className="flex flex-col gap-[2px]">
          {params.row.to}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {params.row.arrivalTime}
          </div>
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Precio",
    width: 120,
    renderCell: (params: any) => {
      return <div className="">${params.row.price}</div>;
    },
  },
  {
    field: "maxCapacity",
    headerName: "Cap. máxima",
    width: 120,
    renderCell: (params: any) => {
      return <div className="">{params.row.maxCapacity}</div>;
    },
  },
];

export const specialTripColumns = [
  {
    field: "date",
    headerName: "Fecha",
    width: 140,
    renderCell: (params: any) => {
      const formattedDate = formatDate(params.row.date);
      const isToday = formattedDate === todayDate;

      return (
        <div className="flex items-center gap-1">
          <>
            {params.row.date && isToday ? (
              <span className="text-green-900 bg-green-300/30 border order-2 border-green-800/80 select-none font-medium rounded-md dark:bg-[#75f5a8]/30 dark:border-[#4ca770] dark:text-white px-1">
                HOY
              </span>
            ) : (
              ""
            )}
            <p>{formattedDate}</p>
          </>
        </div>
      );
    },
  },
  { field: "name", headerName: "Nombre", flex: 1 },
  {
    field: "from",
    headerName: "Salida",
    flex: 1,
    renderCell: (params: any) => {
      return (
        <div className="flex flex-col gap-[2px]">
          {params.row.from}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            {params.row.departureTime}
          </div>
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Precio",
    width: 120,
    renderCell: (params: any) => {
      return <div className="">${params.row.price}</div>;
    },
  },
  {
    field: "maxCapacity",
    headerName: "Cap. máxima",
    width: 120,
    renderCell: (params: any) => {
      return <div className="mx-auto">{params.row.maxCapacity}</div>;
    },
  },
];

export const passengerColumns = [
  {
    field: "isPaid",
    headerName: "Estado pago",
    width: 110,
    renderCell: (params: any) => {
      return (
        <div className="">
          {params.row.isPaid ? (
            <span className="flex items-center gap-[3px]">
              PAGO{" "}
              <Check className="w-4 h-4 relative bottom-[1px] text-green-600 lg:w-5 lg:h-5" />
            </span>
          ) : (
            <span className="flex items-center gap-[3px]">
              NO PAGO{" "}
              <X className="w-4 h-4 relative bottom-[1px] text-red-600 lg:w-5 lg:h-5" />
            </span>
          )}
        </div>
      );
    },
  },
  {
    field: "user",
    headerName: "Nombre completo",
    flex: 1,
    renderCell: (params: any) => {
      const isPassenger = params.row.createdBy;
      return (
        <div className="flex items-center gap-2">
          {isPassenger ? (
            <>
              <Avatar className="w-8 h-8">
                <AvatarImage
                  className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                  src={params.row.createdBy?.image || ""}
                  alt="avatar"
                />
                <AvatarFallback>
                  <User className="w-12 h-12 dark:text-blue-lagoon-100" />
                </AvatarFallback>
              </Avatar>
              <span>{params.row.createdBy.fullName}</span>
            </>
          ) : (
            <span>
              {params.row.fullName ? params.row.fullName : "Pasajero anónimo"}
            </span>
          )}
        </div>
      );
    },
  },
  {
    field: "addressCda",
    headerName: "Dirección (Carmen)",
    flex: 1,
    renderCell: (params: any) => {
      const isPassenger = params.row.createdBy;
      return (
        <div className="">
          {isPassenger ? (
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1">
                <span>{params.row.createdBy.addressCda.street}</span>
                <span>{params.row.createdBy.addressCda.streetNumber}</span>
              </p>
              <span>Entre: {params.row.createdBy.addressCda.crossStreets}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-1">
                <span>
                  {params.row.addressCda ? params.row.addressCda.street : "-"}
                </span>
                <span>
                  {params.row.addressCda
                    ? params.row.addressCda.streetNumber
                    : "-"}
                </span>
              </p>
              <span>
                {params.row.addressCda
                  ? `Entre: ${params.row.addressCda.crossStreets}`
                  : "-"}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    field: "addressCapital",
    headerName: "Dirección (Capital)",
    flex: 1,
    renderCell: (params: any) => {
      const isPassenger = params.row.createdBy;

      return (
        <p className="">
          {isPassenger ? (
            <span>{params.row.createdBy.addressCapital}</span>
          ) : (
            <span>
              {params.row.addressCapital ? params.row.addressCapital : "-"}
            </span>
          )}
        </p>
      );
    },
  },
  {
    field: "phone",
    headerName: "Celular",
    width: 150,
    renderCell: (params: any) => {
      const isPassenger = params.row.createdBy;
      return (
        <p className="">
          {isPassenger ? <span>{params.row.createdBy.phone}</span> : "-"}
        </p>
      );
    },
  },
];

export const specialPassengerColumns = [
  {
    field: "fullName",
    headerName: "Nombre completo",
    width: 230,
    renderCell: (params: any) => {
      return (
        <p className="flex items-center gap-2">
          {params.row.fullName ? params.row.fullName : "Pasajero anónimo"}
        </p>
      );
    },
  },
  {
    field: "dni",
    headerName: "DNI",
    width: 130,
    renderCell: (params: any) => {
      return <p className="">{params.row.dni ? params.row.dni : "-"}</p>;
    },
  },
  {
    field: "_id",
    headerName: "ID",
    width: 230,
    renderCell: (params: any) => {
      return <p className="flex items-center gap-2">{params.row._id}</p>;
    },
  },
];
