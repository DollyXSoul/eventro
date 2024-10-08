import { useState, useEffect } from "react";
import { EventsApiResponse } from "@/types";
import Collection from "./shared/Collection";
import { Button } from "./ui/button";
import { getAllEvents } from "@/api/events";
import Search from "./shared/Search";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "./shared/CategoryFilter";
const Home = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";

  const [events, setEvents] = useState<EventsApiResponse>({
    data: [],
    totalPages: 0,
  });

  useEffect(() => {
    const getEvents = async () => {
      const res: EventsApiResponse = await getAllEvents({
        query: searchText,
        category,
        page,
        limit: 2,
      });

      res && setEvents(res);
      console.log(res);
    };

    getEvents();
  }, [searchText, category, page]);

  return (
    <>
      <section className="bg-grey-50 bg-contain py-5 md:py-10 ">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-4">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="font-bold text-[40px] leading-[48px] lg:text-[48px] lg:leading-[60px]  xl:text-[58px] xl:leading-[74px]">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="text-[20px] font-normal leading-[30px] tracking-[2%] md:text-[24px] md:leading-[36px]">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button
              size="lg"
              asChild
              className="rounded-full h-[54px] w-full sm:w-fit text-[16px] font-normal leading-[24px]"
            >
              <a href="#events">Explore Now</a>
            </Button>
          </div>
          <img
            src="/assets/images/eventro.png"
            alt="eventro"
            className="max-h-[80vh] object-contain object-center 2xl:max-h-[70vh] md:-mt-12 mx-auto "
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-4 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="font-bold text-[32px] leading-[40px] lg:text-[36px] lg:leading-[44px] xl:text-[40px] xl:leading-[48px]">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={2}
          page={page}
          totalPages={events.totalPages}
        />
      </section>
    </>
  );
};

export default Home;
