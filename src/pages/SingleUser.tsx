import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Check,
  Fingerprint,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
  X,
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
  SelectItem,
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
import UserInfo from "../components/UserInfo";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { capitalizeWord } from "@/lib/utils/capitalizeWord";
import { UserInput, UserProfileData } from "@/types/types";
import { userAddressInputs } from "@/formSource";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import Error from "@/components/Error";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";

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
  status: "pending",
};

const SingleUser = () => {
  const [userData, setUserData] = useState(INITIAL_STATES);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [image, setImage] = useState<File | string>(userData.image ?? "");
  const [err, setErr] = useState(false);
  const [isEditStatus, setIsEditStatus] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [addressCapitalValue, setAddressCapitalValue] = useState(
    userData.addressCapital ?? ""
  );
  const [statusValue, setStatusValue] = useState<"pending" | "active">(
    "pending"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      dni: userData.dni,
      addressCda: {
        street: userData.addressCda.street,
        streetNumber: userData.addressCda.streetNumber,
        crossStreets: userData.addressCda.crossStreets,
      },
    },
  });

  let { id } = useParams();
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleIsActiveSubmit = async () => {
    if (
      (userData.status.toLowerCase() === "active" &&
        statusValue === "active") ||
      (userData.status.toLowerCase() === "pending" && statusValue === "pending")
    ) {
      setIsEditStatus(false);
      return toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            actualizar estado de la cuenta
          </div>
        ) as any,
        description:
          "Estado de la cuenta ya tiene ese valor. Debes cambiarlo para que se actualice",
      });
    }
    setLoading1(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Editando estado de la cuenta...
        </div>
      ),
    });
    try {
      const res = await axiosPrivate.put(`/users/${id}/status`, {
        userData: {
          status: capitalizeWord(statusValue),
        },
      });
      setStatusValue(res.data.userStatus.toLowerCase());
      setLoading1(false);
      setUserData((prev) => ({
        ...prev,
        status: res.data.userStatus.toLowerCase(),
      }));
      setIsEditStatus(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Estado de la
            cuenta se ha actualizado con éxito
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
      setIsEditStatus(false);
      setLoading1(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />}Error al
            guardar los cambios
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al guardar los cambios. Por favor, intentar más tarde",
      });
    }
  };

  const handleOnSubmit = async (data: UserProfileData) => {
    if (
      !isDirty &&
      addressCapitalValue === userData.addressCapital &&
      (!image || (typeof image === "string" && image === userData.image))
    ) {
      return toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />}Ha ocurrido un
            error
          </div>
        ) as any,
        description: "Es necesario realizar cambios antes de enviar",
      });
    }

    setLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Editando usuario...
        </div>
      ),
    });
    try {
      let userDataToUpdate = {
        ...data,
        addressCapital: addressCapitalValue,
      };

      if (image instanceof File) {
        const imgData = new FormData();
        imgData.append("file", image);
        imgData.append("upload_preset", "upload");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );

        userDataToUpdate = {
          ...userDataToUpdate,
          image: uploadRes.data.url,
        };
      }

      const res = await axiosPrivate.put(`/users/${id}`, {
        userData: userDataToUpdate,
      });

      setUserData(res.data.user);
      setLoading(false);
      setIsDialogOpen(false);
      toast({
        description: (
          <div className="flex gap-1">
            {<Check className="h-5 w-5 text-green-600 shrink-0" />} Cambios
            guardados con éxito
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
      setLoading(false);
      setErr(true);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            editar información
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al editar perfil. Por favor, intentar más tarde",
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/users/${id}`);

      const userData = res.data.user;
      setUserData(userData);
      setStatusValue(userData.status.toLowerCase());
      setAddressCapitalValue(userData.addressCapital);
      setImage(userData.image ? userData.image : "");
      reset({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        dni: userData.dni,
        addressCda: {
          street: userData.addressCda.street,
          streetNumber: userData.addressCda.streetNumber,
          crossStreets: userData.addressCda.crossStreets,
        },
      });
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setErr(true);
      setLoading(false);
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            cargar información
          </div>
        ) as any,
        description:
          "Ha ocurrido un error al obtener información del usuario. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setImage(file);
    } else {
      console.error("Invalid file type");
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="self-start">
        <BackButton linkTo="/users" />
      </div>
      <SectionTitle>Información del usuario</SectionTitle>
      {err ? (
        <Error />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-full flex flex-col items-center gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 lg:absolute lg:left-0 lg:z-50">
                    <GorgeousBoxBorder>
                      <div className="flex items-center gap-3 p-3 rounded-lg border bg-card shadow-md dark:shadow-none">
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-sm">Estado de la cuenta</p>
                          {statusValue === "active" ? (
                            <span className="rounded-md bg-green-600/30 border border-green-900 px-4 dark:bg-green-200/40 dark:border-green-900/60 dark:shadow-none">
                              Activa
                            </span>
                          ) : (
                            <span className="rounded-md bg-orange-700/70 text-white border border-orange-900/80 shadow-input px-4 dark:bg-orange-500/70 dark:border-orange-900/60 dark:shadow-none">
                              Pendiente
                            </span>
                          )}
                        </div>
                        <div className="self-end flex items-center relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 after:transition focus-within:after:shadow-slate-400 dark:after:shadow-highlight dark:after:shadow-zinc-500/50 dark:focus-within:after:shadow-slate-100 dark:hover:text-white">
                          <Button
                            onClick={() => setIsEditStatus((prev) => !prev)}
                            className="h-[30px] p-2 outline-none inline-flex items-center justify-center text-sm font-medium transition-colors rounded-lg shadow-input bg-card border border-slate-800/20 hover:bg-white dark:text-neutral-200 dark:border-slate-800 dark:hover:bg-black dark:shadow-none dark:hover:text-white"
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    </GorgeousBoxBorder>

                    {isEditStatus && (
                      <GorgeousBoxBorder>
                        <div className="relative shadow-md flex flex-col gap-2 py-3 pl-3 pr-8 rounded-lg animate-in bg-card border dark:shadow-none">
                          <X
                            onClick={() => setIsEditStatus(false)}
                            className="absolute right-1.5 top-1.5 text-card-foreground cursor-pointer w-4 h-4"
                          />
                          <Select
                            value={statusValue}
                            onValueChange={(v: any) => setStatusValue(v)}
                          >
                            <SelectTrigger className="px-2 h-8">
                              <SelectValue
                                placeholder={
                                  statusValue === "active"
                                    ? "Activo"
                                    : "Pendiente"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Activa</SelectItem>
                              <SelectItem value="pending">Pendiente</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="w-full self-end flex items-center relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 after:transition focus-within:after:shadow-slate-400 dark:after:shadow-highlight dark:after:shadow-zinc-500/50 dark:focus-within:after:shadow-slate-100 dark:hover:text-white">
                            <Button
                              onClick={handleIsActiveSubmit}
                              disabled={loading1}
                              className="w-full h-[30px] outline-none inline-flex items-center justify-center text-sm font-medium transition-colors rounded-lg shadow-input bg-card border border-slate-800/20 hover:bg-white dark:text-neutral-200 dark:border-slate-800 dark:hover:bg-black dark:shadow-none dark:hover:text-white"
                            >
                              Guardar cambios
                            </Button>
                          </div>
                        </div>
                      </GorgeousBoxBorder>
                    )}
                  </div>

                  <UserInfo userData={userData} />
                </div>

                <Dialog
                  open={isDialogOpen}
                  onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
                >
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
                                    : userData.image
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
                                <Upload className="w-4 h-4 text-accent shrink-0" />
                                Subir{" "}
                              </Label>
                              <Input
                                type="file"
                                id="image"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>

                          <div className="relative w-full flex flex-col items-center gap-3 lg:max-w-2xl">
                            <div className="w-full flex flex-col items-center">
                              <div className="my-3 w-full flex flex-col items-center">
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
                                      <span className="z-30 absolute text-accent left-[11px] pb-[2px] select-none">
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
                                      <User className="z-30 h-5 w-5 text-accent absolute left-[10px] pb-[2px] shrink-0" />
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
                                      <Mail className="z-30 top-[11px] h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] shrink-0" />
                                      <Input
                                        className="pl-[32px]"
                                        type="email"
                                        id="email"
                                        {...register("email", {
                                          required: {
                                            value: true,
                                            message:
                                              "Por favor, ingresa tu email.",
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
                                      <Phone className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] shrink-0" />
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
                                      <Fingerprint className="z-30 h-[18px] w-[18px] text-accent absolute left-[10px] pb-[2px] shrink-0" />
                                      <Input
                                        type="number"
                                        id="dni"
                                        className="appearance-none pl-[32px]"
                                        {...register("dni", {
                                          required: {
                                            value: true,
                                            message:
                                              "Por favor, ingresa tu DNI.",
                                          },
                                          minLength: {
                                            value: 3,
                                            message:
                                              "DNI no puede ser tan corto.",
                                          },
                                          maxLength: {
                                            value: 25,
                                            message:
                                              "DNI no puede ser tan largo.",
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
                              <p className="text-red-600 self-start">
                                Ha ocurrido un error. Intentar más tarde
                              </p>
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
                {userData.myTrips && userData.myTrips.length > 0 ? (
                  <MyTripsDatatable
                    userTrips={userData.myTrips}
                    columns={tripColumns}
                    userId={userData._id}
                  />
                ) : (
                  <div className="mx-auto flex flex-col items-center gap-3">
                    <p>Usuario no tiene viajes reservados.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default SingleUser;
