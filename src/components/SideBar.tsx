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

            <div>
              <Link
                to="/"
                className={`w-full py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-slate-100 dark:hover:bg-white/20 dark:hover:text-white ${
                  active === 1
                    ? "border-l-2 border-l-accent rounded-l-none bg-slate-100 font-semibold dark:bg-white/20 dark:text-white"
                    : ""
                }`}
              >
                <LayoutGrid className="h-5 w-5 mr-1" />
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
                <li key={item.id}>
                  <Link
                    to={item.linkTo}
                    className={`w-full py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-slate-100 dark:hover:bg-white/20 dark:hover:text-white ${
                      active === item.id
                        ? "border-l-2 border-l-accent rounded-l-none bg-slate-100 font-semibold dark:bg-white/20 dark:text-white"
                        : ""
                    }`}
                  >
                    {item.icon}
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
                <li key={item.id}>
                  <Link
                    to={item.linkTo}
                    className={`w-full py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-slate-100 dark:hover:bg-white/20 dark:hover:text-white ${
                      active === item.id
                        ? "border-l-2 border-l-accent rounded-l-none bg-slate-100 font-semibold dark:bg-white/20 dark:text-white"
                        : ""
                    }`}
                  >
                    {item.icon}
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
              <li>
                <Link
                  to="/mi-perfil"
                  className={`w-full py-1 px-2 flex items-center gap-1 rounded-lg text-start hover:bg-slate-100 dark:hover:bg-white/20 dark:hover:text-white ${
                    active === 8
                      ? "border-l-2 border-l-accent rounded-l-none bg-slate-100 font-semibold dark:bg-white/20 dark:text-white"
                      : ""
                  }`}
                >
                  <User className="h-5 w-5 mr-1" />
                  Perfil
                </Link>
              </li>
              <button
                onClick={handleLogOut}
                className="w-full rounded-lg py-1 px-2 flex items-center gap-1 text-start hover:bg-slate-100 dark:hover:bg-white/20 dark:hover:text-white"
              >
                <LogOut className="mr-1 h-5 w-5 " />
                Salir
              </button>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
