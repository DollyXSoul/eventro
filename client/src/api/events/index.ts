import {
  CreateEventParams,
  GetAllEventsParams,
  Event,
  EventApiResponse,
} from "@/types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createEvent = async ({ userId, event }: CreateEventParams) => {
  try {
    const data = await axios.post(`${BASE_URL}/api/event`, {
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
export const getEventDetail = async ({ eventId }: { eventId: string }) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/event/${eventId}`);

    const res: EventApiResponse = data.data;
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
  page,
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

    const res: EventApiResponse[] = data.data.data;
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteEvent = async ({ eventId }: { eventId: string }) => {
  try {
    const data = await axios.delete(`${BASE_URL}/api/event/${eventId}`);

    const res = data;
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};
