import {
  AlignCenter,
  BarChart3,
  LayoutGrid,
  LineChart,
  LogOut,
  Map,
  Newspaper,
  User,
  Users,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogOut";

const Header = () => {
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
  // Change the logo and theme-toggle to aside component
  return (
    <header className="bg-transparent">
      <div
        className={`${
          !user ? "lg:justify-start lg:gap-3" : "justify-between"
        } py-2 flex items-center justify-between z-50 lg:py-[12.5px]`}
      >
        <div className="flex items-center gap-2 lg:absolute lg:left-12 lg:top-5">
          <Logo />
          <Separator orientation="vertical" className="h-2 ml-2" />
          <ThemeToggle />
        </div>
        {!user ? (
          ""
        ) : (
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="lg:hidden" asChild>
                <Button
                  variant="ghost"
                  className="relative top-[1px] w-8 h-8 rounded-md p-0 dark:hover:text-white dark:hover:bg-blue-lagoon-900/70"
                >
                  <AlignCenter />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-border-color dark:border-zinc-600"
              >
                <DropdownMenuLabel className="uppercase text-black/80 font-bold text-sm dark:text-white">
                  Inicio
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-600" />
                <DropdownMenuItem className="cursor-pointer p-0">
                  <LayoutGrid className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Panel de Control
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuLabel className="uppercase text-black/80 font-bold text-sm dark:text-white">
                  Listas
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-600" />
                <DropdownMenuItem className="relative flex items-center gap-2 cursor-pointer p-0 hover:text-blue-lagoon-700">
                  <Map className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/trips"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Viajes semanales
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="relative flex items-center gap-2 cursor-pointer p-0 hover:text-blue-lagoon-700">
                  <Map className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/special-trips"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Viajes particulares
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-0">
                  <Users className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/users"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Usuarios
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-0">
                  <Newspaper className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/publications"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Publicaciones
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuLabel className="uppercase text-black/80 font-bold text-sm dark:text-white">
                  Ganancias
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-600" />
                <DropdownMenuItem className="cursor-pointer p-0">
                  <BarChart3 className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/yearly"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Resumen anual
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-0">
                  <LineChart className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/monthly"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Resumen mensual
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuLabel className="uppercase text-black/80 font-bold text-sm dark:text-white">
                  Admin
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-600" />
                <DropdownMenuItem className="cursor-pointer p-0">
                  <User className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />
                  <Link
                    to="/mi-perfil"
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-0">
                  <LogOut className="absolute left-2 h-4 w-4 text-blue-lagoon-900/60 dark:text-blue-lagoon-300" />

                  <button
                    onClick={handleLogOut}
                    className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent text-blue-lagoon-900 hover:bg-blue-lagoon-100/20 dark:text-blue-lagoon-50 dark:hover:text-white dark:hover:bg-zinc-700/20"
                  >
                    Salir
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
