import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Trash2,
  UserPlusIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
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
import SearchUserInput from "../SearchUserInput";
import { toast } from "../../hooks/ui/use-toast";
import ActionButton from "../ActionButton";
import ActionButtonDatatable from "../ActionButtonDatatable";
import TrashButtonDatatable from "../TrashButton";
import TotalCountCard from "../TotalCountCard";
import { User } from "@/types/types";
import { DataTableProps } from "@/types/props";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import Error from "../Error";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
} from "../ui/table";
import { Button } from "../ui/button";
import GorgeousBoxBorder from "../GorgeousBoxBorder";

export default function UsersDatatable<TData, TValue>({
  columns,
  linkText,
}: DataTableProps<TData, TValue>) {
  const [filtering, setFiltering] = useState("");
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = `/users`;

  const { data, loading, error } = useFetch(baseUrl);

  const actionColumn: ColumnDef<TData, TValue>[] = [
    {
      id: "actions",
      header: "Acción",
      cell: ({ row }) => {
        const user = row.original as User;
        return (
          <div className="flex items-center gap-2">
            <ActionButtonDatatable
              linkTo={`/users/${user._id}`}
              text="Ver"
              icon={
                <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4" />
              }
            />
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger disabled={isLoading}>
                  <TrashButtonDatatable
                    icon={
                      <Trash2 className="absolute left-1 top-[3px] h-4 w-4 md:h-[18px] md:w-[18px] md:left-0 md:top-[2px]" />
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
                    permanentemente este usuario.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="md:w-auto">
                    No, volver al listado de usuarios
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(user._id)}
                    className="w-full md:w-auto"
                  >
                    Si, borrar usuario
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
    data: list,
    columns: actionColumn.concat(columns),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
    onGlobalFilterChange: setFiltering,
  });

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando usuario...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`${baseUrl}/${id}`);
      setList(list.filter((item: User) => item._id !== id));
      setIsLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Usuario
            eliminado con éxito
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
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            eliminar usuario
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar usuario. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className="h-[650px] w-full max-w-[1400px]">
      {error ? (
        <Error />
      ) : (
        <>
          <div className="w-full my-3 flex flex-col items-center gap-3 md:flex-row md:items-end md:justify-between">
            <SearchUserInput filter={filtering} setFilter={setFiltering} />
            <div className="relative w-full flex items-end justify-between sm:w-auto sm:gap-3">
              <div className="md:absolute md:right-0 md:top-[-100px]">
                <TotalCountCard
                  icon={<Users className="text-accent h-8 w-8" />}
                  title="Usuarios"
                  value={loading ? "0" : list.length}
                />
              </div>
              <ActionButton
                text={linkText}
                icon={<UserPlusIcon className="mr-2 h-5 w-5" />}
                linkTo={"/users/new"}
              />
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
                        ? "Cargando usuarios..."
                        : "No se han encontrado usuarios."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </GorgeousBoxBorder>
          <div className="flex items-center justify-end space-x-2">
            <div className="flex items-center justify-end space-x-2 py-2">
              <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-400/20 after:transition dark:focus-within:after:shadow-slate-400/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="text-xs h-7 rounded-lg"
                >
                  <ChevronLeft className="w-3 aspect-square mr-1" />
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
                  <ChevronRight className="w-3 aspect-square ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
