import { DataGrid } from "@mui/x-data-grid";
import { Eye, Fingerprint, Trash2, User } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { getRowHeight } from "@/lib/utils/getRowHeight";
import TrashButtonDatatable from "./TrashButtonDatatable";
import { SpecialPassenger } from "@/types/types";

type DataTableProps = {
  columns: any;
  tripPassengers: SpecialPassenger[];
  handleDelete: any;
};

const SpecialPassengersDatable = ({
  columns,
  tripPassengers,
  handleDelete,
}: DataTableProps) => {
  const actionColumn = [
    {
      field: "action",
      headerName: "Acción",
      width: 180,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Dialog>
                <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                  <DialogTrigger className="h-[28px] px-[13px] rounded-lg pl-[32px] relative bg-teal-800/60 text-white shadow-input md:text-[15px] hover:text-white dark:text-slate-100 dark:bg-teal-700/60 dark:hover:text-white dark:shadow-none">
                    <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4" />
                    Ver
                  </DialogTrigger>
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl lg:text-3xl">
                      Información del pasajero:
                    </DialogTitle>
                  </DialogHeader>
                  <div className="w-10/12 mx-auto p-1">
                    <p className="flex items-center justify-center pb-4 gap-1">
                      ID: <span>{params.row._id ? params.row._id : ""}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <User className="h-[18px] w-[18px] text-accent" />
                      <span className="font-semibold">Nombre completo:</span>
                      <span>
                        {params.row.fullName
                          ? params.row.fullName
                          : "Pasajero anónimo"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Fingerprint className="h-[18px] w-[18px] text-accent" />
                      <span className="font-semibold">DNI:</span>{" "}
                      <span>{params.row.dni ? params.row.dni : "-"}</span>
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger className="z-50">
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
                    permanentemente al pasajero de este viaje.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col-reverse gap-1 md:flex-row md:justify-end">
                  <AlertDialogCancel className="md:w-auto">
                    No, volver atrás
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(params.row._id)}
                    className="md:w-auto"
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
      ) : (
        <div className="mx-auto flex flex-col items-center gap-3">
          <p>El viaje no tiene pasajeros por el momento.</p>
        </div>
      )}
    </div>
  );
};

export default SpecialPassengersDatable;
