import { eachDayOfInterval } from "date-fns";

export const getCalendarDates = () => {
  // Du Lundi 25 Mai au Mardi 30 Juin 2026 inclus
  const startDate = new Date(2026, 4, 25); // 25 Mai 2026
  const endDate = new Date(2026, 5, 30); // 30 Juin 2026

  return eachDayOfInterval({ start: startDate, end: endDate });
};