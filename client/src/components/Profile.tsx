import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/api/events";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { EventApiResponse } from "@/types";
import { useState, useEffect } from "react";

const Profile = () => {
  const { userId } = useAuth();

  const [organizedEvents, setOrganizedEvents] = useState<EventApiResponse[]>(
    []
  );

  useEffect(() => {
    const getEvents = async () => {
      if (userId) {
        const eventsByUser = await getEventsByUser({
          userId,
          page: 1,
          limit: 6,
        });

        eventsByUser && setOrganizedEvents(eventsByUser);
      }
    };

    getEvents();
  }, []);

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
          data={organizedEvents}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={1}
          urlParamName="eventsPage"
          totalPages={1}
        />
      </section>
    </>
  );
};

export default Profile;
