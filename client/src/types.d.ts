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
export type GetEventsByUserParams = {
  userId: string;
  limit: number;
  page: number;
};

export interface EventItem extends Event {
  category: Icategory;
  organizer: Organizer;
}

export type Order = {
  id: string;
  createdAt: Date;
  totalAmount?: string;
  eventId: string;
  buyerId: string;
};

export interface OrderItem extends Order {
  buyer: Organizer;
  event: EventItem;
}

export interface OrderApiResponse {
  data: OrderItem[];
  totalPages: number;
}

export type OrderDetail = {
  buyer: string;
  createdAt: Date;
  eventId: string;
  eventTitle: string;
  id: string;
  totalAmount: string;
};

export interface EventsApiResponse {
  data: EventItem[];
  totalPages: number;
}

export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};
export type GetOrdersByUserParams = {
  userId: string;
  limit: number;
  page: number;
};
export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
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
