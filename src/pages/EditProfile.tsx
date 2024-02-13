import { useEffect, useState } from "react";
import { Check, Loader2, Upload, User, UserCog, X } from "lucide-react";
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
import Error from "@/components/Error";
import axios from "@/api/axios";

type UserData = {
  username: string | undefined;
  email: string | undefined;
  image?: string | undefined;
};

const INITIAL_VALUES = {
  username: "",
  email: "",
  image: "",
};

const EditProfile = () => {
  const [userData, setUserData] = useState<UserData>(INITIAL_VALUES);
  const [image, setImage] = useState<File | string>("");
  const [isLoading, setIsLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  const { data, loading, error }: any = useFetch(`/users/${user?._id}`);

  console.log(userData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setImage(file);
    } else {
      console.error("Invalid file type");
    }
  };

  const handleOnSubmit = async (data: UserData) => {
    if (
      !isDirty &&
      (!image || (typeof image === "string" && image === userData.image))
    ) {
      return toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
            guardar cambios
          </div>
        ) as any,
        description: "Es necesario realizar cambios antes de enviar",
      });
    }
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Editando perfil...
        </div>
      ),
    });
    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");

    try {
      if (!image) {
        await axiosPrivate.put(`/users/${user?._id}`, {
          userData: { ...data },
        });
        setIsLoading(false);
        toast({
          description: (
            <div className="flex gap-1">
              {<Check className="h-5 w-5 text-green-600 shrink-0" />} Cambios
              guardados con éxito
            </div>
          ),
        });
        setTimeout(() => {
          navigate("/mi-perfil");
        }, 100);
      } else {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { secure_url } = uploadRes.data;

        await axiosPrivate.put(`/users/admin/${user?._id}`, {
          userData: { ...data, image: secure_url },
        });

        setIsLoading(false);
        toast({
          description: (
            <div className="flex gap-1">
              {<Check className="h-5 w-5 text-green-600 shrink-0" />} Cambios
              guardados con éxito
            </div>
          ),
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
      const errorMsg = err.response?.data?.msg;
      setIsLoading(false);
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

  useEffect(() => {
    setUserData({
      username: data?.user?.username,
      email: data?.user?.email,
      image: data?.user?.image,
    });
    reset({
      username: data?.user?.username,
      email: data?.user?.email,
    });
    setImage(data?.user?.image);
  }, [data]);

  return (
    <section className="flex flex-col gap-3">
      <div className="self-start">
        <BackButton linkTo="/mi-perfil" />
      </div>
      <SectionTitle>Editar perfil</SectionTitle>
      {error ? (
        <Error />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="w-full mt-5 mb-16 flex flex-col items-center gap-5">
              <div className="w-full flex flex-col items-center gap-5 md:w-8/12">
                <div className="w-full flex flex-col items-center gap-5 max-w-sm">
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
                    <div className="grid w-full max-w-sm items-center gap-2">
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

                    <div className="grid w-full max-w-sm items-center gap-2">
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
                    <div className="w-full flex justify-center max-w-sm lg:w-[10rem]">
                      <DefaultButton loading={isLoading}>
                        Guardar cambios
                      </DefaultButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default EditProfile;
