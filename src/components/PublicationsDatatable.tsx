import { Newspaper, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import ActionButton from "@/components/ActionButton";
import TotalCountCard from "@/components/TotalCountCard";
import { Publication } from "@/types/types";
import Error from "@/components/Error";
import { DataTableProps } from "@/types/props";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ActionButtonDatatable from "./ActionButtonDatatable";
import { Icons } from "./icons";
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
import TrashButtonDatatable from "./TrashButtonDatatable";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { Button } from "./ui/button";

const PublicationsDatatable = <TData, TValue>({
  columns,
  linkText,
}: DataTableProps<TData, TValue>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<Publication[]>([]);

  const baseUrl = `/publications`;

  const { data, loading, error } = useFetch(baseUrl);

  const actionColumn: ColumnDef<TData, TValue>[] = [
    {
      accessorKey: "action",
      header: "Acción",
      cell: ({ row }) => {
        const publication = row.original as Publication;
        return (
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center">
              <ActionButtonDatatable
                text="Ver"
                icon={
                  <Icons.eye className="absolute left-[13px] top-[5.5px] h-4 w-4 md:h-[18px] md:w-[18px] md:top-[4.5px] md:left-[11.4px]" />
                }
                linkTo={`/publications/${publication._id}`}
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
                    permanentemente la publicación.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="md:w-auto">
                    No, volver al listado
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(publication._id)}
                    className="w-full md:w-auto"
                  >
                    Si, borrar publicación
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
    data: data,
    columns: actionColumn.concat(columns),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAuth();

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Icons.spinner className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando publicación
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`/publications/${id}`);
      setList(list.filter((item) => item._id !== id));
      setIsLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Icons.check className="h-5 w-5 text-green-600 shrink-0" />}{" "}
            Publicación eliminada con éxito
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
            Error al eliminar publicación
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar publicación. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <section className="h-[650px] w-full max-w-[1400px]">
      {error ? (
        <Error />
      ) : (
        <>
          <div className="relative w-full flex flex-col items-center gap-3 md:pt-5">
            <div className="md:absolute md:right-0 md:top-[-80px]">
              <TotalCountCard
                icon={<Icons.newspaper className="text-accent h-8 w-8" />}
                title="Publicaciones"
                value={loading ? "0" : list.length}
              />
            </div>
            <div className="mb-3 md:self-end">
              <ActionButton
                text={linkText}
                linkTo="/publications/new"
                icon={
                  <Icons.add className="absolute cursor-pointer left-[13px] top-[7.3px] h-[17px] w-[17px] md:top-[4px] md:left-[8px] md:h-6 md:w-6" />
                }
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
                        ? "Cargando publicationes..."
                        : "No se han encontrado publicaciones."}
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
    </section>
  );
};

export default PublicationsDatatable;
