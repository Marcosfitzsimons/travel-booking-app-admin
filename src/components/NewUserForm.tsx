import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Check,
  Crop,
  Fingerprint,
  Loader2,
  Lock,
  Mail,
  Milestone,
  Phone,
  User,
  X,
} from "lucide-react";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import { Upload } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";
import { UserFormData } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import axios from "@/api/axios";

const NewUserForm = () => {
  const [image, setImage] = useState<File | string>("");
  const [addressCapitalValue, setAddressCapitalValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<null | string>(null);

  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      fullName: "",
      password: "",
      cpassword: "",
      email: "",
      phone: undefined,
      dni: undefined,
      image: "",
      addressCda: {
        street: "",
        streetNumber: null,
        crossStreets: "",
      },
      addressCapital: "",
      imageInput: "",
    },
  });

  const handleOnSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Creando usuario...
        </div>
      ),
    });
    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");
    try {
      if (!image) {
        await axiosPrivate.post(`/auth/register`, {
          ...data,
          addressCapital: addressCapitalValue,
        });
        setIsLoading(false);
        toast({
          description: (
            <div className="flex gap-1">
              {<Check className="h-5 w-5 text-green-600 shrink-0" />} Usuario ha
              sido creado con éxito
            </div>
          ),
        });
        navigate("/users");
      } else {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { secure_url } = uploadRes.data;

        await axiosPrivate.post(`/auth/register`, {
          ...data,
          image: secure_url,
          addressCapital: addressCapitalValue,
        });
        setIsLoading(false);
        toast({
          description: (
            <div className="flex gap-1">
              {<Check className="h-5 w-5 text-green-600 shrink-0" />} Usuario ha
              sido creado con éxito
            </div>
          ),
        });
        navigate("/users");
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      if (err.response?.data?.err?.keyValue?.username) {
        setErr(
          `Nombre de usuario ${err.response?.data?.err?.keyValue?.username} ya está en uso`
        );
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
              crear cuenta
            </div>
          ) as any,
          description: "Nombre de usuario ya está en uso",
        });
      } else if (err.response?.data?.err?.keyValue?.email) {
        setErr(
          `Email ${err.response?.data?.err?.keyValue?.email} ya está en uso`
        );
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
              crear cuenta
            </div>
          ) as any,
          description: "Email ya está en uso",
        });
      } else {
        setErr(err.response?.data?.msg);
        toast({
          variant: "destructive",
          title: "Error al crear cuenta",
          description: err.response?.data?.msg
            ? err.response?.data?.msg
            : "Error , intente más tarde.",
        });
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<X className="h-5 w-5 text-destructive shrink-0" />} Error al al
              crear cuenta
            </div>
          ) as any,
          description:
            "Ha ocurrido un error al crear cuenta. Por favor, intentar más tarde",
        });
      }
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="relative w-full py-10 px-2 flex flex-col gap-5 items-center lg:px-4"
      >
        <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px]">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>
        <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px]">
          <span className="w-8 h-[4px] bg-red-700 rounded-full " />
          <span className="w-4 h-[4px] bg-red-700 rounded-full " />
          <span className="w-2 h-[4px] bg-red-700 rounded-full " />
        </div>

        <div className="relative flex flex-col items-center mb-2 lg:px-6">
          <Avatar className="w-32 h-32">
            <AvatarImage
              className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
              src={image instanceof File ? URL.createObjectURL(image) : ""}
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
              <p className="text-red-600">{errors.image.message}</p>
            )}
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2 lg:max-w-5xl">
          <div className="my-2 w-full flex flex-col items-center lg:mt-0">
            <h5 className="text-center w-full text-lg font-medium dark:text-white lg:mb-2 lg:text-start lg:text-xl">
              Datos personales
            </h5>
          </div>
          <div className="w-full flex flex-col gap-2 lg:flex-row">
            <div className="w-full flex flex-col gap-2">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <div className="relative flex items-center">
                  <User className="z-30 h-5 w-5 text-accent absolute left-[10px] pb-[2px] " />
                  <Input
                    type="text"
                    id="fullName"
                    className="pl-[32px]"
                    placeholder="Juan Pérez"
                    {...register("fullName", {
                      required: {
                        value: true,
                        message: "Por favor, ingresa tu nombre y apellido.",
                      },
                      minLength: {
                        value: 3,
                        message: "Nombre y apellido no puede ser tan corto.",
                      },
                      maxLength: {
                        value: 25,
                        message: "Nombre y apellido no puede ser tan largo.",
                      },
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <div className="relative flex items-center">
                  <span className="z-30 absolute text-accent left-[11px] pb-[2px] select-none ">
                    @
                  </span>
                  <Input
                    type="text"
                    id="username"
                    placeholder="juan00"
                    className="pl-[30px]"
                    {...register("username", {
                      required: {
                        value: true,
                        message: "Por favor, ingresa tu nombre de usuario.",
                      },
                      minLength: {
                        value: 3,
                        message: "Nombre de usuario no puede ser tan corto.",
                      },
                      maxLength: {
                        value: 15,
                        message: "Nombre de usuario no puede ser tan largo.",
                      },
                      pattern: {
                        value: /^(?=.*[0-9])[a-zA-Z0-9]{3,}$/,
                        message:
                          "El nombre de usuario debe tener al menos 3 caracteres y contener al menos un número.",
                      },
                    })}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative flex items-center">
                  <Lock className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                  <Input
                    className="pl-[32px]"
                    placeholder="..."
                    type="password"
                    id="password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Por favor, ingresa tu contraseña.",
                      },
                      minLength: {
                        value: 6,
                        message: "Contraseña no puede ser tan corta.",
                      },
                      maxLength: {
                        value: 20,
                        message: "Contraseña no puede ser tan larga.",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="cpassword">Confirmar contraseña</Label>
                <div className="relative flex items-center">
                  <Lock className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                  <Input
                    className="pl-[32px]"
                    placeholder="..."
                    type="password"
                    id="cpassword"
                    {...register("cpassword", {
                      required: {
                        value: true,
                        message: "Por favor, ingresa tu contraseña.",
                      },
                      minLength: {
                        value: 6,
                        message: "Contraseña no puede ser tan corta.",
                      },
                      maxLength: {
                        value: 20,
                        message: "Contraseña no puede ser tan larga.",
                      },
                    })}
                  />
                </div>
                {errors.cpassword && (
                  <p className="text-red-600 text-sm">
                    {errors.cpassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center">
                  <Mail className="z-30 top-[11px] h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                  <Input
                    className="pl-[32px]"
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    id="email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Por favor, ingresa tu email.",
                      },
                      minLength: {
                        value: 3,
                        message: "Email no puede ser tan corto.",
                      },
                      maxLength: {
                        value: 40,
                        message: "Email no puede ser tan largo.",
                      },
                    })}
                  />
                </div>

                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="dni">DNI</Label>
                <div className="relative flex items-center">
                  <Fingerprint className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                  <Input
                    type="number"
                    id="dni"
                    placeholder="41260122"
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
                        message: "DNI debe incluir solo números.",
                      },
                    })}
                  />
                </div>
                {errors.dni && (
                  <p className="text-red-600 text-sm">{errors.dni.message}</p>
                )}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="phone">Celular</Label>
                <div className="relative flex items-center">
                  <Phone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                  <Input
                    className="pl-[32px]"
                    placeholder="2273433870"
                    type="tel"
                    id="phone"
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "Por favor, ingresa tu número celular.",
                      },
                      minLength: {
                        value: 3,
                        message: "Número celular no puede ser tan corto.",
                      },
                      maxLength: {
                        value: 25,
                        message: "Número celular no puede ser tan largo.",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Número celular debe incluir solo números.",
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3 lg:max-w-5xl">
          <div className="w-full flex flex-col items-center">
            <h5 className="text-center w-full text-lg font-medium dark:text-white lg:text-start lg:text-xl">
              Domicilios
            </h5>
          </div>

          <div className="w-full flex flex-col gap-2 lg:max-w-5xl">
            <div className="w-full flex flex-col gap-2 lg:flex-row">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col gap-2">
                  <h6 className="font-serif text-accent ">Carmen de Areco</h6>
                </div>
                <div className="flex items-center gap-1">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="street">Calle</Label>
                    <div className="relative flex items-center">
                      <Milestone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                      <Input
                        type="text"
                        id="street"
                        className="pl-[32px]"
                        placeholder="Matheu"
                        {...register("addressCda.street", {
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
                        })}
                      />
                    </div>
                    {errors.addressCda?.street && (
                      <p className="text-red-600 text-xs sm:text-sm">
                        {errors.addressCda.street.message}
                      </p>
                    )}
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="streetNumber">Número</Label>
                    <div className="relative flex items-center">
                      <Milestone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                      <Input
                        type="number"
                        id="streetNumber"
                        className="pl-[32px]"
                        placeholder="522"
                        {...register("addressCda.streetNumber", {
                          required: {
                            value: true,
                            message: "Por favor, ingresar número de domicilio ",
                          },
                          minLength: {
                            value: 1,
                            message:
                              "Número de domicilio no puede ser tan corto.",
                          },
                          maxLength: {
                            value: 5,
                            message:
                              "Número de domicilio no puede ser tan largo.",
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Debe incluir solo números.",
                          },
                        })}
                      />
                    </div>
                    {errors.addressCda?.streetNumber && (
                      <p className="text-red-600 text-xs sm:text-sm">
                        {errors.addressCda.streetNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="crossStreets">Calles que cruzan</Label>
                  <div className="relative flex items-center">
                    <Crop className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] " />
                    <Input
                      type="text"
                      id="crossStreets"
                      className="pl-[32px]"
                      placeholder="Matheu y D. Romero"
                      {...register("addressCda.crossStreets", {
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
                          value: 45,
                          message: "No puede ser tan largo.",
                        },
                      })}
                    />
                  </div>
                  {errors.addressCda?.crossStreets && (
                    <p className="text-red-600 text-xs sm:text-sm">
                      {errors.addressCda.crossStreets.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <h6 className="font-serif text-accent">Capital Federal</h6>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="addressCapital">Dirección</Label>
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

          {err && <p className="text-red-600 self-start">{err}</p>}
          <div className="w-full mt-2 lg:max-w-[10rem] lg:self-center lg:justify-self-center lg:col-start-1 lg:col-end-3">
            <DefaultButton loading={isLoading}>
              {isLoading ? "Creando..." : "Crear usuario"}
            </DefaultButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
