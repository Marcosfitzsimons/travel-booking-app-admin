import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import { useToast } from "../hooks/ui/use-toast";
import BackButton from "../components/BackButton";
import SectionTitle from "../components/SectionTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../assets/fabebus-logo.jpg";
import { Button } from "@/components/ui/button";
import { Check, Download, Image, Loader2, Upload, User, X } from "lucide-react";
import { convertToArgentineTimezone } from "@/lib/utils/convertToArgentineTimezone";
import { PublicationFormData } from "@/types/types";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DefaultButton from "@/components/DefaultButton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { publicationInputs } from "@/formSource";
import { Input } from "@/components/ui/input";
import axios from "@/api/axios";
import Error from "@/components/Error";
import GorgeousBoxBorder from "@/components/GorgeousBoxBorder";
import GorgeousBorder from "@/components/GorgeousBorder";

const INITIAL_STATES = {
  _id: "",
  title: "",
  subtitle: "",
  description: "",
  createdAt: "",
  updatedAt: "",
  image: "",
};

const SinglePublication = () => {
  const [data, setData] = useState(INITIAL_STATES);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [err, setErr] = useState(false);

  const { title, subtitle, description, createdAt, image: imageDB } = data;

  let { id } = useParams();

  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const { datePart, timePart } = convertToArgentineTimezone(createdAt);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
    },
  });

  const handleOnSubmit = async (data: PublicationFormData) => {
    if (
      !isDirty &&
      (!image || (typeof image === "string" && image === imageDB))
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
          Editando publicación...
        </div>
      ),
    });
    try {
      let userDataToUpdate = {
        ...data,
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
          image: uploadRes.data.secure_url,
        };
      }

      const res = await axiosPrivate.put(`/publications/${id}`, {
        ...userDataToUpdate,
      });
      setData(res.data);
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
            editar publicación
          </div>
        ) as any,
        description: errorMsg
          ? errorMsg
          : "Ha ocurrido un error al editar publicación. Por favor, intentar más tarde",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/publications/${id}`);
        setData(res.data);
        const publicationData = res.data;
        setLoading(false);
        reset({
          title: publicationData.title,
          subtitle: publicationData.subtitle ? publicationData.subtitle : "",
          description: publicationData.description
            ? publicationData.description
            : "",
        });
        setImage(publicationData.image ? publicationData.image : "");
      } catch (err: any) {
        if (err.response?.status === 403) {
          setAuth({ user: null });
          setTimeout(() => {
            navigate("/login");
          }, 100);
        }
        const errorMsg = err.response?.data?.msg;
        setLoading(false);
        setError(true);
        toast({
          variant: "destructive",
          title: (
            <div className="flex gap-1">
              {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
              cargar información
            </div>
          ) as any,
          description: errorMsg
            ? errorMsg
            : "Ha ocurrido un error al obtener información de la publicación. Por favor, intentar más tarde",
        });
      }
    };
    fetchData();
  }, []);

  const downloadImage = () => {
    saveAs(image, "fabebus-img.jpg");
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setImage(file);
    } else {
      console.error("Invalid file type");
    }
  };

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="self-start">
        <BackButton linkTo="/publications" />
      </div>
      <div className="flex flex-col gap-3">
        <SectionTitle>Vista previa de la publicación</SectionTitle>
      </div>
      {error ? (
        <Error />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
            <GorgeousBoxBorder className="pb-6 self-center w-full max-w-[600px] ">
              <article className="w-full flex justify-center items-center relative mx-auto shadow-md max-w-[600px] bg-card shadow-input rounded-lg border px-2 py-3 dark:shadow-none">
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
                >
                  <div className="lg:self-end">
                    <div className="flex items-center absolute right-3 top-3 after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 after:transition focus-within:after:shadow-slate-400 dark:after:shadow-highlight dark:after:shadow-zinc-500/50 dark:focus-within:after:shadow-slate-100 dark:hover:text-white">
                      <DialogTrigger asChild>
                        <Button className="h-8 py-2 px-3 outline-none inline-flex items-center justify-center text-sm font-medium transition-colors rounded-lg shadow-input bg-card border border-slate-800/20 hover:bg-white dark:text-neutral-200 dark:border-slate-800 dark:hover:bg-black dark:shadow-none dark:hover:text-white">
                          Editar
                        </Button>
                      </DialogTrigger>
                    </div>
                  </div>
                  <DialogContent
                    className="relative pb-10"
                    onOpenAutoFocus={(e) => e.preventDefault}
                  >
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
                        Editar publicación
                      </DialogTitle>
                      <DialogDescription className="text-center lg:text-lg">
                        Hace cambios en la publicación
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex flex-col items-center gap-5">
                      <form
                        onSubmit={handleSubmit(handleOnSubmit)}
                        className="w-full flex flex-col items-center gap-3"
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
                              <div className="relative flex flex-col items-center mb-2 lg:px-6">
                                <Avatar className="w-32 h-32 rounded-lg">
                                  <AvatarImage
                                    className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                                    src={
                                      image instanceof File
                                        ? URL.createObjectURL(image)
                                        : imageDB
                                    }
                                    alt="avatar"
                                  />
                                  <AvatarFallback className="rounded-lg">
                                    <Image className="w-12 h-12 dark:text-blue-lagoon-100" />
                                  </AvatarFallback>
                                </Avatar>

                                <div className="absolute -bottom-1">
                                  <Label
                                    htmlFor="image"
                                    className="flex items-center gap-1 cursor-pointer h-7 px-3 py-2 rounded-lg shadow-sm shadow-blue-lagoon-900/30 border bg-card dark:text-blue-lagoon-100 dark:hover:border-zinc-300"
                                  >
                                    <Upload className="w-4 h-4 text-accent shrink-0" />
                                    {imageDB ? "Editar" : "Subir"}
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
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              {publicationInputs.map((input) => (
                                <div
                                  key={input.id}
                                  className="grid w-full items-center gap-2"
                                >
                                  <Label htmlFor={input.id}>
                                    {input.label}
                                  </Label>
                                  <Input
                                    type={input.type}
                                    id={input.id}
                                    {...register(
                                      input.id as any,
                                      input.validation
                                    )}
                                  />
                                  {errors[input.id as keyof typeof errors] && (
                                    <p className="text-red-600">
                                      {
                                        errors[input.id as keyof typeof errors]
                                          ?.message
                                      }
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid w-full items-center gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <GorgeousBorder>
                              <Textarea {...register("description")} />
                            </GorgeousBorder>
                          </div>
                          <DialogFooter>
                            <div className="w-full mt-2 lg:w-[14rem]">
                              <DefaultButton loading={loading}>
                                {loading ? "Editando..." : "Editar publicación"}
                              </DefaultButton>
                            </div>
                          </DialogFooter>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="py-12 px-2 flex flex-col gap-6 sm:max-w-[600px] sm:px-4">
                  <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
                    <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                    <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                    <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                  </div>
                  <div className="absolute bottom-[0.75rem] right-2.5 sm:right-4 flex flex-col rotate-180 gap-[3px]">
                    <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                    <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                    <span className="w-2 h-[4px] bg-red-700 rounded-full " />
                  </div>
                  <div className="relative">
                    <p className="absolute right-0 top-0 text-sm">
                      {datePart}
                      <span className="text-[#737373] text-xs font-extralight dark:text-slate-500">
                        {timePart}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={logo}
                          alt="fabebus"
                          className="border rounded-full"
                        />
                        <AvatarFallback>Fabebus</AvatarFallback>
                      </Avatar>
                      <p className="text-black font-medium dark:text-white">
                        Fabebus
                      </p>
                    </div>

                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      {title}
                    </h3>
                    {subtitle && (
                      <h4 className="text-muted-foreground">{subtitle}</h4>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-card-foreground">{description}</p>
                    {imageDB && (
                      <div className="relative flex flex-col">
                        <img src={imageDB} alt="imagen adjunta" />
                        <div className="flex items-center absolute bottom-2 right-2 after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-200/20 after:transition focus-within:after:shadow-slate-400 dark:after:shadow-highlight dark:after:shadow-zinc-500/50 dark:focus-within:after:shadow-slate-100 dark:hover:text-white">
                          <Button
                            onClick={downloadImage}
                            className="h-8 py-2 px-3 outline-none inline-flex items-center gap-1 justify-center text-sm font-medium transition-colors rounded-lg shadow-input bg-card border border-slate-800/20 hover:bg-white dark:text-neutral-200 dark:border-slate-800 dark:hover:bg-black dark:shadow-none dark:hover:text-white"
                          >
                            Descargar
                            <Download className="w-[14px] h-[14px] cursor-pointer" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </GorgeousBoxBorder>
          )}
        </>
      )}
    </section>
  );
};

export default SinglePublication;
