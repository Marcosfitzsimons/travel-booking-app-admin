import { useForm } from "react-hook-form";
import { useContext, useEffect, useRef, useState } from "react";
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
import { Crop, Fingerprint, Milestone, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import AddressAutocomplete from "./AddressAutocomplete";

type Trip = {
  _id: string;
  name: string;
  date: null | undefined | string;
  from: string;
  departureTime: string;
  to: string;
  arrivalTime: string;
  maxCapacity: number | undefined;
  price: number | undefined;
  passengers: any[];
};

interface InputValidation {
  required: {
    value: boolean;
    message: string;
  };
  minLength: {
    value: number;
    message: string;
  };
  maxLength: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
}

interface UserInput {
  id: any;
  label: string;
  type: string;
  placeholder?: string;
  validation?: InputValidation;
  icon?: any;
}

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

type Passenger = {
  createdBy?: UserData;
  addressCda?: addressCda;
  addressCapital?: string;
  fullName?: string;
  dni?: string;
};

type DialogAnonPassengerProps = {
  setErr: any;
  id: string | undefined;
  err: any;
  fetchData: () => any;
};

const DialogAnonPassenger = ({
  setErr,
  err,
  id,
  fetchData,
}: DialogAnonPassengerProps) => {
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [addressCapitalValue, setAddressCapitalValue] = useState("");

  const { user } = useContext(AuthContext);
  console.log(addressCapitalValue);
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

  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleOnSubmitPassenger = async (data: Passenger) => {
    setIsSubmitted2(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/passengers/${
          user?._id
        }/${id}`,
        {
          ...data,
          addressCapital: addressCapitalValue,
        },
        { headers }
      );
      toast({
        description: "Pasajero ha sido creado con éxito.",
      });
      fetchData();
      setIsSubmitted2(false);
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setErr(errorMsg);
      setIsSubmitted2(false);
      toast({
        description: "Error al crear pasajero. Intentar más tarde.",
      });
    }
  };

  const handleOnSubmitAnonymousPassenger = async () => {
    setIsSubmitted2(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/passengers/${
          user?._id
        }/${id}`,
        {},
        { headers }
      );
      toast({
        description: "Pasajero anónimo ha sido creado con éxito.",
      });
      fetchData();
      setIsSubmitted2(false);
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      setErr(errorMsg);
      setIsSubmitted2(false);
      toast({
        description: "Error al crear pasajero anónimo. Intentar más tarde.",
      });
    }
  };

  const userAddressInputs = [
    {
      id: "street",
      icon: (
        <Milestone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px]" />
      ),
      label: "Calle",
      type: "text",
      placeholder: "Matheu",
      validation: {
        required: {
          value: true,
          message: "Por favor, ingresar domicilio.",
        },
        minLength: {
          value: 3,
          message: "Domicilio no puede ser tan corto.",
        },
        maxLength: {
          value: 25,
          message: "Domicilio no puede ser tan largo.",
        },
      },
    },
    {
      id: "streetNumber",
      icon: (
        <Milestone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px]  " />
      ),
      label: "Número",
      type: "number",
      placeholder: "354",
      validation: {
        required: {
          value: true,
          message: "Por favor, ingresar número de domicilio ",
        },
        minLength: {
          value: 1,
          message: "Número de domicilio no puede ser tan corto.",
        },
        maxLength: {
          value: 5,
          message: "Número de domicilio no puede ser tan largo.",
        },
        pattern: {
          value: /^[0-9]+$/,
          message: "Debe incluir solo números.",
        },
      },
    },
    {
      id: "crossStreets",
      icon: (
        <Crop className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px]" />
      ),
      label: "Calles que cruzan",
      type: "text",
      placeholder: "Matheu y D. Romero",
      validation: {
        required: {
          value: true,
          message:
            "Por favor, ingresar las calles que cruzan cerca de ese domicilio.",
        },
        minLength: {
          value: 3,
          message: "No puede ser tan corto.",
        },
        maxLength: {
          value: 40,
          message: "No puede ser tan largo.",
        },
      },
    },
  ];

  return (
    <Dialog>
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

          {err && <p className="text-red-600 text-sm self-start">{err}</p>}
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
