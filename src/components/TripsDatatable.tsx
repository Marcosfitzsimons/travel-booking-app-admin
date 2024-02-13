import { useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import useFetch from "../hooks/useFetch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useToast } from "../hooks/ui/use-toast";
import DatePickerContainer from "./DatePickerContainer";
import { Button } from "./ui/button";
import ActionButton from "./ActionButton";
import ActionButtonDatatable from "./ActionButtonDatatable";
import TotalCountCard from "./TotalCountCard";
import TrashButtonDatatable from "./TrashButtonDatatable";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Trip } from "@/types/types";
import { DataTableProps } from "@/types/props";
import Error from "./Error";
import { Separator } from "./ui/separator";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { Icons } from "./icons";

const TripsDatatable = <TData, TValue>({
  columns,
  linkText,
}: DataTableProps<TData, TValue>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filteredList, setFilteredList] = useState([]);
  const [list, setList] = useState([]);

  const baseUrl = `/trips`;

  const { data, loading, error } = useFetch(baseUrl);

  const actionColumn: ColumnDef<TData, TValue>[] = [
    {
      accessorKey: "action",
      header: "Acción",
      cell: ({ row }) => {
        const trip = row.original as Trip;
        return (
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center">
              <ActionButtonDatatable
                text="Ver"
                icon={
                  <Icons.eye className="absolute left-[13px] top-[5.5px] h-4 w-4 md:h-[18px] md:w-[18px] md:top-[4.5px] md:left-[11.4px]" />
                }
                linkTo={`/trips/${trip._id}`}
              />
            </div>
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger disabled={isLoading}>
                  <TrashButtonDatatable
                    icon={
                      <Icons.trash className="absolute left-1 top-[3px] h-4 w-4 md:h-[18px] md:w-[18px] md:left-0 md:top-[2px]" />
                    }
                    text="Borrar"
                  />
                </AlertDialogTrigger>
              </div>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no podrá deshacerse. Esto eliminará
                    permanentemente este viaje.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="md:w-auto">
                    No, volver al listado de viajes
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(trip._id)}
                    className="w-full md:w-auto"
                  >
                    Si, borrar viaje
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: date ? filteredList : list,
    columns: actionColumn.concat(columns),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const { toast } = useToast();

  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Icons.spinner className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando viaje...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`${baseUrl}/${id}`);
      setList(list.filter((item: Trip) => item._id !== id));
      setIsLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Icons.check className="h-5 w-5 text-green-600 shrink-0" />} Viaje
            ha sido eliminado con éxito
          </div>
        ),
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al eliminar viaje
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar viaje. Por favor, intentar más tarde",
      });
    }
  };

  const handleFilteredTrips = () => {
    let filteredTrips;
    let dateSelected: string;
    if (date) {
      dateSelected = moment(date).locale("es").format("ddd DD/MM");
      filteredTrips = data.filter((trip: Trip) => {
        moment.locale("es", {
          weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        });
        const momentDate = moment.utc(trip.date);
        const timezone = "America/Argentina/Buenos_Aires";
        const timezone_date = momentDate.tz(timezone);
        const formatted_date = timezone_date.format("ddd DD/MM");

        return formatted_date === dateSelected;
      });
      setFilteredList([...filteredTrips]);
    } else {
      setFilteredList([]);
    }
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  useEffect(() => {
    handleFilteredTrips();
  }, [date]);

  return (
    <div className="h-[650px] w-full max-w-[1400px]">
      {error ? (
        <Error />
      ) : (
        <>
          <div className="relative w-full my-3 flex flex-col items-center gap-3">
            <div className="md:absolute md:right-0 md:top-[-100px]">
              <TotalCountCard
                icon={<Icons.map className="text-accent h-8 w-8" />}
                title="Viajes disponibles"
                value={loading ? "0" : list.length}
              />
            </div>
            <div className="w-full flex flex-col-reverse gap-3 items-center sm:flex-row sm:items-end sm:justify-between">
              <DatePickerContainer date={date} setDate={setDate} />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/20  after:transition focus-within:after:shadow-slate-300 dark:after:shadow-highlight dark:after:shadow-white/20  dark:focus-within:after:shadow-slate-300">
                  <Button className="h-[32px] p-0 relative bg-black/90 text-slate-100 hover:text-white shadow-input dark:text-slate-100 dark:hover:text-white dark:bg-black dark:shadow-none">
                    <Link
                      to="/trips/predefined-trips"
                      className="px-3.5 flex items-center gap-1"
                    >
                      <Icons.map className="w-5 h-5" />
                      Administrar viajes fijos
                    </Link>
                  </Button>
                </div>
                <Separator
                  className="hidden md:flex md:h-2"
                  orientation="vertical"
                />
                <ActionButton
                  text={linkText}
                  icon={
                    <Icons.add className="absolute cursor-pointer left-[13px] top-[7.3px] h-[18px] w-[18px] md:top-[4px] md:left-[8px] md:h-6 md:w-6" />
                  }
                  linkTo={"/trips/new"}
                />
              </div>
            </div>
          </div>
          <GorgeousBoxBorder>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="font-bold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={actionColumn.concat(columns).length}
                      className="w-full h-24 text-center"
                    >
                      {loading
                        ? "Cargando viajes semanales..."
                        : "No se han encontrado viajes semanales."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </GorgeousBoxBorder>
          <div className="flex items-center justify-end space-x-2 py-2">
            <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-400/20 after:transition dark:focus-within:after:shadow-slate-400/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-xs h-7 rounded-lg"
              >
                <Icons.chevronLeft className="w-3 aspect-square mr-1" />
                Anterior
              </Button>
            </div>
            <p className="text-xs">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </p>
            <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-400/20 after:transition dark:focus-within:after:shadow-slate-400/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-xs h-7 rounded-lg"
              >
                Siguiente
                <Icons.chevronRight className="w-3 aspect-square ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TripsDatatable;
