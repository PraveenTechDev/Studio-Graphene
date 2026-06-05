import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

export function getTodayString() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getMonthKey(date = new Date()) {
  return format(date, "yyyy-MM");
}

export function getDateRangeFromPreset(preset) {
  const today = new Date();

  if (preset === "last-month") {
    const lastMonth = subMonths(today, 1);
    return {
      startDate: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
      endDate: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
      month: getMonthKey(lastMonth),
    };
  }

  return {
    startDate: format(startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(endOfMonth(today), "yyyy-MM-dd"),
    month: getMonthKey(today),
  };
}
