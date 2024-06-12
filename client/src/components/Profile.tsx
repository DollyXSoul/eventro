import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/api/events";
import { getOrdersByUser } from "@/api/order";
import { useAuth } from "@clerk/clerk-react";
import { Link, useSearchParams } from "react-router-dom";
import { EventItem, EventsApiResponse } from "@/types";
import { useState, useEffect } from "react";

const Profile = () => {
  const { userId, isLoaded } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [organizedEvents, setOrganizedEvents] = useState<EventsApiResponse>({
    data: [],
    totalPages: 0,
  });
  const [orderedEvents, setOrderedEvents] = useState<EventsApiResponse>({
    data: [],
    totalPages: 0,
  });

  useEffect(() => {
    const getEvents = async () => {
      if (userId) {
        const res = await getEventsByUser({
          userId,
          page,
          limit: 2,
        });
        const orderRes = await getOrdersByUser({
          userId,
          page,
          limit: 2,
        });

        res && setOrganizedEvents(res);

        let events: EventItem[] = [];
        if (orderRes) {
          events = orderRes.data.map((order) => order.event);
          setOrderedEvents({
            data: events,
            totalPages: orderRes.totalPages,
          });
        }
      }
    };

    getEvents();
  }, [page]);

  if (!isLoaded) {
    return <div>Loading....</div>;
  }

  return (
    <>
      {/* My Tickets */}
      <section className="bg-slate-100  bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link to="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents.data}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          urlParamName="ordersPage"
          totalPages={orderedEvents?.totalPages}
        />
      </section>

      {/* Events Organized */}
      <section className="bg-slate-100  bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link to="/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={2}
          page={page}
          totalPages={organizedEvents.totalPages}
        />
      </section>
    </>
  );
};

export default Profile;
