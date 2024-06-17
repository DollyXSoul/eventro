import Stripe from "stripe";
const dotenv = require("dotenv");
dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
