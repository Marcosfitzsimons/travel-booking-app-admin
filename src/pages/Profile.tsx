import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import Loading from "../components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ChevronsRight, Mail, Phone, User, X } from "lucide-react";
import DefaultButton from "../components/DefaultButton";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Breadcrumb from "@/components/Breadcrumb";
import Error from "@/components/Error";
import DataBox from "@/components/DataBox";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { toast } = useToast();

  const { auth, setAuth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosPrivate.get(`/users/${user?._id}`);
        setData(res.data.user);
        setLoading(false);
        setError(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.msg;
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
          title: (
            <div className="flex gap-1">
              {<X className="h-5 w-5 text-destructive shrink-0" />} Error al
              cargar información
            </div>
          ) as any,
          description: errorMsg
            ? errorMsg
            : "Ha ocurrido un error al cargar información acerca del viaje. Por favor, intentar más tarde",
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
      {error ? (
        <Error />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
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

              <ChangePasswordDialog userId={user?._id} />

              <div className="flex flex-col items-center gap-0">
                <h4 className="text-slate-500 dark:text-slate-400">
                  @{data?.username}
                </h4>
              </div>
              <ul className="flex flex-col w-full overflow-hidden gap-2 max-w-sm items-start p-4">
                <DataBox
                  text="Email"
                  icon={<Mail className="h-5 w-5 text-accent shrink-0" />}
                >
                  {data?.email}
                </DataBox>
              </ul>

              <div
                className="w-full flex justify-center max-w-sm lg:w-[9rem]"
                onClick={() => navigate("/mi-perfil/editar-perfil")}
              >
                <DefaultButton>Editar perfil</DefaultButton>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Profile;
