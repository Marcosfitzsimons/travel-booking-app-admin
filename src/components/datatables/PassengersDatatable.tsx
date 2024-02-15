import { useState } from "react";
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
} from "../ui/alert-dialog";
import { useToast } from "../../hooks/ui/use-toast";
import TrashButtonDatatable from "../TrashButton";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { Passenger } from "@/types/types";
import GorgeousBorder from "../GorgeousBorder";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table,
  TableRow,
} from "../ui/table";
import GorgeousBoxBorder from "../GorgeousBoxBorder";

type DataTableProps = {
  columns: ColumnDef<Passenger>[];
  tripPassengers: any;
  tripId: string | undefined;
  handleDelete: any;
  loading: boolean;
  setPassengers: any;
};

const PassengersDatable = ({
  columns,
  tripPassengers,
  tripId,
  handleDelete,
  loading,
  setPassengers,
}: DataTableProps) => {
  const [optionSelected, setOptionSelected] = useState<"paid" | "unpaid">(
    "paid"
  );
  const [isLoading, setIsLoading] = useState(false);

  const actionColumn: ColumnDef<Passenger>[] = [
    {
      accessorKey: "action",
      header: "Acción",
      cell: ({ row }) => {
        const passenger = row.original;
        const passengerIsUser = passenger.createdBy;
        const id = passengerIsUser ? passengerIsUser._id : row.original._id;
        return (
          <div className="flex items-center">
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger disabled={loading} className="z-50">
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
                    permanentemente al usuario de este viaje.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="md:w-auto">
                    No, volver atrás
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isLoading}
                    onClick={() => handleDelete(id)}
                    className="w-full md:w-auto"
                  >
                    Si, borrar pasajero
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
    {
      accessorKey: "isPaid",
      header: "Estado del pago",
      cell: ({ row }) => {
        const passenger = row.original;
        return (
          <div className="flex flex-col items-start w-32">
            {passenger.isPaid ? (
              <span className="flex items-center gap-[3px] font-medium">
                PAGO{" "}
                <Icons.check className="w-4 h-4 relative bottom-[1px] text-green-600 lg:w-5 lg:h-5" />
              </span>
            ) : (
              <span className="flex items-center gap-[3px]">
                NO PAGO{" "}
                <Icons.close className="w-4 h-4 relative bottom-[1px] text-red-600 lg:w-5 lg:h-5" />
              </span>
            )}
            <AlertDialog>
              <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-300/50 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-600 dark:focus-within:after:shadow-slate-100">
                <AlertDialogTrigger
                  disabled={isLoading}
                  className="text-sm h-auto w-auto pl-[33px] py-1 px-3 z-20 rounded-lg bg-white dark:bg-black/80 dark:text-slate-100 dark:hover:text-white"
                >
                  <Icons.edit className="absolute cursor-pointer left-3.5 top-[5px] h-[15px] w-[15px]" />
                  Editar
                </AlertDialogTrigger>
              </div>
              <AlertDialogContent className="relative w-full pt-8 pb-12 flex flex-col items-center gap-6">
                <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px]">
                  <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                </div>
                <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px]">
                  <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                </div>
                <AlertDialogHeader className="sm:text-center">
                  <AlertDialogTitle>Cambiar estado del pago</AlertDialogTitle>
                  <AlertDialogDescription>
                    Seleccioná una opción
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid w-full max-w-sm items-center self-center gap-2">
                  <ToggleGroup.Root
                    orientation="horizontal"
                    className="flex flex-col gap-2 mx-auto"
                    type="single"
                    value={optionSelected}
                    onValueChange={handleValueChange}
                  >
                    <GorgeousBorder>
                      <ToggleGroup.Item
                        value="paid"
                        className={`${
                          optionSelected === "paid"
                            ? "before:transition-all before:absolute before:left-2 before:w-3.5 before:aspect-square before:bg-slate-500 before:rounded-full dark:before:bg-slate-300"
                            : ""
                        }
                      transition-all relative flex items-center justify-center gap-[3px] w-48 border px-3 rounded-lg data-[state=on]:border-slate-600 data-[state=on]:bg-white focus:border-slate-300 outline-none hover:border-slate-300 dark:data-[state=on]:opacity-100 dark:hover:border-slate-200 dark:bg-card/80 dark:focus:border-slate-200 dark:data-[state=on]:bg-black dark:data-[state=on]:border-slate-300
                          `}
                      >
                        PAGO{" "}
                        <Icons.check className="w-4 h-4 relative bottom-[1px] text-green-600 lg:w-5 lg:h-5" />
                      </ToggleGroup.Item>
                    </GorgeousBorder>
                    <GorgeousBorder>
                      <ToggleGroup.Item
                        value="unpaid"
                        className={`${
                          optionSelected === "unpaid"
                            ? "before:transition-all before:absolute before:left-2 before:w-3.5 before:aspect-square before:bg-slate-500 before:rounded-full dark:before:bg-slate-300"
                            : ""
                        }
                        transition-all relative flex items-center justify-center gap-[3px] w-48 border px-3 rounded-lg data-[state=on]:border-slate-600 data-[state=on]:bg-white focus:border-slate-300 outline-none hover:border-slate-300 dark:data-[state=on]:opacity-100 dark:hover:border-slate-200 dark:bg-card/80 dark:focus:border-slate-200 dark:data-[state=on]:bg-black dark:data-[state=on]:border-slate-300
                            `}
                      >
                        NO PAGO{" "}
                        <Icons.close className="w-4 h-4 relative bottom-[1px] text-red-600 lg:w-5 lg:h-5" />
                      </ToggleGroup.Item>
                    </GorgeousBorder>
                  </ToggleGroup.Root>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (
                        (passenger.isPaid && optionSelected === "paid") ||
                        (!passenger.isPaid && optionSelected === "unpaid")
                      ) {
                        return toast({
                          variant: "destructive",
                          title: (
                            <div className="flex gap-1">
                              {
                                <Icons.close className="h-5 w-5 text-destructive shrink-0" />
                              }{" "}
                              Error al actualizar estado del pago
                            </div>
                          ) as any,
                          description:
                            "El estado del pago ya tiene ese valor. Debes cambiarlo para que se actualice",
                        });
                      }
                      handleIsPaid(String(passenger._id));
                    }}
                  >
                    Guardar cambios
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
    data: tripPassengers,
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
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleIsPaid = async (passengerId: string) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Icons.spinner className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Actualizando estado del pago...
        </div>
      ),
    });
    try {
      const res = await axiosPrivate.put(
        `/passengers/paid/${passengerId}/${tripId}`,
        {
          isPaid: optionSelected === "paid",
        }
      );
      const updatedPassenger = res.data.updatedPassenger;
      setPassengers((prevPassengers: Passenger[]) =>
        prevPassengers.map((passenger) =>
          passenger._id === updatedPassenger._id
            ? { ...passenger, isPaid: updatedPassenger.isPaid }
            : passenger
        )
      );
      setIsLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Icons.check className="h-5 w-5 text-green-600 shrink-0" />} Estado
            del pago actualizado con éxito
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
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<Icons.close className="h-5 w-5 text-destructive shrink-0" />}{" "}
            Error al actualizar estado del pago
          </div>
        ) as any,
        description: err.response?.data?.msg
          ? err.response?.data?.msg
          : "Ha ocurrido un error al actualizar estado del pago. Por favor, intentar más tarde",
      });
    }
  };

  const handleValueChange = (optionSeletected: "paid" | "unpaid") => {
    if (optionSeletected) {
      setOptionSelected(optionSeletected);
    }
  };

  return (
    <div className="h-[650px] max-w-[1400px] w-full">
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
                  {loading && tripPassengers.length > 0
                    ? "Cargando pasajeros..."
                    : "El viaje no tiene pasajeros por el momento."}
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
    </div>
  );
};

export default PassengersDatable;
