import { z } from "zod";

const newYorkDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/New_York", dateStyle: "short" });
const requestFields = {
  name: z.string().trim().min(1, "Enter your name.").max(100),
  phone: z.string().regex(/^\+1\d{10}$/, "Enter a 10-digit phone number."),
  email: z.email("Enter a valid email address.").max(254),
  guests: z.number().int().min(1).max(60, "The maximum is 60 guests."),
  date: z.iso
    .date()
    .refine((date) => date >= newYorkDate.format(new Date()), "Choose today or a future date."),
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
  );

export type CateringRequest = z.infer<typeof cateringRequestSchema>;
