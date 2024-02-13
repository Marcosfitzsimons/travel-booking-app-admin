import { BarChart3, LineChart, Map, Newspaper, Users } from "lucide-react";

export const listItems = [
  {
    id: 2,
    linkTo: "/trips",
    text: "Viajes semanales",
    icon: <Map className="h-5 w-5 mr-1" />,
  },
  {
    id: 3,
    linkTo: "/special-trips",
    text: "Viajes particulares",
    icon: <Map className="h-5 w-5 mr-1" />,
  },
  {
    id: 4,
    linkTo: "/users",
    text: "Usuarios",
    icon: <Users className="h-5 w-5 mr-1" />,
  },
  {
    id: 5,
    linkTo: "/publications",
    text: "Publicaciones",
    icon: <Newspaper className="h-5 w-5 mr-1" />,
  },
];

export const salesItems = [
  {
    id: 6,
    linkTo: "/yearly",
    text: "Resumen anual",
    icon: <BarChart3 className="h-5 w-5 mr-1" />,
  },
  {
    id: 7,
    linkTo: "/monthly",
    text: "Resumen mensual",
    icon: <LineChart className="h-5 w-5 mr-1" />,
  },
];
