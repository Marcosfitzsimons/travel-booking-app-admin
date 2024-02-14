import { recentIncomesColumns } from "@/datatablesource";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table,
  TableRow,
} from "./ui/table";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { RecentIncomesDatatableProps } from "@/types/props";

const RecentIncomesDatatable = ({
  recentIncomes,
  loading,
}: RecentIncomesDatatableProps) => {
  const table = useReactTable({
    data: recentIncomes,
    columns: recentIncomesColumns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="w-full">
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
                  colSpan={recentIncomesColumns.length}
                  className="w-full h-24 text-center"
                >
                  {loading
                    ? "Cargando ingresos..."
                    : "No hay ingresos por el momento."}
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

export default RecentIncomesDatatable;
