export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function formatEventDate(date: Date) {
  const d = new Date(date);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    month: d.toLocaleDateString("en-US", { month: "long" }),
    day: d.getDate(),
    ordinal: getOrdinalSuffix(d.getDate()),
    year: d.getFullYear(),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase(),
  };
}