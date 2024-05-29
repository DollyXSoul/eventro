import { FileRouter } from "uploadthing/internal/types";

export type Icategory = {
  id: string;
  name: string;
};

export type Organizer = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string | null;
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
export type CreateEventParams = {
  userId: string;
  event: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
};
export type UpdateEventParams = {
  userId: string;
  event: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
    id: string;
  };
};
export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export interface EventApiResponse extends Event {
  category: Icategory;
  organizer: Organizer;
}

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
