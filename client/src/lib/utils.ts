import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";

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

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return formattedPrice;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const newSearchParams = new URLSearchParams(params);
  newSearchParams.set(key, value as string);
  return newSearchParams.toString();
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const newSearchParams = new URLSearchParams(params);
  keysToRemove.forEach((key) => {
    newSearchParams.delete(key);
  });
  return newSearchParams.toString();
}
