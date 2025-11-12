import dayjs from "dayjs";

export function formatDate(input) {
  if (!input) return "";
  return dayjs(input.replace(" ", "T")).format("D MMMM, YYYY (h:mm A)");
}

export function formatTime(input) {
  if (!input) return "";
  return dayjs(input.replace(" ", "T")).format("h:mm A");
}

