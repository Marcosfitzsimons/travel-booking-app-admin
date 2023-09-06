import { useEffect, useState } from "react";
import { Upload, User, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import SectionTitle from "../components/SectionTitle";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "../components/DefaultButton";
import BackButton from "../components/BackButton";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";

type UserData = {
  username: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
  phone: number | undefined;
  image?: string | undefined;
};

const INITIAL_VALUES = {
  username: "",
  fullName: "",
  email: "",
  phone: undefined,
  image: "",
};

const EditProfile = () => {
  const [userData, setUserData] = useState<any>(INITIAL_VALUES);
  const [image, setImage] = useState<File | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  const { data, loading, error } = useFetch(`/users/${user?._id}`);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      image: userData.image,
    },
  });

  const handleOnSubmit = async (data: UserData) => {
    if (!isDirty) {
      return toast({
        variant: "destructive",
        description: "Es necesario realizar cambios antes de enviar",
      });
    }
    setIsLoading(true);
    setErr(false);
    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");

    try {
      if (!image) {
        await axiosPrivate.put(`/users/${user?._id}`, {
          userData: { ...data },
        });
        setIsLoading(false);
        setErr(false);
        toast({
          description: "Cambios guardados con éxito.",
        });
        setTimeout(() => {
          navigate("/mi-perfil");
        }, 100);
      } else {
        const uploadRes = await axiosPrivate.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { url } = uploadRes.data;

        await axiosPrivate.put(`/users/${user?._id}`, {
          userData: { ...data, image: url },
        });
        setIsLoading(false);
        toast({
          description: "Cambios guardados con éxito.",
        });
        setTimeout(() => {
          navigate("/mi-perfil");
        }, 100);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response.data.msg;
      setIsLoading(false);
      setErr(true);
      toast({
        variant: "destructive",
        description: errorMsg
          ? errorMsg
          : "Error al editar perfil, intente más tarde.",
      });
    }
  };

  useEffect(() => {
    setUserData(data);
  }, [data]);

  return (
    <section className="">
      <SectionTitle>
        <UserCog className="w-6 h-6 text-accent sm:h-7 sm:w-7" />
        Editar perfil
      </SectionTitle>
      {loading ? (
        <Loading />
      ) : (
        <div className="">
          <div className="w-full mt-5 mb-16 flex flex-col items-center gap-5">
            <div className="self-start">
              <BackButton linkTo="/mi-perfil" />
            </div>
            {error && (
              <p className="text-red-600">
                Error al obtener información, intentar más tarde.
              </p>
            )}
            <div className="w-full flex flex-col items-center gap-5 md:w-8/12">
              <div className="w-full flex flex-col items-center gap-5 md:max-w-sm">
                <form
                  onSubmit={handleSubmit(handleOnSubmit)}
                  className="w-full flex flex-col items-center gap-3"
                >
                  <div className="relative flex flex-col items-center">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                        src={
                          image instanceof File
                            ? URL.createObjectURL(image)
                            : user?.image
                        }
                        alt="avatar"
                      />
                      <AvatarFallback>
                        <User className="w-12 h-12 dark:text-slate-200" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute -bottom-1 ">
                      <Label
                        htmlFor="image"
                        className="flex items-center gap-1.5 cursor-pointer h-7 px-3 py-2 rounded-lg shadow-sm shadow-slate-200/40 border border-black/60 bg-secondary text-secondary-foreground hover:border-slate-100 dark:border-slate-600 dark:hover:border-slate-100"
                      >
                        Editar
                        <Upload className="w-4 h-4 text-secondary-foreground" />
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
                          {errors.image.message?.toString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full max-w-md items-center gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      {...register("username", {
                        required: {
                          value: true,
                          message: "Por favor, ingresa tu nombre de usuario.",
                        },
                        minLength: {
                          value: 3,
                          message: "Nombre de usuario debe ser mas corto.",
                        },
                        maxLength: {
                          value: 15,
                          message: "Nombre de usuario debe ser mas largo.",
                        },
                      })}
                    />
                    {errors.username && (
                      <p className="text-red-600">
                        {errors.username.message?.toString()}
                      </p>
                    )}
                  </div>
                  <div className="grid w-full max-w-md items-center gap-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      type="text"
                      id="fullName"
                      {...register("fullName", {
                        required: {
                          value: true,
                          message: "Por favor, ingresa tu nombre completo.",
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
                    {errors.fullName && (
                      <p className="text-red-600">
                        {errors.fullName.message?.toString()}
                      </p>
                    )}
                  </div>
                  <div className="grid w-full max-w-md items-center gap-2">
                    <Label htmlFor="tel">Celular</Label>
                    <Input
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
                    {errors.phone && (
                      <p className="text-red-600">
                        {errors.phone.message?.toString()}
                      </p>
                    )}
                  </div>
                  <div className="grid w-full max-w-md items-center gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
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
                    {errors.email && (
                      <p className="text-red-600">
                        {errors.email.message?.toString()}
                      </p>
                    )}
                  </div>
                  {err && <p className="text-red-600 self-start">{err}</p>}
                  <div className="w-full flex justify-center my-1 lg:w-[10rem]">
                    <DefaultButton loading={isLoading}>
                      Guardar cambios
                    </DefaultButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditProfile;
