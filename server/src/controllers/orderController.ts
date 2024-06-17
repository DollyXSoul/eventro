import { Request, Response } from "express";
import { prismaClient as prisma } from "../lib/db";
import { stripe } from "../lib/stripe";
const CLIENT_DOMAIN = process.env.REACT_PUBLIC_SERVER_URL;

export const getOrdersByUser = async (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const limit = Number(req.query.limit) || 3;
  const page = Number(req.query.page) || 1;

  try {
    const skipAmount = (Number(page) - 1) * Number(limit);

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      skip: skipAmount,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                firstName: true,
                lastName: true,
                clerkId: true,
              },
            },
          },
        },
      },
    });

    const orderCount = await prisma.order.count({
      where: { buyerId: userId },
    });

    res.json({
      data: orders,
      totalPages: Math.ceil(orderCount / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersByEvent = async (req: Request, res: Response) => {
  const eventId = req.query.eventId as string | undefined;
  const searchString = req.query.searchString as string | "";

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        eventId: eventId,
        buyer: {
          OR: [
            { firstName: { contains: searchString, mode: "insensitive" } },
            { lastName: { contains: searchString, mode: "insensitive" } },
          ],
        },
      },
      include: {
        buyer: true,
        event: true,
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      eventTitle: order.event.title,
      eventId: order.event.id,
      buyer: `${order.buyer.firstName} ${order.buyer.lastName}`,
    }));

    res.send(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkoutOrder = async (req: Request, res: Response) => {
  const { order } = req.body;

  const { eventTitle, eventId, price, isFree, buyerId } = order;

  const productPrice = isFree ? 0 : Number(price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: productPrice,
            product_data: {
              name: eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId,
        buyerId,
      },
      mode: "payment",
      success_url: `${CLIENT_DOMAIN}/profile`,
      cancel_url: `${CLIENT_DOMAIN}/`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
