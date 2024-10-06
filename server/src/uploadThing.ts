//import { request, response } from "express";
import { createUploadthing, type FileRouter } from "uploadthing/server";

//const auth = (req: typeof request) => ({ id: "fakeId" }); // Fake auth function

const f = createUploadthing({
  errorFormatter: (err: any) => {
    console.log("Error uploading file", err.message);
    console.log("Above error caused by:", err.cause);

    return { message: err.message };
  },
});

export const uploadRouter: FileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(({ files }) => {
      console.log(files);

      return {
        uploadedBy: "fake-user-id-213",
      };
    })
    .onUploadComplete(async (data) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", data);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { success: true };
    }),
};

export type OurFileRouter = typeof uploadRouter;
