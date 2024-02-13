import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Crop,
  Fingerprint,
  Loader2,
  Mail,
  Milestone,
  Phone,
  Plus,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DefaultButton from "./DefaultButton";
import { useToast } from "../hooks/ui/use-toast";
import SearchUserInput from "./SearchUserInput";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { UserDataTableProps } from "@/types/props";
import Error from "./Error";
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
} from "./ui/table";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { User } from "@/types/types";

const NewPassengerDatatable = <TData, TValue>({
  columns,
  tripId,
}: UserDataTableProps<TData, TValue>) => {
  const [loading, setLoading] = useState(false);
  const [filtering, setFiltering] = useState("");

  const baseUrl = `/users`;

  const { data, error } = useFetch(baseUrl);

  const actionColumn: ColumnDef<TData, TValue>[] = [
    {
      id: "action",
      header: "Acción",
      cell: ({ row }) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const user = row.original as User;
        console.log(user);
        return (
          <div className="flex items-center gap-2">
            <Dialog
              open={isDialogOpen}
              onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
            >
              <DialogTrigger asChild>
                <div className="relative flex items-center">
                  <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                    <Button
                      disabled={loading}
                      className="h-[28px] px-[13px] pl-[30px] relative bg-teal-800/60 text-white shadow-input hover:text-white dark:text-slate-100 dark:bg-teal-700/60 dark:hover:text-white dark:shadow-none"
                    >
                      <Plus className="absolute left-[12px] top-[6px] h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
                  <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                </div>
                <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px] transition-transform ">
                  <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                  <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-center lg:text-xl">
                    Agregar pasajero al viaje
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2 flex flex-col items-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                      src={user.image}
                      alt="avatar"
                    />
                    <AvatarFallback>
                      <UserIcon className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-center">
                    <h3 className="font-medium text-xl dark:text-white ">
                      {user.fullName}
                    </h3>
                    <h4 className="text-[#737373] dark:text-slate-500">
                      @{user.username}
                    </h4>
                  </div>
                  <div className="flex flex-col w-full overflow-hidden gap-2 max-w-sm items-start px-2">
                    <div className="w-full flex flex-col gap-1">
                      <Separator className="w-2 self-center my-2 bg-border " />
                      <h5 className="text-center w-full font-medium dark:text-white">
                        Datos personales
                      </h5>

                      <ul className="flex flex-col w-full overflow-hidden gap-1 shadow-md py-2 rounded-md bg-card border px-1 lg:px-2 dark:bg-[#171717]">
                        <li className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-accent shrink-0 " />
                          <span className="font-medium">Email:</span>
                          {user.email}
                        </li>
                        <li className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-accent " />
                          <span className="font-medium">Celular:</span>{" "}
                          {user.phone}
                        </li>
                        <li className="flex items-center gap-1 shrink-0">
                          <Fingerprint className="w-4 h-4 text-accent  shrink-0" />
                          <span className="font-medium shrink-0">DNI:</span>
                          <span className="shrink-0">{user.dni}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="w-full flex flex-col gap-1 ">
                      <Separator className="w-2 self-center my-2 bg-border  " />
                      <h5 className="text-center w-full font-medium dark:text-white">
                        Domicilios
                      </h5>
                      <div className="flex flex-col gap-1 shadow-md py-2 rounded-md bg-card border x-1 lg:px-2 dark:bg-[#171717]">
                        <div className="flex flex-col gap-1">
                          <h6 className="font-serif text-accent ">
                            Carmen de Areco
                          </h6>
                          <div className="flex items-center gap-1">
                            <Milestone className="w-4 h-4 text-accent " />
                            <span className="font-medium dark:text-white">
                              Dirreción:
                            </span>
                            <p>{`${user.addressCda.street} ${user.addressCda.streetNumber}`}</p>
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <div className="flex items-center gap-1">
                              <Crop className="w-4 h-4 text-accent " />
                              <span className="font-medium dark:text-white">
                                Calles que cruzan:
                              </span>
                            </div>
                            <span className="">
                              {user.addressCda.crossStreets}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 lg:basis-[40%]">
                          <h6 className="font-serif text-accent ">
                            Capital Federal
                          </h6>
                          <div className="flex items-center gap-1">
                            <Milestone className="w-4 h-4 text-accent " />
                            <span className="font-medium dark:text-white">
                              Dirreción:
                            </span>{" "}
                            <p>{user.addressCapital}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center my-4 mx-auto">
                    <DefaultButton
                      loading={loading}
                      onClick={() =>
                        handleAddPassenger(user._id, setIsDialogOpen)
                      }
                    >
                      Agregar pasajero
                    </DefaultButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
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

  const { toast } = useToast();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleAddPassenger = async (userId: string, setIsDialogOpen: any) => {
    setLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Creando pasajero...
        </div>
      ),
    });
    try {
      await axiosPrivate.post(`/passengers/${userId}/${tripId}`, {
        userId,
      });
      setLoading(false);
      setIsDialogOpen(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Pasajero ha
            sido creado con éxito
          </div>
        ),
      });
      setTimeout(() => {
        navigate(`/trips/${tripId}`);
      }, 100);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setLoading(false);
      setIsDialogOpen(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al crear
            pasajero
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al crear pasajero. Por favor, intentar más tarde",
      });
    }
  };

  return (
    <div className="h-[650px] w-full max-w-[1400px]">
      {error ? (
        <Error />
      ) : (
        <div>
          <div className="my-3">
            <SearchUserInput filter={filtering} setFilter={setFiltering} />
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
                      colSpan={columns.length}
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
              <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-200/20 after:transition dark:focus-within:after:shadow-slate-300/60 dark:before:ring-slate-800/40 dark:before:border-slate-300/60">
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
              <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-200/20 after:transition dark:focus-within:after:shadow-slate-300/60 dark:before:ring-slate-800/40 dark:before:border-slate-300/60">
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
        </div>
      )}
    </div>
  );
};

export default NewPassengerDatatable;
