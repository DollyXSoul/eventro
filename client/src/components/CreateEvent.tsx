import { useAuth } from "@clerk/clerk-react";
import EventForm from "./shared/EventForm";
const CreateEvent = () => {
  const { userId } = useAuth() as { userId: string };
  return (
    <>
      <section className="bg-grey-50 bg-cover  bg-center py-5 md:py-10">
        <h1 className="wrapper h3-bold text-center sm:text-left">
          Create event
        </h1>
      </section>
      <div className="wrapper my-8">
        <EventForm type="Create" userId={userId} />
      </div>
    </>
  );
};

export default CreateEvent;
