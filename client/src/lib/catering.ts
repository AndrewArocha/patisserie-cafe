export const cateringEvents = {
  private: {
    title: "Private",
    requestTitle: "Private room rental",
    description: "An intimate space for celebrations, family gatherings, and time together.",
  },
  corporate: {
    title: "Corporate",
    requestTitle: "Corporate room rental",
    description: "Bring your team together for a meeting, workshop, or working lunch.",
  },
  "full-service": {
    title: "Full-Service",
    requestTitle: "Full-service catering",
    description: "Plan the food, staffing, and rentals for your event with our catering team.",
  },
};

export const cateringServices = [
  "Staffing",
  "Rentals",
  "Tables",
  "Chairs",
  "Chair covers",
  "Linens",
  "Serving units",
  "Display props",
  "Tents",
] as const;

export const rentalRefreshments = ["Coffee breaks", "Lunch buffet"] as const;
export type EventType = keyof typeof cateringEvents;

export const advanceNotice = "Please submit your request at least 24 hours before your event.";
export const advanceNoticeMs = 24 * 60 * 60 * 1000;
export const newYorkDate = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/New_York",
  dateStyle: "short",
});
export const newYorkTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});
const newYorkClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function getRequestStartTimes(date: string, roomRental: boolean) {
  const midnightUtc = Date.parse(date);
  const slots: number[] = [];
  // Scan UTC instants to skip nonexistent local times and retain both times when clocks fall back.
  for (let minutes = 0; minutes < 30 * 60; minutes += 30) {
    const startsAt = midnightUtc + minutes * 60_000;
    if (newYorkDate.format(startsAt) !== date) continue;
    const time = newYorkClock.format(startsAt);
    if (!roomRental || (time >= "09:00" && time <= "17:00")) slots.push(startsAt);
  }
  return slots;
}

type RequestDetails = {
  name: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  startsAt: string;
};

export type CateringRequest = RequestDetails &
  (
    | { eventType: "full-service"; services: (typeof cateringServices)[number][] }
    | {
        eventType: "private" | "corporate";
        refreshment?: (typeof rentalRefreshments)[number];
        audioVisual: boolean;
      }
  );
