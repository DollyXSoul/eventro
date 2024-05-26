import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const customdateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const customdateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const customTimeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    customdateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    customdateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    customTimeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
