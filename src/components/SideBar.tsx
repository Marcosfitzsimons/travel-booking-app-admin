import { User, LogOut, LayoutGrid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "@/hooks/useLogOut";
import { useEffect, useState } from "react";
import { listItems, salesItems } from "@/navbarsource";

const SideBar = () => {
  const [active, setIsActive] = useState(1);
  const { auth } = useAuth();
  const user = auth?.user;

  const logout = useLogout();

  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    switch (path) {
      case "trips":
        setIsActive(2);
        break;
      case "special-trips":
        setIsActive(3);
        break;
      case "users":
        setIsActive(4);
        break;
      case "publications":
        setIsActive(5);
        break;
      case "yearly":
        setIsActive(6);
        break;
      case "monthly":
        setIsActive(7);
        break;
      case "mi-perfil":
        setIsActive(8);
        break;
      default:
        setIsActive(1);
    }
  }, [path]);

  // Inicio > Panel de Control

  return !user ? (
    <div className=""></div>
  ) : (
    <div className="hidden flex-[1] h-screen lg:flex lg:flex-col lg:items-center pl-8 lg:py-[160px]">
      <div className="rounded-md flex flex-col w-[14rem] gap-5">
        <nav className="flex flex-col gap-3">
          <div className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Inicio
            </p>
            <div className="relative flex items-center gap-2">
              <LayoutGrid className="absolute left-2 w-5 h-5 text-accent" />
              <Link
                to="/"
                className={`w-full pl-8 z-20 py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-zinc-200/40 dark:hover:bg-white/20 dark:hover:text-white ${
                  active === 1
                    ? "border-l-2 border-l-accent rounded-l-none bg-zinc-200/40 font-semibold dark:bg-white/20 dark:text-white"
                    : ""
                }`}
              >
                Panel de Control
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Listas
            </p>

            <ul className="flex flex-col">
              {listItems.map((item) => (
                <li className="relative flex items-center gap-2" key={item.id}>
                  {item.icon}
                  <Link
                    to={item.linkTo}
                    className={`w-full pl-8 z-20 py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-zinc-200/40 dark:hover:bg-white/20 dark:hover:text-white ${
                      active === item.id
                        ? "border-l-2 border-l-accent rounded-l-none bg-zinc-200/40 font-semibold dark:bg-white/20 dark:text-white"
                        : ""
                    }`}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Ganancias
            </p>
            <ul className="flex flex-col">
              {salesItems.map((item) => (
                <li className="relative flex items-center gap-2" key={item.id}>
                  {item.icon}
                  <Link
                    to={item.linkTo}
                    className={`w-full pl-8 z-20 py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-zinc-200/40 dark:hover:bg-white/20 dark:hover:text-white ${
                      active === item.id
                        ? "border-l-2 border-l-accent rounded-l-none bg-zinc-200/40 font-semibold dark:bg-white/20 dark:text-white"
                        : ""
                    }`}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-accent uppercase pb-1 font-bold text-sm dark:text-white">
              Admin
            </p>
            <ul className="flex flex-col">
              <li className={`relative flex items-center gap-2`}>
                <User className="absolute left-2 h-5 w-5 text-accent " />
                <Link
                  to="/mi-perfil"
                  className={`w-full pl-8 z-20 py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-zinc-200/40 dark:hover:bg-white/20 dark:hover:text-white ${
                    active === 8
                      ? "border-l-2 border-l-accent rounded-l-none bg-zinc-200/40 font-semibold dark:bg-white/20 dark:text-white"
                      : ""
                  }`}
                >
                  Perfil
                </Link>
              </li>
              <li className="relative flex items-center gap-2">
                <LogOut className="absolute left-2 h-5 w-5 text-accent " />
                <button
                  onClick={handleLogOut}
                  className="w-full pl-8 z-20 rounded-lg py-1 px-2 flex items-center gap-1 text-start bg-transparent hover:bg-hover/40 dark:hover:text-white "
                >
                  Salir
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
