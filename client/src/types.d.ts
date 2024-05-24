import { FileRouter } from "uploadthing/internal/types";

export type Icategory = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  categoryId?: string;
  organizerId: string;
};

export type CreateCategoryParams = {
  categoryName: string;
};

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
