import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutOrderParams } from "@/types";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = await loadStripe(PUBLIC_KEY);
  try {
    const response = await axios.post(`${BASE_URL}/api/checkoutOrder`, {
      order,
    });

    const result = await stripe?.redirectToCheckout({
      sessionId: response.data.id,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
