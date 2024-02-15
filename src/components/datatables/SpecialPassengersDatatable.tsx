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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import TrashButtonDatatable from "../TrashButton";
import { SpecialPassenger } from "@/types/types";

type DataTableProps = {
  columns: ColumnDef<SpecialPassenger>[];
  tripPassengers: SpecialPassenger[];
  handleDelete: any;
  isLoading: boolean;
};

const SpecialPassengersDatable = ({
  columns,
  tripPassengers,
  handleDelete,
  isLoading,
}: DataTableProps) => {
  const actionColumn: ColumnDef<SpecialPassenger>[] = [
    {
      accessorKey: "action",
      header: "Acción",
      cell: ({ row }) => {
        const passenger = row.original;
        return (
          <AlertDialog>
            <div className="relative flex items-center">
              <AlertDialogTrigger disabled={isLoading} className="z-50">
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
                  permanentemente al pasajero de este viaje.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="md:w-auto">
                  No, volver atrás
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(passenger._id)}
                  className="w-full md:w-auto"
                >
                  Si, borrar pasajero
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                  {isLoading
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

export default SpecialPassengersDatable;
