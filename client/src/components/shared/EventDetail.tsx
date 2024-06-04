import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { EventApiResponse } from "@/types";
import { getEventById, getEventsByUser } from "@/api/events";
import { CalendarDays, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Collection from "./Collection";
import CheckoutButton from "./CheckoutButton";

const EventDetail = () => {
  const { eventId } = useParams<string>() as { eventId: string };

  const [eventDetail, setEventDetail] = useState<EventApiResponse | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventApiResponse[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventDetail = await getEventById({ eventId });

      console.log(eventDetail);
      eventDetail && setEventDetail(eventDetail);
      if (eventDetail) {
        const userId = eventDetail.organizerId;

        const relatedEventsByUser = await getEventsByUser({
          userId,
          page: 1,
          limit: 6,
        });

        relatedEventsByUser && setRelatedEvents(relatedEventsByUser);
      }
    };

    getEvents();
  }, []);

  if (!eventDetail) {
    return <div>Showing post</div>;
  }

  return (
    <>
      {eventDetail && (
        <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
            <img
              src={eventDetail.imageUrl}
              alt="hero image"
              width={1000}
              height={1000}
              className="h-full min-h-[300px] object-cover object-center"
            />

            <div className="flex w-full flex-col gap-8 p-5 md:p-10">
              <div className="flex flex-col gap-6">
                <h2 className="h2-bold">{eventDetail.title}</h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-3">
                    <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                      {eventDetail.isFree ? "FREE" : `₹ ${eventDetail.price}`}
                    </p>
                    <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                      {eventDetail.category.name}
                    </p>
                  </div>

                  <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                    by{" "}
                    <span className="text-primary-500">
                      {eventDetail.organizer.firstName}{" "}
                      {eventDetail.organizer.lastName}
                    </span>
                  </p>
                </div>
              </div>

              <CheckoutButton event={eventDetail} />

              <div className="flex flex-col gap-5">
                <div className="flex gap-2 md:gap-3">
                  <CalendarDays width={32} height={32} />
                  <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center gap-2">
                    <p>
                      {formatDateTime(eventDetail.startDateTime).dateOnly} -
                      {"  "}
                      {formatDateTime(eventDetail.startDateTime).timeOnly}
                    </p>
                    <p>
                      {formatDateTime(eventDetail.endDateTime).dateOnly} -{"  "}
                      {formatDateTime(eventDetail.endDateTime).timeOnly}
                    </p>
                  </div>
                </div>

                <div className="p-regular-20 flex items-center gap-3">
                  <MapPin width={32} height={32} />
                  <p className="p-medium-16 lg:p-regular-20">
                    {eventDetail.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="p-bold-20 text-grey-600">What You'll Learn:</p>
                <p className="p-medium-16 lg:p-regular-18">
                  {eventDetail.description}
                </p>
                <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                  {eventDetail.url}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedEvents && (
        <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
          <h2 className="h2-bold">Related Events</h2>

          <Collection
            data={relatedEvents}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={3}
            page={1}
            totalPages={1}
          />
        </section>
      )}
    </>
  );
};

export default EventDetail;
