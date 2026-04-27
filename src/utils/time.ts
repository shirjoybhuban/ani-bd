import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const DHAKA_TIME_ZONE = "Asia/Dhaka";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(timestamp: number): string {
  return dayjs.unix(timestamp).tz(DHAKA_TIME_ZONE).format("MMM D, YYYY h:mm A");
}

export function formatDateWithWeekday(timestamp: number): string {
  return dayjs.unix(timestamp).tz(DHAKA_TIME_ZONE).format("dddd, MMM D, YYYY h:mm A");
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) {
    return "Airing now";
  }

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours}h`);
  parts.push(`${minutes}m`, `${secs}s`);

  return parts.join(" ");
}
