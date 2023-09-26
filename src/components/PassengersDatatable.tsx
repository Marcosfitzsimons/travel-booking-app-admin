import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Check, CheckCircle, Edit, Loader2, Trash2, X } from "lucide-react";
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
import { useToast } from "../hooks/ui/use-toast";
import TrashButtonDatatable from "./TrashButtonDatatable";
import { getRowHeight } from "@/lib/utils/getRowHeight";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { Passenger } from "@/types/types";
import GorgeousBorder from "./GorgeousBorder";

type DataTableProps = {
  columns: any;
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
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
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
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Estado del
            pago actualizado con éxito
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
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            actualizar estado del pago
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Acción",
      width: 130,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center">
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger disabled={loading} className="z-50">
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
                    permanentemente al usuario de este viaje.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="md:w-auto">
                    No, volver atrás
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isLoading}
                    onClick={() =>
                      handleDelete(
                        params.row.createdBy
                          ? params.row.createdBy?._id
                          : params.row._id
                      )
                    }
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
      field: "isPaid",
      headerName: "Estado pago",
      width: 150,
      renderCell: (params: any) => {
        return (
          <div className="flex flex-col items-start w-32">
            {params.row.isPaid ? (
              <span className="flex items-center gap-[3px] font-medium">
                PAGO{" "}
                <Check className="w-4 h-4 relative bottom-[1px] text-green-600 lg:w-5 lg:h-5" />
              </span>
            ) : (
              <span className="flex items-center gap-[3px]">
                NO PAGO{" "}
                <X className="w-4 h-4 relative bottom-[1px] text-red-600 lg:w-5 lg:h-5" />
              </span>
            )}
            <AlertDialog>
              <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-300/50 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-600 dark:focus-within:after:shadow-slate-100">
                <AlertDialogTrigger
                  disabled={isLoading}
                  className="text-sm h-auto w-auto pl-[33px] py-1 px-3 z-20 rounded-lg bg-white dark:bg-black/80 dark:text-slate-100 dark:hover:text-white"
                >
                  <Edit className="absolute cursor-pointer left-3.5 top-[5px] h-[15px] w-[15px]" />
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
                        <Check className="w-4 h-4 relative bottom-[1px] text-green-600 lg:w-5 lg:h-5" />
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
                        <X className="w-4 h-4 relative bottom-[1px] text-red-600 lg:w-5 lg:h-5" />
                      </ToggleGroup.Item>
                    </GorgeousBorder>
                  </ToggleGroup.Root>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (
                        (params.row.isPaid && optionSelected === "paid") ||
                        (!params.row.isPaid && optionSelected === "unpaid")
                      ) {
                        return toast({
                          variant: "destructive",
                          title: (
                            <div className="flex gap-1">
                              {
                                <X className="h-5 w-5 text-destructive shrink-0" />
                              }{" "}
                              Error al actualizar estado del pago
                            </div>
                          ) as any,
                          description:
                            "El estado del pago ya tiene ese valor. Debes cambiarlo para que se actualice",
                        });
                      }
                      handleIsPaid(params.row._id);
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

  return (
    <div
      className={`${
        tripPassengers.length > 0 ? "h-[650px] max-w-[1400px]" : ""
      } w-full`}
    >
      {tripPassengers.length > 0 ? (
        <DataGrid
          rows={tripPassengers}
          columns={actionColumn.concat(columns)}
          checkboxSelection
          getRowHeight={getRowHeight}
          hideFooterSelectedRowCount
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 9,
              },
            },
          }}
          pageSizeOptions={[9]}
          getRowId={(row) => row._id}
          sx={{
            borderRadius: "7px",
            "&>.MuiDataGrid-main": {
              "&>.MuiDataGrid-columnHeaders": {
                borderBottom: "none",
              },

              "& div div div div >.MuiDataGrid-cell": {
                borderBottom: "none",
              },
            },
            "&>.MuiDataGrid-footerContainer": {
              borderTop: "none",
            },
          }}
          className="max-w-[1400px]"
        />
      ) : (
        <div className="mx-auto flex flex-col items-center gap-3">
          <p>El viaje no tiene pasajeros por el momento</p>
        </div>
      )}
    </div>
  );
};

export default PassengersDatable;
