export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// Pre-instantiated Intl formatters to avoid expensive re-initialization on every render
const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

export function formatEventDate(date: Date | string | number) {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  return {
    weekday: weekdayFormatter.format(d),
    month: monthFormatter.format(d),
    day,
    ordinal: getOrdinalSuffix(day),
    year: d.getFullYear(),
    time: timeFormatter.format(d).toLowerCase(),
  };
}