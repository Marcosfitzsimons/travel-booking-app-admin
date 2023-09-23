import { DayCardProps } from "@/types/props";
import { dayOfWeekToNumber } from "../constants";

export function sortByWeeklyOrder(items: any) {
    // Sort the trips based on the numeric value of dayOfWeek
    items.sort((a: DayCardProps, b: DayCardProps) => {
      const dayA = a.dayOfWeek;
      const dayB = b.dayOfWeek;

      const numericValueA = dayOfWeekToNumber[dayA];
      const numericValueB = dayOfWeekToNumber[dayB];

      return numericValueA - numericValueB;
    });
  }