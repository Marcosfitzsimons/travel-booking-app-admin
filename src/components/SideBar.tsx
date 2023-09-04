import {
  User,
  Map,
  LogOut,
  Newspaper,
  GanttChartSquare,
  CalendarRange,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useLogout from "@/hooks/useLogOut";

const SideBar = () => {
  const { auth } = useAuth();
  const user = auth?.user;

  const logout = useLogout();

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  return !user ? (
    <div className=""></div>
  ) : (
    <div className="hidden flex-[1] h-screen lg:flex lg:flex-col lg:items-center lg:pl-10 lg:py-[160px]">
      <div className="rounded-md flex flex-col mx-auto w-[13.5rem] gap-5">
        <nav className="flex flex-col gap-3">
          <ul className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Listas
            </p>
            <li className="relative flex items-center gap-2">
              <Map className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/trips"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40 dark:hover:text-white "
              >
                Viajes semanales
              </Link>
            </li>
            <li className="relative flex items-center gap-2">
              <Map className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/special-trips"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40 dark:hover:text-white "
              >
                Viajes particulares
              </Link>
            </li>
            <li className="relative flex items-center gap-2">
              <Users className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/users"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40 dark:hover:text-white "
              >
                Usuarios
              </Link>
            </li>
            <li className="relative flex items-center gap-2">
              <Newspaper className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/publications"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40  dark:hover:text-white "
              >
                Publicaciones
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Ventas
            </p>
            <li className="relative flex items-center gap-2">
              <GanttChartSquare className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/overview"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40 dark:hover:text-white "
              >
                Resumen general
              </Link>
            </li>
            <li className="relative flex items-center gap-2">
              <CalendarRange className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/monthly"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40 dark:hover:text-white "
              >
                Resumen mensual
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Admin
            </p>
            <li className="relative flex items-center gap-2">
              <User className="absolute left-2 h-5 w-5 text-accent " />
              <Link
                to="/mi-perfil"
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40  dark:hover:text-white "
              >
                Perfil
              </Link>
            </li>
            <li className="relative flex items-center gap-2">
              <LogOut className="absolute left-2 h-5 w-5 text-accent " />
              <button
                onClick={handleLogOut}
                className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40  dark:hover:text-white "
              >
                Salir
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
