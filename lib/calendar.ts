function toICSDate(date: Date): string {
  return new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateICS({
  title,
  description,
  location,
  startDate,
  durationHours = 4,
}: {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  durationHours?: number;
}) {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Homecoming Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@homecoming-invite`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "homecoming-event.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}