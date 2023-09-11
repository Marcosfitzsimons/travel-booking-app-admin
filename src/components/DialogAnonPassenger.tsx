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
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Check, Fingerprint, Loader2, User, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import AddressAutocomplete from "./AddressAutocomplete";
import { UserInput } from "@/types/types";
import { Passenger } from "@/types/types";
import { DialogAnonPassengerProps } from "@/types/props";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { userAddressInputs } from "@/formSource";

const DialogAnonPassenger = ({
  id,
  setPassengers,
}: DialogAnonPassengerProps) => {
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [err, setErr] = useState(false);
  const [addressCapitalValue, setAddressCapitalValue] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  const { toast } = useToast();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    defaultValues: {
      fullName: "",
      dni: undefined,
      addressCda: {
        street: "",
        streetNumber: undefined,
        crossStreets: "",
      },
      addressCapital: "",
    },
  });

  const handleOnSubmitPassenger = async (data: any) => {
    const filteredData: any = {};

    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === "string" && data[key].trim() === "") {
          // Skip empty string fields
          continue;
        }

        if (key === "addressCda") {
          // Check if addressCda should be included
          const { street, streetNumber, crossStreets } = data[key];

          if (
            (street || streetNumber || crossStreets) &&
            (street !== "" || streetNumber !== null || crossStreets !== "")
          ) {
            filteredData[key] = {
              street: street || "",
              streetNumber: streetNumber || null,
              crossStreets: crossStreets || "",
            };
          }
        } else {
          filteredData[key] = data[key];
        }
      }
    }

    // Check if addressCapitalValue is not empty before including it
    if (addressCapitalValue.trim() !== "") {
      filteredData.addressCapital = addressCapitalValue;
    }
    setErr(false);
    setIsSubmitted2(true);
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
      const res = await axiosPrivate.post(`/passengers/${user?._id}/${id}`, {
        ...filteredData,
      });
      const { savedPassenger } = res.data;
      setPassengers((prevPassengers: Passenger[]) => [
        ...prevPassengers,
        savedPassenger,
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
      const res = await axiosPrivate.post(`/passengers/${user?._id}/${id}`, {});
      toast({
        description: "Pasajero anónimo ha sido creado con éxito",
      });
      const { savedPassenger } = res.data;
      setPassengers((prevPassengers: Passenger[]) => [
        ...prevPassengers,
        savedPassenger,
      ]);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Pasajero ha
            sido creado con éxito
          </div>
        ),
      });
      setIsDialogOpen(false);
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
      <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-100/20 dark:after:shadow-highlight dark:after:shadow-slate-100/30 after:transition focus-within:after:shadow-slate-100 dark:focus-within:after:shadow-slate-100">
        <DialogTrigger className="px-3.5 w-auto h-8 pl-[35px] z-20 rounded-lg bg-black/80 text-slate-100 hover:text-white dark:text-slate-100 dark:hover:text-white">
          <UserPlus className="absolute cursor-pointer left-3 top-[5px] h-5 w-5" />
          Agregar pasajero anónimo
        </DialogTrigger>
      </div>
      <DialogContent className="py-10">
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
          <DialogTitle className="text-center text-2xl lg:text-3xl">
            Agregar pasajero
          </DialogTitle>
          <DialogDescription className="text-center lg:text-lg">
            Información acerca del pasajero
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit2(handleOnSubmitPassenger)}
          className="w-full flex flex-col items-center gap-3"
        >
          <div className="w-full max-w-md flex flex-col items-center lg:max-w-xl">
            <div className="my-3 w-full flex flex-col items-center">
              <Separator className="w-8 my-2 bg-border-color dark:bg-border-color-dark" />
              <h5 className="text-center w-full font-medium dark:text-white lg:text-start lg:text-xl">
                Datos personales
              </h5>
            </div>
            <div className="w-full flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2">
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
                  <p className="text-red-600 text-sm">{errors2.dni.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full max-w-md flex flex-col items-center gap-3 lg:max-w-xl">
            <div className="w-full flex flex-col items-center">
              <Separator className="w-8 my-2 bg-border-color dark:bg-border-color-dark" />
              <h5 className="text-center w-full font-medium dark:text-white lg:text-start lg:text-xl">
                Domicilios
              </h5>
            </div>

            <div className="w-full flex flex-col items-center gap-2 lg:max-w-5xl lg:flex-row lg:items-start">
              <div className="w-full flex flex-col gap-2">
                <h6 className="font-serif text-accent ">Carmen de Areco</h6>
                {userAddressInputs.map((input: UserInput) => {
                  const key = input.id;
                  const fieldName: any = `addressCda.${key}`;
                  return (
                    <div
                      key={input.id}
                      className="grid w-full items-center gap-2"
                    >
                      <Label htmlFor={input.id}>{input.label}</Label>
                      <div className="relative flex items-center">
                        {input.icon}
                        <Input
                          type={input.type}
                          id={input.id}
                          placeholder={input.placeholder}
                          className="pl-[32px]"
                          {...register2(fieldName)}
                        />
                      </div>
                      {errors2[input.id as keyof typeof errors2] && (
                        <p className="text-red-600 text-sm">
                          {errors2[input.id as keyof typeof errors2]?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Separator className="w-8 my-2 md:hidden" />

              <div className="w-full flex flex-col gap-2">
                <h6 className="font-serif text-accent ">Capital Federal</h6>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="location-input">Dirección</Label>
                  <AddressAutocomplete
                    value={addressCapitalValue}
                    setValue={setAddressCapitalValue}
                  />
                </div>
              </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default DialogAnonPassenger;
