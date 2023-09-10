import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import BackButton from "../components/BackButton";
import Loading from "../components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ChevronsRight, Mail, Phone, User } from "lucide-react";
import DefaultButton from "../components/DefaultButton";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Breadcrumb from "@/components/Breadcrumb";

const INITIAL_STATES = {
  _id: "",
  email: "",
  fullName: "",
  myTrips: [],
  phone: undefined,
  image: "",
  username: "",
};

const Profile = () => {
  const [data, setData] = useState(INITIAL_STATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate("/mi-perfil/editar-perfil");
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);
      try {
        setLoading(false);
        setError(false);
        const res = await axiosPrivate.get(`/users/${user?._id}`);
        setData(res.data.user);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setAuth({ user: null });
          setTimeout(() => {
            navigate("/login");
          }, 100);
        }
        setLoading(false);
        setError(true);
        toast({
          variant: "destructive",
          description: err.response.data.msg
            ? err.response.data.msg
            : "Error al obtener información, intente más tarde.",
        });
      }
    };
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          Admin
          <ChevronsRight className="w-5 h-5" />
          Mi perfil
        </p>
      </Breadcrumb>
      <SectionTitle>
        <User className="w-6 h-6 text-accent sm:h-7 sm:w-7" />
        Mi perfil
      </SectionTitle>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {error && (
              <p className="text-red-600">
                Error al obtener información, intente más tarde.
              </p>
            )}
            <div className="w-full relative flex flex-col items-center gap-3 md:w-7/12 md:mx-auto">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  className="origin-center hover:origin-bottom hover:scale-105 transition-all duration-200 z-90 align-middle"
                  src={data?.image}
                  alt="avatar"
                />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center gap-0">
                <h3 className="font-medium text-xl dark:text-white">
                  {data?.fullName}
                </h3>
                <h4 className="text-slate-500 dark:text-slate-400">
                  @{data?.username}
                </h4>
              </div>
              <ul className="flex flex-col w-full overflow-hidden bg-card gap-2 max-w-sm border items-start p-4 shadow-inner rounded-md dark:bg-[#171717]">
                <li className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-accent " />
                  <span className="font-medium">Email:</span>
                  {data?.email}
                </li>
                <li className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-accent " />
                  <span className="font-medium">Celular:</span> {data?.phone}
                </li>
              </ul>

              <div
                className="w-full flex justify-center lg:w-[9rem]"
                onClick={goToEditProfile}
              >
                <DefaultButton>Editar perfil</DefaultButton>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Profile;
