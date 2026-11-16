import { z } from "zod";

const newYorkDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/New_York", dateStyle: "short" });
const newYorkClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const advanceNoticeMs = 24 * 60 * 60 * 1000;
const requestFields = {
  name: z.string().trim().min(1, "Enter your name.").max(100),
  phone: z.string().regex(/^\+1\d{10}$/, "Enter a 10-digit phone number."),
  email: z.email("Enter a valid email address.").max(254),
  guests: z.number().int().min(1).max(60, "The maximum is 60 guests."),
  date: z.iso.date(),
  startsAt: z.iso
    .datetime()
    .refine(
      (startsAt) => Date.parse(startsAt) >= Date.now() + advanceNoticeMs,
      "Please submit your request at least 24 hours before your event.",
    ),
};

const roomFields = {
  ...requestFields,
  refreshment: z.enum(["Coffee breaks", "Lunch buffet"]).optional(),
  audioVisual: z.boolean(),
};

const services = z.enum([
  "Staffing",
  "Rentals",
  "Tables",
  "Chairs",
  "Chair covers",
  "Linens",
  "Serving units",
  "Display props",
  "Tents",
]);

export const cateringRequestSchema = z
  .discriminatedUnion("eventType", [
    z.strictObject({ ...roomFields, eventType: z.literal("private") }),
    z.strictObject({ ...roomFields, eventType: z.literal("corporate") }),
    z.strictObject({
      ...requestFields,
      eventType: z.literal("full-service"),
      services: z
        .array(services)
        .max(9)
        .refine((items) => new Set(items).size === items.length),
    }),
  ])
  .refine(
    ({ date, eventType }) => {
      if (eventType === "full-service") return true;
      const weekday = new Date(date).getUTCDay();
      return weekday >= 1 && weekday <= 4;
    },
    { message: "Room rentals are available Monday through Thursday.", path: ["date"] },
  )
  .refine(
    ({ date, startsAt }) => {
      const start = Date.parse(startsAt);
      return !Number.isFinite(start) || newYorkDate.format(start) === date;
    },
    { message: "Choose a start time on your requested date in New York.", path: ["startsAt"] },
  )
  .refine(
    ({ startsAt, eventType }) => {
      const start = Date.parse(startsAt);
      if (eventType === "full-service" || !Number.isFinite(start)) return true;
      const time = newYorkClock.format(start);
      return time >= "09:00" && time <= "17:00";
    },
    {
      message: "Choose a room rental start time between 9:00 am and 5:00 pm New York time.",
      path: ["startsAt"],
    },
  );

export type CateringRequest = z.infer<typeof cateringRequestSchema>;
