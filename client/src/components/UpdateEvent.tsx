import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventForm from "./shared/EventForm";
import { EventItem } from "@/types";
import { getEventById } from "@/api/events";

const UpdateEvent = () => {
  const { userId } = useAuth() as { userId: string };
  const { eventId } = useParams() as { eventId: string };

  const [event, setEvent] = useState<EventItem>();

  useEffect(() => {
    const getEventDetail = async () => {
      const event = await getEventById({ eventId });

      console.log(event);
      event && setEvent(event);
    };

    getEventDetail();
  }, [eventId]);

  return (
    <>
      <section className="bg-primary-50/20 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        {event && (
          <EventForm
            type="Update"
            event={event}
            eventId={event.id}
            userId={userId}
          />
        )}
      </div>
    </>
  );
};

export default UpdateEvent;
