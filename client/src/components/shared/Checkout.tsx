import { Button } from "../ui/button";
import { Event } from "@/types";
import { checkoutOrder } from "@/api/order";
const Checkout = ({ event, userId }: { event: Event; userId: string }) => {
  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event.id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };

    await checkoutOrder(order);
  };

  return (
    <Button
      type="submit"
      role="link"
      size="lg"
      className="button sm:w-fit"
      onClick={onCheckout}
    >
      {event.isFree ? "Get Ticket" : "Buy Ticket"}
    </Button>
  );
};

export default Checkout;
