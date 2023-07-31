import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Crop, Eye, Fingerprint, Milestone, Trash2 } from "lucide-react";
import axios from "axios";
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
import { toast } from "../hooks/ui/use-toast";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { User } from "lucide-react";
import { DialogDescription } from "./ui/dialog";
import { Separator } from "./ui/separator";
import ActionButtonDatatable from "./ActionButtonDatatable";
import { Button } from "./ui/button";
import TrashButtonDatatable from "./TrashButtonDatatable";
import { getRowHeight } from "@/lib/utils/getRowHeight";

type Trip = {
  name: string;
  date: Date | null | undefined;
  from: string;
  departureTime: string;
  to: string;
  arrivalTime: string;
  maxCapacity: string;
  price: string;
};

type addressCda = {
  street: string;
  streetNumber: number | undefined;
  crossStreets: string;
};

type UserData = {
  _id: string;
  username: string;
  fullName: string;
  addressCda: addressCda;
  addressCapital: string;
  email: string;
  phone: number | undefined;
  dni: number | undefined;
  image?: string;
  myTrips: Trip[];
};

type DataTableProps = {
  columns: any;
  tripPassengers: any;
  tripId: string | undefined;
  handleDelete: any;
  isLoading: boolean;
};

const PassengersDatable = ({
  columns,
  tripPassengers,
  tripId,
  handleDelete,
  isLoading,
}: DataTableProps) => {
  const actionColumn = [
    {
      field: "action",
      headerName: "Acción",
      width: 170,
      renderCell: (params: any) => {
        const isPassenger = params.row.createdBy;
        return (
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              {isPassenger ? (
                <ActionButtonDatatable
                  text="Ver"
                  icon={
                    <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4 md:h-[18px] md:w-[18px] md:top-[4.5px] md:left-[11.4px]" />
                  }
                  linkTo={`/passengers/${params.row._id}/${tripId}`}
                />
              ) : (
                <div className="relative flex items-center">
                  <Dialog>
                    <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                      <DialogTrigger asChild>
                        <Button className="h-[28px] px-[13px] pl-[32px] relative bg-teal-800/60 text-white shadow-input md:text-[15px] hover:text-white dark:text-slate-100 dark:bg-teal-700/60 dark:hover:text-white dark:shadow-none">
                          <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4 md:h-[18px] md:w-[18px] md:top-[4.5px] md:left-[11.4px]" />
                          Ver
                        </Button>
                      </DialogTrigger>
                    </div>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center text-2xl lg:text-3xl">
                          Información pasajero
                        </DialogTitle>
                        <DialogDescription className="flex items-center justify-center gap-1">
                          <span className="font-bold">ID:</span>{" "}
                          <span>{params.row._id ? params.row._id : ""}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col w-full overflow-hidden gap-2 max-w-xl px-2 mx-auto">
                        <div className="w-full flex flex-col gap-1 max-w-sm mx-auto">
                          <Separator className="w-8 self-center my-2 lg:hidden" />
                          <h5 className="text-center w-full font-medium dark:text-white lg:mb-2 lg:text-xl">
                            Datos personales
                          </h5>

                          <ul className="flex flex-col w-full overflow-hidden gap-1 rounded-md shadow-input py-2 px-4 bg-background border dark:shadow-none">
                            <li className="flex items-center gap-1">
                              <User className="h-[17px] w-[17px] text-accent" />
                              {params.row.fullName ? (
                                <>
                                  <span className="">Nombre completo:</span>
                                  {params.row.fullName}
                                </>
                              ) : (
                                "Pasajero anónimo"
                              )}
                            </li>
                            <li className="flex items-center gap-1 shrink-0">
                              <Fingerprint className="w-4 h-4 text-accent" />
                              <span className="font-medium shrink-0">DNI:</span>
                              <span className="shrink-0">
                                {params.row.dni ? params.row.dni : "-"}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="w-full flex flex-col gap-1">
                          <Separator className="w-8 self-center my-2 lg:hidden" />
                          <h5 className="text-center w-full font-medium dark:text-white lg:mb-2 lg:text-xl">
                            Domicilios
                          </h5>
                          <div className="flex flex-col gap-1 rounded-md shadow-input py-2 px-4 bg-background border sm:flex-row sm:justify-between dark:shadow-none ">
                            <div className="flex flex-col gap-1">
                              <h6 className="font-serif text-accent ">
                                Carmen de Areco
                              </h6>
                              <div className="flex items-center gap-1">
                                <Milestone className="w-4 h-4 text-accent " />
                                <span className="font-medium dark:text-white">
                                  Dirreción:
                                </span>
                                <span>
                                  {params.row.addressCda?.street
                                    ? `${params.row.addressCda.street} ${params.row.addressCda.streetNumber}`
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-[2px] sm:flex-row sm:items-center sm:gap-1">
                                <div className="flex items-center gap-1">
                                  <Crop className="w-4 h-4 text-accent " />
                                  <span className="font-medium dark:text-white">
                                    Calles que cruzan:
                                  </span>
                                </div>
                                <span className="">
                                  {" "}
                                  {params.row.addressCda?.crossStreets
                                    ? params.row.addressCda.crossStreets
                                    : "-"}
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
                                <p>
                                  {params.row.addressCapital
                                    ? params.row.addressCapital
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger className="z-50">
                  <TrashButtonDatatable
                    isLoading={isLoading}
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
                <AlertDialogFooter className="flex flex-col-reverse gap-1 md:flex-row md:justify-end">
                  <AlertDialogCancel className="md:w-auto">
                    No, volver atrás.
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDelete(
                        isPassenger ? params.row.createdBy._id : params.row._id
                      )
                    }
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
          <p>El viaje no tiene pasajeros por el momento.</p>
        </div>
      )}
    </div>
  );
};

export default PassengersDatable;
