import {
  CreateEventParams,
  UpdateEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  EventsApiResponse,
  EventItem,
} from "@/types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createEvent = async ({ userId, event }: CreateEventParams) => {
  try {
    const data = await axios.post(`${BASE_URL}/api/events`, {
      userId,
      event,
    });

    const res = data.data;
    return res;
  } catch (error) {
    console.error(error);
    return {};
  }
};
export const updateEvent = async ({ userId, event }: UpdateEventParams) => {
  try {
    const data = await axios.put(`${BASE_URL}/api/events`, {
      userId,
      event,
    });

    const res = data.data;
    return res;
  } catch (error) {
    console.error(error);
    return {};
  }
};
export const getEventById = async ({ eventId }: { eventId: string }) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/events/${eventId}`);

    const res: EventItem = data.data;
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getAllEvents = async ({
  query,
  category,
  limit = 6,
  page = 1,
}: GetAllEventsParams) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/events`, {
      params: {
        query,
        category,
        page,
        limit,
      },
    });

    const res: EventsApiResponse = data.data;
    return res;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalPages: 0,
    };
  }
};

export const getEventsByUser = async ({
  userId,
  limit = 6,
  page = 1,
}: GetEventsByUserParams) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/events/by-user`, {
      params: {
        query: userId,
        page,
        limit,
      },
    });

    const res: EventsApiResponse = data.data;
    // const pageCount: Number = data.data.totalPages;
    return res;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalPages: 0,
    };
  }
};

export const deleteEvent = async ({ eventId }: { eventId: string }) => {
  try {
    const data = await axios.delete(`${BASE_URL}/api/events/${eventId}`);

    const res = data;
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};
