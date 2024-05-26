import { CreateEventParams, EventDetailResponse } from "@/types";
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

    const res: EventDetailResponse = data.data;
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};
