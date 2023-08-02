import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Eye, Trash2, User, UserPlus, UserPlusIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
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
import SearchUserInput from "./SearchUserInput";
import { toast } from "../hooks/ui/use-toast";
import ActionButton from "./ActionButton";
import ActionButtonDatatable from "./ActionButtonDatatable";
import TrashButtonDatatable from "./TrashButtonDatatable";
import { getRowHeight } from "@/lib/utils/getRowHeight";
import TotalCountCard from "./TotalCountCard";

type addressCda = {
  street: string;
  streetNumber: number | null;
  crossStreets: string;
};

type User = {
  _id: string | undefined;
  username: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
  dni: number | undefined;
  addressCda: addressCda | undefined;
  addressCapital: string | undefined;
  phone: number | undefined;
  image?: string | undefined;
};

interface Column {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  renderCell?: (params: any) => any;
}

type DataTableProps = {
  columns: Column[];
  linkText: string;
};

type ExtendedColumn = Column & {
  renderCell?: (params: any) => JSX.Element;
};

const UsersDatatable = ({ columns, linkText }: DataTableProps) => {
  const [list, setList] = useState<User[]>([]);
  const [filteredList, setFilteredList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<any>(false);
  const baseUrl = `https://fabebus-api-example.onrender.com/api/users`;

  const { data, loading, error } = useFetch(baseUrl);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`${baseUrl}/${id}`, {
        headers,
      });
      setList(list.filter((item) => item._id !== id));
      setIsLoading(false);
      toast({
        description: "Usuario eliminado con éxito.",
      });
    } catch (err: any) {
      const errorMsg = err.response.data.msg;
      setIsLoading(false);
      setIsError(errorMsg);
      toast({
        variant: "destructive",
        description: "Error al eliminar usuario, intentar más tarde.",
      });
    }
  };

  const actionColumn: ExtendedColumn[] = [
    {
      field: "action",
      headerName: "Acción",
      width: 180,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-2">
            <ActionButtonDatatable
              linkTo={`/users/${params.row._id}`}
              text="Ver"
              icon={
                <Eye className="absolute left-[13px] top-[5.5px] h-4 w-4" />
              }
            />
            <AlertDialog>
              <div className="relative flex items-center">
                <AlertDialogTrigger>
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
                <AlertDialogFooter className="flex flex-col-reverse gap-1 md:flex-row md:justify-end">
                  <AlertDialogCancel className="md:w-auto">
                    No, volver al listado de usuarios
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(params.row._id)}
                    className="md:w-auto"
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

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className="h-[650px] w-full max-w-[1400px]">
      <div className="w-full my-3 flex flex-col items-center gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          {error && <p className="text-red-500 order-2">{error.message}</p>}
          {isError && <p className="text-red-500 order-2">{isError}</p>}
          {isLoading && <p className="text-red-500 order-2">is loading...</p>}
          <SearchUserInput list={list} setFilteredList={setFilteredList} />
        </div>
        <div className="relative w-full flex items-end justify-between sm:w-auto sm:gap-3">
          <div className="md:absolute md:right-0 md:top-[-100px]">
            <TotalCountCard
              icon={<Users className="text-accent h-8 w-8" />}
              title="Usuarios"
              value={loading ? "0" : list.length}
            />
          </div>
          <ActionButton
            text="Crear usuario"
            icon={
              <UserPlusIcon className="absolute left-[13px] top-[6px] h-5 w-5" />
            }
            linkTo={"/users/new"}
          />
        </div>
      </div>
      {filteredList.length > 0 ? (
        <DataGrid
          rows={filteredList}
          columns={actionColumn.concat(columns)}
          checkboxSelection
          hideFooterSelectedRowCount
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
          getRowId={(row) => row._id ?? ""}
          getRowHeight={getRowHeight}
          className="max-w-[1400px]"
        />
      ) : (
        <DataGrid
          rows={list}
          columns={actionColumn.concat(columns)}
          checkboxSelection
          slots={{
            noRowsOverlay: () => (
              <div className="h-full flex justify-center items-center">
                Cargando usuarios...
              </div>
            ),
            noResultsOverlay: () => (
              <div className="">No se encontraron usuarios</div>
            ),
          }}
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
          getRowId={(row) => row._id ?? ""} // ?? operator is used to provide a default value of an empty string '' if row._id is null or undefined.
          getRowHeight={getRowHeight}
          className="max-w-[1400px]"
        />
      )}
    </div>
  );
};

export default UsersDatatable;
