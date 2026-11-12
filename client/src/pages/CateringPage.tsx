import { useState } from "react";
import { Link } from "react-router-dom";
import { CateringRequestDialog } from "../components/CateringRequestDialog";
import { cateringEvents, type EventType } from "../lib/catering";
import { ROOM_RENTAL_RATE } from "../lib/menu";

const cateringChoices = [
  {
    title: "Catering Menu",
    description: "Breakfast baskets, lunch spreads, and platters made for sharing.",
    action: "Browse the menu",
    to: "/menu#catering",
    photo: "/images/patisserie-lunch.webp",
    position: "object-center",
  },
  {
    title: "Rentals and Service",
    description: "A space to gather, with full-service catering for your event.",
    action: "Explore event options",
    to: "/catering/events",
    photo: "/images/breakfast-basket.jpg",
    position: "object-[50%_20%]",
  },
];

export function CateringPage() {
  return (
    <main className="bg-ink">
      <h1 className="sr-only">Catering</h1>
      <div className="grid divide-y divide-white/25 md:grid-cols-2 md:divide-x md:divide-y-0">
        {cateringChoices.map((choice) => (
          <Link
            key={choice.title}
            to={choice.to}
            className="group relative isolate flex min-h-[49svh] items-end overflow-hidden p-7 text-cream! focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream sm:p-12 md:min-h-[min(75svh,48rem)] lg:p-16"
          >
            <img
              src={choice.photo}
              alt=""
              className={`absolute inset-0 -z-20 size-full scale-105 object-cover blur-[2px] motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-110 ${choice.position}`}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-t from-[#131821]/95 via-[#131821]/60 to-[#131821]/35"
            />
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(2.5rem,5.15vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.045em]">
                {choice.title}
              </h2>
              <p className="mt-4! max-w-[32ch] text-lg leading-relaxed text-cream/90">{choice.description}</p>
              <span className="mt-6 inline-flex min-h-11 items-center gap-4 border-b border-cream/60 font-semibold group-hover:border-cream">
                {choice.action} <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

const eventTypes: EventType[] = ["private", "corporate", "full-service"];

export function CateringEventsPage() {
  const [requestType, setRequestType] = useState<EventType | null>(null);
  return (
    <main className="bg-cream">
      <header className="relative isolate overflow-hidden bg-ink py-14 text-cream sm:py-20">
        <img
          src="/images/breakfast-basket.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[50%_28%]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-[#131821]/95 via-[#131821]/85 to-[#131821]/45"
        />
        <div className="about-shell">
          <Link
            to="/catering"
            className="inline-flex min-h-11 items-center gap-2 text-cream! underline underline-offset-4"
          >
            <span aria-hidden="true">←</span> Catering
          </Link>
          <h1 className="mt-4! font-display text-[clamp(2.85rem,7vw,6rem)] leading-[1.02] font-medium tracking-[-0.055em]">
            Rentals and <em className="text-[#f3bd9f]!">Service.</em>
          </h1>
          <p className="mt-4! max-w-[36ch] text-lg leading-relaxed text-cream/90 sm:text-xl">
            Host your gathering on Amsterdam Avenue or plan full-service catering with our team.
          </p>
        </div>
      </header>

      <section className="about-shell py-12 sm:py-16" aria-label="Event options">
        <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {eventTypes.map((type) => {
            const event = cateringEvents[type];
            const isRental = type !== "full-service";
            return (
              <article
                key={type}
                className={`flex flex-col border border-ink/10 p-6 sm:p-8 ${isRental ? "bg-[#f4ece3]" : "bg-blush"}`}
              >
                <h2 className="font-display text-3xl font-medium">{event.title}</h2>
                <p className="mt-3! text-lg leading-relaxed text-ink/80">{event.description}</p>
                <ul className="mt-5 mb-6 grid gap-2 border-t border-ink/15 pt-4 text-ink/85">
                  <li>Up to 60 guests</li>
                  {isRental ? (
                    <>
                      <li>Monday–Thursday · 9:00 am–5:00 pm</li>
                      <li>Room rental · {ROOM_RENTAL_RATE}</li>
                      <li>Audio visual, coffee breaks, and lunch buffet available</li>
                    </>
                  ) : (
                    <>
                      <li>Staffing, tables, chairs, linens, and more</li>
                      <li>Request availability for your event date</li>
                    </>
                  )}
                </ul>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  className="button button-navy mt-auto self-start"
                  onClick={() => setRequestType(type)}
                >
                  Request {isRental ? "room rental" : "full service"}
                  <span className="sr-only"> for {event.title}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>
      {requestType && <CateringRequestDialog eventType={requestType} onClose={() => setRequestType(null)} />}
    </main>
  );
}
