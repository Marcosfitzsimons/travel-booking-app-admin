import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/ui/use-toast";
import DefaultButton from "./DefaultButton";
import { Image, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Publication = {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
};

interface InputValidation {
  required: {
    value: boolean;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
}

interface PublicationInput {
  id: any;
  label: string;
  type: string;
  name: any;
  placeholder?: string;
  validation?: InputValidation;
}

type NewPublicationFormProps = {
  inputs: PublicationInput[];
};

const NewTripForm = ({ inputs }: NewPublicationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | string>("");
  const [err, setErr] = useState<null | string>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      createdAt: "",
      image: "",
    },
  });

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleOnSubmit = async (data: Publication) => {
    setIsLoading(true);
    const imgData = new FormData();
    imgData.append("file", image);
    imgData.append("upload_preset", "upload");
    try {
      if (!image) {
        const datasent = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/publications`,
          {
            ...data,
          },
          { headers }
        );
        console.log(datasent);
        setIsLoading(false);
        toast({
          description: "Publicación creada con éxito.",
        });
        navigate("/publications");
      } else {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dioqjddko/image/upload",
          imgData
        );
        const { url } = uploadRes.data;

        const datasent = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/publications`,
          {
            ...data,
            image: url,
          },
          { headers }
        );
        console.log(datasent);
        setIsLoading(false);
        toast({
          description: "Publicación creada con éxito.",
        });
        navigate("/publications");
      }
      navigate("/users");
    } catch (err: any) {
      console.log(err);
      const errorMsg = err.response.data.err.message;
      console.log(errorMsg);
      setIsLoading(false);
      setErr(errorMsg);
      toast({
        description: "Error al crear publicación. Intentar más tarde.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="relative w-full flex flex-col gap-3 py-6"
    >
      <div className="w-full flex flex-col gap-2 items-center">
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
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="description">Descripción</Label>
          <div
            className="w-full relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
          >
            <Textarea id="description" />
          </div>
        </div>
        <div className="grid w-full items-center gap-2">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Imagen
          </p>
        </div>
        <div className="self-start relative flex justify-center">
          <Avatar className="w-44 h-24 rounded-lg">
            <AvatarImage
              className=" origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
              src={image instanceof File ? URL.createObjectURL(image) : ""}
              alt="avatar"
            />
            <div
              className="w-full relative before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[12px] before:border before:border-pink-1-800/50 before:ring-2 before:ring-slate-400/10 before:transition
          after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 focus-within:after:shadow-pink-1-700/30 after:transition dark:focus-within:after:shadow-pink-1-300/40 dark:before:ring-slate-800/60 dark:before:border-pink-1-300"
            >
              <AvatarFallback className="rounded-lg">
                <Image className="w-12 h-12" />
              </AvatarFallback>
            </div>
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

        <div className="w-full mt-2 lg:w-[10rem] ">
          <DefaultButton>Crear publicación</DefaultButton>
        </div>
      </div>
    </form>
  );
};

export default NewTripForm;
