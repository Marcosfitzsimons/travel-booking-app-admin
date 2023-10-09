import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import { Check, Image, Loader2, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PublicationFormData } from "@/types/types";
import { NewPublicationFormProps } from "@/types/props";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axios from "@/api/axios";
import GorgeousBorder from "./GorgeousBorder";

const NewTripForm = ({ inputs }: NewPublicationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | string>("");

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
      title: "",
      subtitle: "",
      description: "",
      image: "",
    },
  });

  const handleOnSubmit = async (data: PublicationFormData) => {
    setIsLoading(true);
    toast({
      variant: "loading",
      description: (
        <div className="flex gap-1">
          <Loader2 className="h-5 w-5 animate-spin text-purple-900 shrink-0" />
          Creando publicación...
        </div>
      ),
    });
    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");
    try {
      if (!image) {
        await axiosPrivate.post(`/publications`, {
          ...data,
        });
        setIsLoading(false);
        toast({
          description: (
            <div className="flex gap-1">
              {<Check className="h-5 w-5 text-green-600 shrink-0" />}{" "}
              Publicación ha sido creada con éxito
            </div>
          ),
        });
        navigate("/publications");
      } else {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { url } = uploadRes.data;

        await axiosPrivate.post(`/publications`, {
          ...data,
          image: url,
        });
        setIsLoading(false);
        toast({
          description: (
            <div className="flex gap-1">
              {<Check className="h-5 w-5 text-green-600 shrink-0" />}{" "}
              Publicación ha sido creada con éxito
            </div>
          ),
        });
        navigate("/publications");
      }
      navigate("/publications");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setIsLoading(false);
      const errorMsg = err.response?.data?.msg;
      toast({
        variant: "destructive",
        title: (
          <div className="flex gap-1">
            {<X className="h-5 w-5 text-destructive shrink-0" />} Error al crear
            publicación
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al crear publicación. Por favor, intentar más tarde",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="relative w-full flex flex-col gap-3 py-6 lg:pb-3"
    >
      <div className="w-full flex flex-col gap-4 items-center">
        <div className="w-full flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-2">
            <div className="grid w-full items-center gap-2">
              <label
                htmlFor="image"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Imagen
              </label>
            </div>
            <div className="self-start relative flex justify-center">
              <Avatar className="w-44 h-24 rounded-lg">
                <AvatarImage
                  className=" origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                  src={image instanceof File ? URL.createObjectURL(image) : ""}
                  alt="avatar"
                />
                {image instanceof File ? (
                  ""
                ) : (
                  <div
                    className="w-full relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
        after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
                  >
                    <AvatarFallback className="rounded-lg">
                      <Image className="w-12 h-12" />
                    </AvatarFallback>
                  </div>
                )}
              </Avatar>

              <div className="self-center absolute -bottom-1">
                <div
                  className="w-full relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
                >
                  <Label
                    htmlFor="image"
                    className="flex items-center gap-1 cursor-pointer h-7 px-3 py-2 rounded-lg text-sm bg-card border border-slate-800/20 shadow-input placeholder:text-neutral-500 dark:placeholder:text-pink-1-100/70 dark:bg-[hsl(0,0%,11%)] dark:border-slate-800 dark:text-white dark:shadow-none !outline-none"
                  >
                    <Upload className="w-4 h-4 text-accent " />
                    Subir
                  </Label>
                </div>
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
          </div>
          <div className="w-full flex flex-col gap-2">
            {inputs.map((input) => (
              <div key={input.id} className="grid w-full items-center gap-2">
                <Label htmlFor={input.id}>{input.label}</Label>
                <Input
                  type={input.type}
                  id={input.id}
                  {...register(input.id, input.validation)}
                />
                {errors[input.id as keyof typeof errors] && (
                  <p className="text-red-600">
                    {errors[input.id as keyof typeof errors]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="description">Descripción</Label>
          <GorgeousBorder>
            <Textarea id="description" />
          </GorgeousBorder>
        </div>
        <div className="w-full mt-2 lg:w-[10rem] lg:self-end">
          <DefaultButton loading={isLoading}>
            {isLoading ? "Creando..." : "Crear publicación"}
          </DefaultButton>
        </div>
      </div>
    </form>
  );
};

export default NewTripForm;
