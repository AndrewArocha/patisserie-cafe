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

type RequestDetails = {
  name: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
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
