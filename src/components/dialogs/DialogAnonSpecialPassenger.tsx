import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Fingerprint, Loader2, User, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import { Button } from "../ui/button";
import { Passenger } from "@/types/types";
import { DialogAnonPassengerProps } from "@/types/props";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const DialogAnonSpecialPassenger = ({
  id,
  setPassengers,
}: DialogAnonPassengerProps) => {
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [err, setErr] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const { toast } = useToast();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: resetForm,
  } = useForm({
    defaultValues: {
      fullName: "",
      dni: undefined,
    },
  });

  const handleOnSubmitPassenger = async (data: any) => {
    if (data.dni === "") {
      delete data.dni;
    }
    setIsSubmitted2(true);
    setErr(false);
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
      const res = await axiosPrivate.post(`/special-passengers/${id}`, {
        ...data,
      });
      const { savedSpecialPassenger } = res.data;
      setPassengers((prevPassengers: Passenger[]) => [
        ...prevPassengers,
        savedSpecialPassenger,
      ]);
      setIsDialogOpen(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Pasajero ha
            sido creado con éxito
          </div>
        ),
      });
      resetForm();
      setIsSubmitted2(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setErr(true);
      setIsSubmitted2(false);
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

  const handleOnSubmitAnonymousPassenger = async () => {
    setIsSubmitted2(true);
    setErr(false);
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
      const res = await axiosPrivate.post(`/special-passengers/${id}`, {});
      const { savedSpecialPassenger } = res.data;
      setPassengers((prevPassengers: Passenger[]) => [
        ...prevPassengers,
        savedSpecialPassenger,
      ]);
      setIsDialogOpen(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Pasajero ha
            sido creado con éxito
          </div>
        ),
      });
      setIsSubmitted2(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      setIsSubmitted2(false);
      setErr(true);
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
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <div className="flex items-center self-center ">
        <DialogTrigger asChild>
          <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
            <Button
              className="h-[32px] px-3.5 pl-[35px] relative bg-teal-800/60 text-white shadow-input hover:text-white
dark:text-slate-100 dark:bg-teal-700/60 md:text-base dark:hover:text-white dark:shadow-none"
            >
              <UserPlus className="absolute cursor-pointer left-3 top-[6px] h-5 w-5" />
              Agregar pasajero
            </Button>
          </div>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl lg:text-3xl">
            Agregar pasajero
          </DialogTitle>
          <DialogDescription className="text-center lg:text-lg">
            Información acerca del pasajero
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col items-center gap-5">
          <div className="w-full flex flex-col items-center gap-5">
            <form
              key={2}
              onSubmit={handleSubmit2(handleOnSubmitPassenger)}
              className="w-full flex flex-col items-center gap-3"
            >
              <div className="w-full flex flex-col gap-3 max-w-sm">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <div className="relative flex items-center">
                    <User className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[1px]" />
                    <Input
                      type="text"
                      id="fullName"
                      className="pl-[32px]"
                      {...register2("fullName", {
                        required: {
                          value: true,
                          message: "Por favor, ingresar nombre completo.",
                        },
                        minLength: {
                          value: 3,
                          message: "Nombre completo no puede ser tan corto.",
                        },
                        maxLength: {
                          value: 25,
                          message: "Nombre completo no puede ser tan largo.",
                        },
                      })}
                    />
                  </div>
                  {errors2.fullName && (
                    <p className="text-red-600 text-sm">
                      {errors2.fullName.message}
                    </p>
                  )}
                </div>
                <div className="relative bottom-[1px] grid w-full items-center gap-2">
                  <Label className="flex items-center gap-1" htmlFor="dni">
                    DNI
                    <span className="relative text-xs text-accent md:bottom-[2px]">
                      (opcional)
                    </span>
                  </Label>
                  <div className="relative flex items-center">
                    <Fingerprint className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[1px]" />
                    <Input
                      type="number"
                      className="pl-[32px]"
                      id="dni"
                      {...register2("dni")}
                    />
                  </div>
                  {errors2.dni && (
                    <p className="text-red-600 text-sm">
                      {errors2.dni.message}
                    </p>
                  )}
                </div>
              </div>
              {err && (
                <p className="mx-auto text-red-600 text-sm self-start">
                  Ha ocurrido un error. Intentar más tarde
                </p>
              )}
              <DialogFooter className="w-full mt-4 flex flex-col items-center gap-2 sm:flex-col sm:items-center">
                <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                  <Button
                    disabled={isSubmitted2}
                    type="submit"
                    className="w-auto h-8 z-20 rounded-lg bg-primary text-slate-100 hover:text-white dark:text-slate-100 dark:hover:text-white dark:bg-primary"
                  >
                    Crear pasajero
                  </Button>
                </div>
                <p className="">o</p>
                <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
                  <Button
                    onClick={handleOnSubmitAnonymousPassenger}
                    disabled={isSubmitted2}
                    type="button"
                    className="w-auto h-8 z-20 rounded-lg bg-black/80 text-slate-100 hover:text-white dark:text-slate-100 dark:hover:text-white"
                  >
                    Crear pasajero anónimo
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAnonSpecialPassenger;
