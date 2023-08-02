import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Crop,
  Fingerprint,
  Mail,
  Milestone,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionTitle from "../components/SectionTitle";
import DefaultButton from "../components/DefaultButton";
import { tripColumns } from "../datatablesource";
import MyTripsDatatable from "../components/MyTripsDatatable";
import BackButton from "../components/BackButton";
import { toast } from "../hooks/ui/use-toast";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import Loading from "../components/Loading";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import UserInfo from "../components/UserInfo";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { spawn } from "child_process";

type addressCda = {
  street: string;
  streetNumber: number | undefined;
  crossStreets: string;
};

type UserData = {
  fullName: string;
  username: string;
  addressCda: addressCda;
  addressCapital: string;
  dni: number | undefined;
  phone: undefined | number;
  email: string;
  image?: string;
  status: undefined | "Active" | "Pending";
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

const INITIAL_STATES = {
  _id: "",
  addressCapital: "",
  addressCda: {
    street: "",
    streetNumber: undefined,
    crossStreets: "",
  },
  email: "",
  fullName: "",
  myTrips: [],
  phone: undefined,
  dni: undefined,
  username: "",
  image: "",
  status: undefined,
};

const SingleUser = () => {
  const [data, setData] = useState(INITIAL_STATES);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string>("");
  const [err, setErr] = useState<any>(false);
  const [addressCapitalValue, setAddressCapitalValue] = useState("");
  const [statusValue, setStatusValue] = useState<"pending" | "active">(
    "pending"
  );
  console.log(statusValue);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      phone: undefined,
      dni: undefined,
      image: "",
      addressCda: {
        street: "",
        streetNumber: undefined,
        crossStreets: "",
      },
      addressCapital: "",
      status: undefined,
    },
  });

  const capitalizeWord = (string: any) => {
    const firstLetter = string.charAt(0).toUpperCase();
    const restOfString = string.slice(1).toLowerCase();
    return firstLetter + restOfString;
  };

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let { id } = useParams();

  const handleOnSubmit = async (data: UserData) => {
    setLoading(true);

    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");

    try {
      if (!image) {
        const res = await axios.put(
          `https://fabebus-api-example.onrender.com/api/users/${id}`,
          {
            userData: {
              ...data,
              addressCapital: addressCapitalValue,
              status: capitalizeWord(statusValue),
            },
          },
          { headers }
        );
        console.log(res);
        setLoading(false);
        setData(res.data);
        setStatusValue(res.data.status.toLowerCase());
        setAddressCapitalValue(res.data.addressCapital);
        const userData = res.data;
        reset({
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          phone: userData.phone,
          dni: userData.dni,
          addressCda: {
            street: userData.addressCda.street,
            streetNumber: userData.addressCda.streetNumber,
            crossStreets: userData.addressCda.crossStreets,
          },
        });
        toast({
          description: "Cambios guardados con exito.",
        });
      } else {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { url } = uploadRes.data;

        const res = await axios.put(
          `https://fabebus-api-example.onrender.com/api/users/${id}`,
          {
            userData: {
              ...data,
              image: url,
              addressCapital: addressCapitalValue,
              status: capitalizeWord(statusValue),
            },
          },
          { headers }
        );
        setLoading(false);
        setData(res.data);
        setStatusValue(res.data.status.toLowerCase());
        setAddressCapitalValue(res.data.addressCapital);
        const userData = res.data;
        reset({
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          phone: userData.phone,
          dni: userData.dni,
          addressCda: {
            street: userData.addressCda.street,
            streetNumber: userData.addressCda.streetNumber,
            crossStreets: userData.addressCda.crossStreets,
          },
          image: userData.image ? userData.image : "",
        });
        toast({
          description: "Cambios guardados con exito.",
        });
      }
    } catch (err: any) {
      const errorMsg = err.response.data.msg;
      setLoading(false);
      setErr(errorMsg);
      toast({
        variant: "destructive",
        description: "Error al guardar los cambios, intentar mas tarde.",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://fabebus-api-example.onrender.com/api/users/${id}`,
          {
            headers,
          }
        );
        setData(res.data.user);
        setStatusValue(res.data.user.status.toLowerCase());
        setAddressCapitalValue(res.data.addressCapital);
        const userData = res.data.user;
        reset({
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          phone: userData.phone,
          dni: userData.dni,
          addressCda: {
            street: userData.addressCda.street,
            streetNumber: userData.addressCda.streetNumber,
            crossStreets: userData.addressCda.crossStreets,
          },
          image: userData.image ? userData.image : "",
        });
      } catch (err) {
        setErr(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const userAddressInputs = [
    {
      id: "street",
      icon: (
        <Milestone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
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
        <Milestone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
      ),
      label: "Número",
      type: "text",
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
        <Crop className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
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
    <section className="flex flex-col gap-3">
      <div className="self-start">
        <BackButton linkTo="/users" />
      </div>
      <SectionTitle>Información del usuario:</SectionTitle>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3">
            <UserInfo userData={data} />

            <Dialog>
              <div className="relative w-full max-w-sm mx-auto after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/20 dark:after:shadow-highlight dark:after:shadow-blue-lagoon-100/20 after:transition focus-within:after:shadow-blue-lagoon-200 dark:focus-within:after:shadow-blue-lagoon-200 lg:h-8 lg:w-[9rem]">
                <DialogTrigger asChild>
                  <Button className="relative w-full bg-[#9e4a4f] text-slate-100 hover:text-white dark:shadow-input dark:shadow-black/5 max-w-sm dark:text-slate-100 dark:hover:text-white dark:bg-[#9e4a4f] lg:h-8 lg:w-[9rem]">
                    Editar
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center lg:text-2xl">
                    Editar perfil
                  </DialogTitle>
                  <DialogDescription className="text-center lg:text-lg">
                    Hace cambios en el perfil del usuario.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col items-center gap-5">
                  <div className="w-full flex flex-col items-center gap-5">
                    <form
                      onSubmit={handleSubmit(handleOnSubmit)}
                      className="w-full flex flex-col items-center gap-3"
                    >
                      <div className="relative flex flex-col items-center mb-2 lg:px-6">
                        <Avatar className="w-32 h-32">
                          <AvatarImage
                            className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                            src={
                              image instanceof File
                                ? URL.createObjectURL(image)
                                : data.image
                            }
                            alt="avatar"
                          />
                          <AvatarFallback>
                            <User className="w-12 h-12 dark:text-blue-lagoon-100" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="absolute -bottom-1">
                          <Label
                            htmlFor="image"
                            className="flex items-center gap-1 cursor-pointer h-7 px-3 py-2 rounded-lg shadow-sm shadow-blue-lagoon-900/30 border bg-card dark:text-blue-lagoon-100 dark:hover:border-zinc-300"
                          >
                            <Upload className="w-4 h-4 text-accent " />
                            Subir{" "}
                          </Label>
                          <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            className="hidden"
                            {...register("image", {
                              onChange: (e) => {
                                const file = e.target.files[0];
                                if (file instanceof File) {
                                  setImage(file);
                                } else {
                                  console.error("Invalid file type");
                                }
                              },
                            })}
                          />
                          {errors.image && (
                            <p className="text-red-600">
                              {errors.image.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="relative w-full flex flex-col items-center gap-3 lg:max-w-2xl">
                        <div className="absolute left-0 -top-12 flex flex-col gap-1">
                          <p className="text-sm">Estado de la cuenta:</p>
                          <Select
                            value={statusValue.toLowerCase()}
                            onValueChange={(v: any) => setStatusValue(v)}
                          >
                            <div
                              className="relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
                            >
                              <SelectTrigger className="w-[180px] z-50">
                                <SelectValue
                                  placeholder={
                                    statusValue.toLowerCase() === "active"
                                      ? "Activo"
                                      : "Pendiente"
                                  }
                                />
                              </SelectTrigger>
                            </div>
                            <SelectContent>
                              <SelectItem value="active">Activa</SelectItem>
                              <SelectItem value="pending">Pendiente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full flex flex-col items-center">
                          <div className="my-3 w-full flex flex-col items-center">
                            <Separator className="w-8 my-2 bg-border-color dark:bg-border-color-dark" />
                            <h5 className="text-center w-full font-medium dark:text-white lg:text-start lg:text-xl">
                              Datos personales
                            </h5>
                          </div>

                          <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-3 lg:max-w-5xl">
                            <div className="flex w-full flex-col items-center gap-3 lg:flex-row lg:gap-2">
                              <div className="grid w-full items-center gap-2 mt-4 lg:mt-0">
                                <Label htmlFor="username">
                                  Nombre de usuario
                                </Label>
                                <div className="relative flex items-center">
                                  <span className="z-30 absolute text-accent left-[11px] pb-[2px] select-none ">
                                    @
                                  </span>
                                  <Input
                                    type="text"
                                    id="username"
                                    placeholder="ej. juanperez98"
                                    className="pl-[30px]"
                                    {...register("username", {
                                      required: {
                                        value: true,
                                        message:
                                          "Por favor, ingresa tu nombre de usuario.",
                                      },
                                      minLength: {
                                        value: 3,
                                        message:
                                          "Nombre de usuario no puede ser tan corto.",
                                      },
                                      maxLength: {
                                        value: 15,
                                        message:
                                          "Nombre de usuario no puede ser tan largo.",
                                      },
                                    })}
                                  />
                                </div>
                                {errors.username && (
                                  <p className="text-red-600">
                                    {errors.username.message}
                                  </p>
                                )}
                              </div>
                              <div className="grid w-full items-center gap-2">
                                <Label htmlFor="fullName">
                                  Nombre completo
                                </Label>
                                <div className="relative flex items-center">
                                  <User className="z-30 h-5 w-5 text-accent absolute left-[10px] pb-[2px] " />
                                  <Input
                                    type="text"
                                    id="fullName"
                                    className="pl-[32px]"
                                    {...register("fullName", {
                                      required: {
                                        value: true,
                                        message:
                                          "Por favor, ingresa tu nombre y apellido.",
                                      },
                                      minLength: {
                                        value: 3,
                                        message:
                                          "Nombre y apellido no puede ser tan corto.",
                                      },
                                      maxLength: {
                                        value: 25,
                                        message:
                                          "Nombre y apellido no puede ser tan largo.",
                                      },
                                    })}
                                  />
                                </div>
                                {errors.fullName && (
                                  <p className="text-red-600">
                                    {errors.fullName.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex w-full flex-col items-center gap-3 lg:flex-row lg:gap-2">
                              <div className="grid w-full items-center gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative flex items-center">
                                  <Mail className="z-30 top-[11px] h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                                  <Input
                                    className="pl-[32px]"
                                    type="email"
                                    id="email"
                                    {...register("email", {
                                      required: {
                                        value: true,
                                        message: "Por favor, ingresa tu email.",
                                      },
                                      minLength: {
                                        value: 3,
                                        message:
                                          "Email no puede ser tan corto.",
                                      },
                                      maxLength: {
                                        value: 40,
                                        message:
                                          "Email no puede ser tan largo.",
                                      },
                                    })}
                                  />
                                </div>

                                {errors.email && (
                                  <p className="text-red-600">
                                    {errors.email.message}
                                  </p>
                                )}
                              </div>
                              <div className="grid w-full items-center gap-2">
                                <Label htmlFor="tel">Celular</Label>
                                <div className="relative flex items-center">
                                  <Phone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                                  <Input
                                    className="pl-[32px]"
                                    type="tel"
                                    id="phone"
                                    {...register("phone", {
                                      required: {
                                        value: true,
                                        message:
                                          "Por favor, ingresa tu número celular.",
                                      },
                                      minLength: {
                                        value: 3,
                                        message:
                                          "Número celular no puede ser tan corto.",
                                      },
                                      maxLength: {
                                        value: 25,
                                        message:
                                          "Número celular no puede ser tan largo.",
                                      },
                                      pattern: {
                                        value: /^[0-9]+$/,
                                        message:
                                          "Número celular debe incluir solo números.",
                                      },
                                    })}
                                  />
                                </div>
                                {errors.phone && (
                                  <p className="text-red-600">
                                    {errors.phone.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex w-full flex-col items-center gap-3">
                              <div className="grid w-full items-center gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <div className="relative flex items-center">
                                  <Fingerprint className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                                  <Input
                                    type="number"
                                    id="dni"
                                    className="appearance-none pl-[32px]"
                                    {...register("dni", {
                                      required: {
                                        value: true,
                                        message: "Por favor, ingresa tu DNI.",
                                      },
                                      minLength: {
                                        value: 3,
                                        message: "DNI no puede ser tan corto.",
                                      },
                                      maxLength: {
                                        value: 25,
                                        message: "DNI no puede ser tan largo.",
                                      },
                                      pattern: {
                                        value: /^[0-9]+$/,
                                        message:
                                          "DNI debe incluir solo números.",
                                      },
                                    })}
                                  />
                                </div>
                                {errors.dni && (
                                  <p className="text-red-600">
                                    {errors.dni.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex flex-col items-center gap-3">
                          <div className="w-full flex flex-col items-center">
                            <Separator className="w-8 my-2 bg-border-color dark:bg-border-color-dark" />
                            <h5 className="text-center w-full font-medium dark:text-white lg:text-start lg:text-xl">
                              Domicilios
                            </h5>
                          </div>

                          <div className="w-full max-w-xs flex flex-col items-center gap-2 lg:max-w-5xl lg:flex-row lg:items-start">
                            <div className="w-full flex flex-col gap-2">
                              <h6 className="font-serif text-accent ">
                                Carmen de Areco
                              </h6>
                              {userAddressInputs.map((input: UserInput) => {
                                const key = input.id;
                                const fieldName: any = `addressCda.${key}`;
                                return (
                                  <div
                                    key={input.id}
                                    className="grid w-full items-center gap-2"
                                  >
                                    <Label htmlFor={input.id}>
                                      {input.label}
                                    </Label>
                                    <div className="relative flex items-center">
                                      {input.icon}
                                      <Input
                                        type={input.type}
                                        id={input.id}
                                        placeholder={input.placeholder}
                                        className="pl-[32px]"
                                        {...register(
                                          fieldName,
                                          input.validation
                                        )}
                                      />
                                      {errors[
                                        input.id as keyof typeof errors
                                      ] && (
                                        <p className="text-red-600">
                                          {
                                            errors[
                                              input.id as keyof typeof errors
                                            ]?.message
                                          }
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <Separator className="w-8 my-2 bg-border-color md:hidden dark:bg-border-color-dark" />

                            <div className="w-full flex flex-col gap-2">
                              <h6 className="font-serif text-accent ">
                                Capital Federal
                              </h6>
                              <div className="grid w-full items-center gap-2">
                                <Label htmlFor="addressCapital">
                                  Dirección
                                </Label>
                                <div className="w-full">
                                  <AddressAutocomplete
                                    value={addressCapitalValue}
                                    setValue={setAddressCapitalValue}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {err && (
                          <p className="text-red-600 self-start">{err}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <div className="w-full max-w-xs lg:w-[10rem]">
                          <DefaultButton>Guardar cambios</DefaultButton>
                        </div>
                      </DialogFooter>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-xl uppercase dark:text-white lg:text-2xl">
              Próximos viajes del usuario:
            </h3>
            {data.myTrips && data.myTrips.length > 0 ? (
              <MyTripsDatatable
                userTrips={data.myTrips}
                userData={data}
                columns={tripColumns}
              />
            ) : (
              <div className="mx-auto flex flex-col items-center gap-3">
                <p>Usuario no tiene viajes reservados.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SingleUser;
