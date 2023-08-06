import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import SectionTitle from "../components/SectionTitle";
import BackButton from "../components/BackButton";
import Loading from "../components/Loading";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Mail, MapPin, Phone, User, UserCog } from "lucide-react";
import DefaultButton from "../components/DefaultButton";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState<unknown | boolean>(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate("/mi-perfil/editar-perfil");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_ENDPOINT}/users/${
            user?._id
          }`,
          { headers }
        );
        setData(res.data.user);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="">
      <SectionTitle>
        <User className="w-6 h-6 text-accent sm:h-7 sm:w-7" />
        Mi perfil
      </SectionTitle>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="self-start my-4 mb-6">
              <BackButton linkTo="/" />
            </div>

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
