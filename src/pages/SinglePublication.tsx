import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import "moment/locale/es";
import axios from "axios";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import { useToast } from "../hooks/ui/use-toast";
import BackButton from "../components/BackButton";
import SectionTitle from "../components/SectionTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../assets/fabebus-logo.jpg";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { convertToArgentineTimezone } from "@/lib/utils/convertToArgentineTimezone";

type Publication = {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
};

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<unknown | boolean>(false);
  const [err, setErr] = useState<null | string>(null);

  const { title, subtitle, description, createdAt, image } = data;
  let { id } = useParams();
  const { toast } = useToast();

  moment.locale("es", {
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  });

  const { datePart, timePart } = convertToArgentineTimezone(createdAt);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    setLoading(true);

    // do the image upload stuff

    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
        }/publications/${id}`,
        { ...data },
        { headers }
      );
      setLoading(false);
      toast({
        description: "Cambios guardados con exito.",
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.response.data.msg;
      setLoading(false);
      setErr(errorMsg);
      toast({
        variant: "destructive",
        description: "Error al guardar los cambios, intentar mas tarde.",
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT
          }/publications/${id}`,
          {
            headers,
          }
        );
        setData(res.data);
        const publicationData = res.data;
        reset({
          title: publicationData.title,
          subtitle: publicationData.subtitle ? publicationData.subtitle : "",
          description: publicationData.description,
          image: publicationData.image ? publicationData.image : "",
          createdAt: publicationData.createdAt,
        });
      } catch (err: any) {
        setErr(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const downloadImage = () => {
    saveAs(image, "fabebus-img.jpg");
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="self-start">
        <BackButton linkTo="/publications" />
      </div>
      <div className="flex flex-col gap-3 mb-4">
        <SectionTitle>Vista previa de la publicación</SectionTitle>
        <p className="text-center lg:text-start">Así se verá en la página...</p>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="pb-6">
          <article className="w-full flex justify-center items-center relative mx-auto shadow-md max-w-[600px] bg-card shadow-input rounded-md border px-2 py-3 dark:shadow-none">
            <div className="py-12 flex flex-col gap-4 sm:max-w-[425px]">
              <div className="absolute top-[0.75rem] left-2.5 sm:left-4 flex flex-col gap-[3px] transition-transform ">
                <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                <span className="w-2 h-[4px] bg-red-700 rounded-full " />
              </div>
              <div className="absolute bottom-[0.75rem] right-2.5 sm:left-4 flex flex-col rotate-180 gap-[3px] transition-transform ">
                <span className="w-8 h-[4px] bg-red-700 rounded-full " />
                <span className="w-4 h-[4px] bg-red-700 rounded-full " />
                <span className="w-2 h-[4px] bg-red-700 rounded-full " />
              </div>
              <div className="relative">
                <p className="absolute right-0 top-0 text-sm lg:right-4">
                  {datePart}
                  <span className="text-[#737373] text-xs font-extralight dark:text-slate-500 ">
                    {timePart}
                  </span>
                </p>
                <div className="flex items-center gap-2 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={logo}
                      alt="fabebus"
                      className="border border-border-color rounded-full"
                    />
                    <AvatarFallback>Fabebus</AvatarFallback>
                  </Avatar>
                  <p className="text-black font-medium dark:text-white">
                    Fabebus
                  </p>
                </div>

                <h3>{title}</h3>
                {subtitle && <h4 className="">{subtitle}</h4>}
              </div>
              <div className="flex flex-col gap-4">
                {image && (
                  <div className="relative flex flex-col">
                    <img src={image} alt="imagen adjunta" />
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
                <p className="text-card-foreground">{description}</p>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
};

export default SinglePublication;
