import {
  CalendarRange,
  GanttChartSquare,
  Map,
  Newspaper,
  Users,
} from "lucide-react";

export const listItems = [
  {
    id: 1,
    linkTo: "/trips",
    text: "Viajes semanales",
    icon: <Map className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 2,
    linkTo: "/special-trips",
    text: "Viajes particulares",
    icon: <Map className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 3,
    linkTo: "/users",
    text: "Usuarios",
    icon: <Users className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 4,
    linkTo: "/publications",
    text: "Publicaciones",
    icon: <Newspaper className="absolute left-2 h-5 w-5 text-accent " />,
  },
];

export const salesItems = [
  {
    id: 5,
    linkTo: "/overview",
    text: "Resumen general",
    icon: <GanttChartSquare className="absolute left-2 h-5 w-5 text-accent " />,
  },
  {
    id: 6,
    linkTo: "/monthly",
    text: "Resumen mensual",
    icon: <CalendarRange className="absolute left-2 h-5 w-5 text-accent " />,
  },
];