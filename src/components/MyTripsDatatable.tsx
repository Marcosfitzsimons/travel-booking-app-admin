import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Check, Loader2, Trash2, X } from "lucide-react";
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
import { Eye } from "lucide-react";
import { getRowHeight } from "@/lib/utils/getRowHeight";
import ActionButtonDatatable from "./ActionButtonDatatable";
import TrashButtonDatatable from "./TrashButtonDatatable";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

type TripProps = {
  id: string;
  name: string;
  date: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  maxCapacity: number;
  price: number;
  available: boolean;
};

type MyTripsDataTableProps = {
  columns: any;
  userId: string;
  userTrips: TripProps[];
};

const MyTripsDatatable = ({
  columns,
  userTrips,
  userId,
}: MyTripsDataTableProps) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [list, setList] = useState(userTrips);

  const { setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleDelete = async (tripId: string) => {
    setLoading(true);
    setErr(false);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando pasajero del viaje...
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`/passengers/${userId}/${tripId}`);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Lugar
            cancelado con éxito
          </div>
        ),
      });
      setLoading(false);
      setList(list.filter((item) => item.id !== tripId));
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setLoading(false);
      setErr(true);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            eliminar pasajero del viaje
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar pasajero. Por favor, intentar más tarde",
      });
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Acción",
      width: 170,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <ActionButtonDatatable
                text="Ver"
                icon={
                  <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4 md:h-[18px] md:w-[18px] md:top-[4.5px] md:left-[11.4px]" />
                }
                linkTo={`/trips/${params.row.id}`}
              />
            </div>
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger disabled={loading}>
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
                    permanentemente al usuario del viaje.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="md:w-auto">
                    No, volver al perfil del usuario
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(params.row.id)}
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
  ];

  return (
    <div className="h-[500px] w-full max-w-[1400px]">
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
              No se encontraron viajes
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
        getRowId={(row) => row.id}
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
    </div>
  );
};

export default MyTripsDatatable;
