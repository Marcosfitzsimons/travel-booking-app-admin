import { recentIncomesColumns } from "@/datatablesource";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table,
  TableRow,
} from "../ui/table";
import GorgeousBoxBorder from "../GorgeousBoxBorder";
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
    </div>
  );
};

export default RecentIncomesDatatable;
