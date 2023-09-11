import { DataGrid } from "@mui/x-data-grid";
import { Eye, Trash2, Map, RotateCcw, X, Check, Loader2 } from "lucide-react";
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
import { useToast } from "../hooks/ui/use-toast";
import DatePickerContainer from "./DatePickerContainer";
import { Button } from "./ui/button";
import ActionButton from "./ActionButton";
import { Plus } from "lucide-react";
import ActionButtonDatatable from "./ActionButtonDatatable";
import TotalCountCard from "./TotalCountCard";
import TrashButtonDatatable from "./TrashButtonDatatable";
import { getRowHeight } from "@/lib/utils/getRowHeight";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Trip } from "@/types/types";
import { ExtendedColumn } from "@/types/types";
import { DataTableProps } from "@/types/props";
import Error from "./Error";

const TripsDatatable = ({ columns, linkText }: DataTableProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [list, setList] = useState<Trip[]>([]);
  const [filteredList, setFilteredList] = useState<Trip[]>([]);
  const baseUrl = `/trips`;

  const { data, loading, error } = useFetch(baseUrl);

  const { toast } = useToast();

  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setErr(false);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando viaje...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`${baseUrl}/${id}`);
      setList(list.filter((item) => item._id !== id));
      setIsLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Viaje ha
            sido eliminado con éxito
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
      setErr(true);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            eliminar viaje
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar viaje. Por favor, intentar más tarde",
      });
    }
  };

  const handleFilteredTrips = () => {
    let filteredTrips: Trip[];
    let dateSelected: string;
    if (startDate) {
      dateSelected = moment(startDate).locale("es").format("ddd DD/MM");
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

  const actionColumn: ExtendedColumn[] = [
    {
      field: "action",
      headerName: "Acción",
      width: 170,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center">
              <ActionButtonDatatable
                text="Ver"
                icon={
                  <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4 md:h-[18px] md:w-[18px] md:top-[4.5px] md:left-[11.4px]" />
                }
                linkTo={`/trips/${params.row._id}`}
              />
            </div>
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
                    permanentemente este viaje.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col-reverse gap-1 md:flex-row md:justify-end">
                  <AlertDialogCancel className="md:w-auto">
                    No, volver al listado de viajes
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(params.row._id)}
                    className="md:w-auto"
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

  useEffect(() => {
    setList(data);
  }, [data]);

  useEffect(() => {
    handleFilteredTrips();
  }, [startDate]);

  return (
    <div className="h-[650px] w-full max-w-[1400px]">
      {error ? (
        <Error />
      ) : (
        <>
          <div className="relative w-full my-3 flex flex-col items-center gap-3">
            <div className="md:absolute md:right-0 md:top-[-100px]">
              <TotalCountCard
                icon={<Map className="text-accent h-8 w-8" />}
                title="Viajes disponibles"
                value={loading ? "0" : list.length}
              />
            </div>
            <div className="w-full flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div className="relative flex items-end gap-1 w-[min(100%,184px)]">
                <DatePickerContainer
                  startDate={startDate}
                  setStartDate={setStartDate}
                />
                <div className="absolute -right-[46px] h-full">
                  <div className="relative flex w-[38px] h-full aspect-square before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300">
                    <Button
                      className="absolute w-[38px] h-full flex items-center justify-center cursor-pointer p-2 bg-card rounded-lg border border-slate-800/20 shadow-input dark:bg-[hsl(0,0%,11%)] dark:border-slate-800 dark:shadow-none !outline-none dark:hover:text-white"
                      onClick={() => setStartDate(null)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="self-end">
                <ActionButton
                  text={linkText}
                  icon={
                    <Plus className="absolute cursor-pointer left-[13px] top-[7.3px] h-[18px] w-[18px] md:top-[4px] md:left-[8px] md:h-6 md:w-6" />
                  }
                  linkTo={"/trips/new"}
                />
              </div>
            </div>
          </div>
          {filteredList.length > 0 ? (
            <DataGrid
              rows={filteredList}
              columns={actionColumn.concat(columns)}
              slots={{
                noRowsOverlay: () => (
                  <div className="h-full flex justify-center items-center">
                    Cargando viajes...
                  </div>
                ),
                noResultsOverlay: () => (
                  <div className="h-full flex justify-center items-center">
                    No se encontraron viajes en esa fecha
                  </div>
                ),
              }}
              getRowHeight={getRowHeight}
              checkboxSelection
              hideFooterSelectedRowCount
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 9,
                  },
                },
              }}
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
              pageSizeOptions={[9]}
              getRowId={(row) => row._id || ""}
              className="max-w-[1400px]"
            />
          ) : (
            <DataGrid
              rows={list}
              columns={actionColumn.concat(columns)}
              slots={{
                noRowsOverlay: () => (
                  <div className="h-full flex justify-center items-center">
                    Cargando viajes...
                  </div>
                ),
                noResultsOverlay: () => (
                  <div className="h-full flex justify-center items-center">
                    No se encontraron viajes en esa fecha
                  </div>
                ),
              }}
              getRowHeight={getRowHeight}
              checkboxSelection
              hideFooterSelectedRowCount
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 9,
                  },
                },
              }}
              pageSizeOptions={[9]}
              getRowId={(row) => row._id || ""}
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
          )}
        </>
      )}
    </div>
  );
};

export default TripsDatatable;
