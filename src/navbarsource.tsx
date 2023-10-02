import { BarChart3, LineChart, Map, Newspaper, Users } from "lucide-react";

export const listItems = [
  {
    id: 2,
    linkTo: "/trips",
    text: "Viajes semanales",
    icon: <Map className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 3,
    linkTo: "/special-trips",
    text: "Viajes particulares",
    icon: <Map className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 4,
    linkTo: "/users",
    text: "Usuarios",
    icon: <Users className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 5,
    linkTo: "/publications",
    text: "Publicaciones",
    icon: <Newspaper className="absolute left-2 h-5 w-5 text-accent " />,
  },
];

export const salesItems = [
  {
    id: 6,
    linkTo: "/yearly",
    text: "Resumen anual",
    icon: <BarChart3 className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 7,
    linkTo: "/monthly",
    text: "Resumen mensual",
    icon: <LineChart className="absolute left-2 h-5 w-5 text-accent " />,
  },
];
