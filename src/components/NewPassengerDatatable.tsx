import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  Crop,
  Fingerprint,
  Mail,
  Milestone,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { getRowHeight } from "@/lib/utils/getRowHeight";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { UserDataTableProps } from "@/types/props";

type MyRowType = {
  _id: string;
};

const NewPassengerDatatable = ({ columns, tripId }: UserDataTableProps) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const baseUrl = `/users`;

  const { data, error } = useFetch(baseUrl);

  const handleAddPassenger = async (userId: string) => {
    setLoading(true);
    setErr(false);
    try {
      await axiosPrivate.post(`/passengers/${userId}/${tripId}`, {
        userId: userId,
      });
      setLoading(false);
      setErr(false);
      toast({
        description: "Pasajero agregado con éxito.",
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
      const errorMsg = err.response.data.msg;
      setLoading(false);
      setErr(true);
      toast({
        variant: "destructive",
        description: errorMsg
          ? errorMsg
          : "Error al agregar pasajero, intente más tarde.",
      });
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Acción",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative flex items-center">
                  <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                    <Button className="h-[28px] px-[13px] pl-[30px] relative bg-teal-800/60 text-white shadow-input hover:text-white dark:text-slate-100 dark:bg-teal-700/60 dark:hover:text-white dark:shadow-none">
                      <Plus className="absolute left-[12px] top-[6px] h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Agregar pasajero al viaje
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2 flex flex-col items-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                      src={params.row.image}
                      alt="avatar"
                    />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-center">
                    <h3 className="font-medium text-xl dark:text-white ">
                      {params.row.fullName}
                    </h3>
                    <h4 className="text-[#737373] dark:text-slate-500">
                      @{params.row.username}
                    </h4>
                  </div>
                  <div className="flex flex-col w-full overflow-hidden gap-2 max-w-sm items-start px-2">
                    <div className="w-full flex flex-col gap-1">
                      <Separator className="w-8 self-center my-2 bg-border " />
                      <h5 className="text-center w-full font-medium dark:text-white">
                        Datos personales
                      </h5>

                      <ul className="flex flex-col w-full overflow-hidden gap-1 shadow-md py-2 rounded-md bg-card border px-1 lg:px-2 dark:bg-[#171717]">
                        <li className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-accent shrink-0 " />
                          <span className="font-medium">Email:</span>
                          {params.row.email}
                        </li>
                        <li className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-accent " />
                          <span className="font-medium">Celular:</span>{" "}
                          {params.row.phone}
                        </li>
                        <li className="flex items-center gap-1 shrink-0">
                          <Fingerprint className="w-4 h-4 text-accent  shrink-0" />
                          <span className="font-medium shrink-0">DNI:</span>
                          <span className="shrink-0">{params.row.dni}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="w-full flex flex-col gap-1 ">
                      <Separator className="w-8 self-center my-2 bg-border  " />
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
                            <p>{`${params.row.addressCda.street} ${params.row.addressCda.streetNumber}`}</p>
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <div className="flex items-center gap-1">
                              <Crop className="w-4 h-4 text-accent " />
                              <span className="font-medium dark:text-white">
                                Calles que cruzan:
                              </span>
                            </div>
                            <span className="">
                              {params.row.addressCda.crossStreets}
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
                            <p>{params.row.addressCapital}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center my-4 mx-auto">
                    <DefaultButton
                      loading={loading}
                      onClick={() => handleAddPassenger(params.row._id)}
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

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className="h-[650px] w-full max-w-[1400px]">
      <div className="my-3">
        <SearchUserInput list={list} setFilteredList={setFilteredList} />
      </div>
      {error && (
        <p className="text-red-600">
          Error al cargar usuarios. Intentar más tarde
        </p>
      )}
      {err && (
        <p className="text-red-600">
          Error al agregar pasajero. Intentar más tarde
        </p>
      )}
      {filteredList.length > 0 ? (
        <DataGrid<MyRowType>
          rows={filteredList}
          columns={actionColumn.concat(columns)}
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
          getRowHeight={getRowHeight}
          slots={{
            noRowsOverlay: () => (
              <div className="h-full flex justify-center items-center">
                Cargando usuarios...
              </div>
            ),
            noResultsOverlay: () => (
              <div className="h-full flex justify-center items-center">
                No se encontraron usuarios
              </div>
            ),
          }}
          className="max-w-[1400px]"
        />
      ) : (
        <DataGrid<MyRowType>
          rows={list}
          columns={actionColumn.concat(columns)}
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
          slots={{
            noRowsOverlay: () => (
              <div className="h-full flex justify-center items-center">
                Cargando usuarios...
              </div>
            ),
            noResultsOverlay: () => (
              <div className="h-full flex justify-center items-center">
                No se encontraron usuarios
              </div>
            ),
          }}
          getRowHeight={getRowHeight}
          className="max-w-[1400px]"
        />
      )}
    </div>
  );
};

export default NewPassengerDatatable;
