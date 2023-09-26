import { Check, Eye, Loader2, Trash2, X } from "lucide-react";
import { useToast } from "../hooks/ui/use-toast";
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
import moment from "moment";
import { useState } from "react";
import ActionButtonDatatable from "./ActionButtonDatatable";
import { convertToArgentineTimezone } from "@/lib/utils/convertToArgentineTimezone";
import { PublicationCardProps } from "@/types/props";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import GorgeousBoxBorder from "./GorgeousBoxBorder";

const PublicationCard = ({ item, setList, list }: PublicationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { _id, title, subtitle, image, description, createdAt } = item;

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
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Eliminando publicación
        </div>
      ),
    });
    try {
      await axiosPrivate.delete(`/publications/${_id}`);
      setList(list.filter((item) => item._id !== id));
      setIsLoading(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Publicación
            eliminada con éxito
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
            eliminar publicación
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al eliminar publicación. Por favor, intentar más tarde",
      });
    }
  };

  const { datePart, timePart } = convertToArgentineTimezone(createdAt);

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });

  return (
    <GorgeousBoxBorder className="w-full max-w-xl">
      <article className="w-full flex flex-col gap-2 max-w-xl bg-card p-4 shadow-input rounded-lg h-32 border lg:flex-row lg:justify-between lg:pt-[10px] dark:shadow-none">
        <div className="overflow-y-hidden relative w-full">
          <div className="flex flex-col">
            <h3 className="font-bold dark:text-white text-xl shrink-0">
              {title}
            </h3>
            {subtitle && <h4 className="text-card-foreground">{subtitle}</h4>}
            <p className="text-card-foreground mt-2">{description}</p>
          </div>
          {image && (
            <div className="relative after:bg-gradient-to-b after:from-transparent after:to-black/5 after:inset-0 after:absolute after:z-10 dark:after:to-black/20">
              <img src={image} alt="imagen adjunta" />
            </div>
          )}
          <p className="absolute right-0 top-1 text-sm">
            {datePart}{" "}
            <span className="text-[#737373] text-xs font-extralight dark:text-slate-500 ">
              {timePart}
            </span>
          </p>
        </div>

        <div className="self-end flex items-center gap-2 lg:self-center">
          <ActionButtonDatatable
            linkTo={`/publications/${_id}`}
            text="Ver"
            icon={<Eye className="absolute left-[13px] top-[5.5px] h-4 w-4" />}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="relative flex items-center">
                <button
                  disabled={isLoading}
                  className="pl-[22px] rounded-md text-[#b4343a] font-semibold transition-colors hover:text-red-300"
                >
                  <Trash2 className="absolute left-1 top-[3.3px] h-4 w-4" />
                  Borrar
                </button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no podrá deshacerse. Esto eliminará
                  permanentemente la publicación
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="md:w-auto">
                  No, volver al listado de publicaciones
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(_id)}
                  className="w-full md:w-auto"
                >
                  Si, borrar publicación
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </article>
    </GorgeousBoxBorder>
  );
};

export default PublicationCard;
