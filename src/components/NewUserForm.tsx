import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Crop,
  Fingerprint,
  Lock,
  Mail,
  MapPin,
  Milestone,
  Phone,
  User,
} from "lucide-react";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import { Upload } from "lucide-react";
import { userAddressInputs } from "../formSource";
import { Separator } from "./ui/separator";
import AddressAutocomplete from "./AddressAutocomplete";
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
  streetNumber: number | null;
  crossStreets: string;
};

type User = {
  username: string;
  fullName: string;
  email: string;
  phone: number | null;
  dni: number | null;
  image?: string;
  addressCda: addressCda;
  addressCapital: string;
  password: string;
};

type NewUserFormProps = {
  inputs: UserInput[];
};

const NewUserForm = ({ inputs }: NewUserFormProps) => {
  const [image, setImage] = useState<File | string>("");
  const [addressCapitalValue, setAddressCapitalValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<null | string>(null);

  let imageInput: UserInput = {
    id: "imageInput",
    label: "Subir",
    type: "file",
    icon: <Upload className="w-4 h-4" />,
    // check validation
  };

  const { toast } = useToast();
  const navigate = useNavigate();

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
      phone: null,
      dni: null,
      addressCda: {
        street: "",
        streetNumber: null,
        crossStreets: "",
      },
      addressCapital: "",
      imageInput: "",
    },
  });

  const handleOnSubmit = async (data: User) => {
    setIsLoading(true);
    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");
    try {
      if (!image) {
        const datasent = await axios.post(
          "https://fabebus-api-example.onrender.com/api/auth/register",
          {
            ...data,
            addressCapital: addressCapitalValue,
          }
        );
        console.log(datasent);
        setIsLoading(false);
        toast({
          description: "Usuario creado con éxito.",
        });
        navigate("/users");
      } else {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { url } = uploadRes.data;

        const datasent = await axios.post(
          "https://fabebus-api-example.onrender.com/api/auth/register",
          {
            ...data,
            image: url,
            addressCapital: addressCapitalValue,
          }
        );
        console.log(datasent);
        setIsLoading(false);
        toast({
          description: "Usuario creado con éxito.",
        });
        navigate("/users");
      }
      navigate("/users");
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.msg;
      setIsLoading(false);
      setErr(errorMsg);
      toast({
        description: "Error al crear usuario. Intentar más tarde.",
      });
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
                      <p className="text-red-600 text-sm">
                        {errors.addressCda.street.message}
                      </p>
                    )}
                  </div>
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
                    <p className="text-red-600 text-sm">
                      {errors.addressCda.streetNumber.message}
                    </p>
                  )}
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
                    <p className="text-red-600 text-sm">
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
