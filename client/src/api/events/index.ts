import { CreateEventParams } from "@/types";
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
