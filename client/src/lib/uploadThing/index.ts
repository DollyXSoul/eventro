import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../../../../server/src/uploadThing";

const ROUTER_URL = import.meta.env.VITE_FILE_ROUTER_URL;

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: ROUTER_URL,
  });
