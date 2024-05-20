import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateReactHelpers } from "@uploadthing/react";

import { OurFileRouter } from "@/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
