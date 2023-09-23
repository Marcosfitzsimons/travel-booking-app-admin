import { dayOfWeekTranslations } from "../constants";

export function translateDayOfWeek(dayOfWeek: any) {
    return dayOfWeekTranslations[dayOfWeek.toLowerCase()] || dayOfWeek;
  }
