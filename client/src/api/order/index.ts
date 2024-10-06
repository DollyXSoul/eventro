import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutOrderParams,
  GetOrdersByUserParams,
  OrderApiResponse,
  GetOrdersByEventParams,
  OrderDetail,
} from "@/types";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = await loadStripe(PUBLIC_KEY);
  try {
    const response = await axios.post(`${BASE_URL}/api/orders/checkout`, {
      order,
    });

    const result = await stripe?.redirectToCheckout({
      sessionId: response.data.id,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    const data = await axios.get(`${BASE_URL}/api/orders/by-user`, {
      params: {
        userId,
        page,
        limit,
      },
    });

    const res: OrderApiResponse = data.data;
    return res;
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalPages: 0,
    };
  }
}

export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    const data = await axios.get(`${BASE_URL}/api/orders/by-event`, {
      params: {
        eventId,
        searchString,
      },
    });
    const res: OrderDetail[] = data.data;
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
}
