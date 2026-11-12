import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import {
  cateringEvents,
  cateringServices,
  rentalRefreshments,
  type CateringRequest,
  type EventType,
} from "../lib/catering";
import { CATERING_PHONE } from "../lib/contact";
import { ROOM_RENTAL_RATE } from "../lib/menu";
import { RequestDatePicker, formatRequestDate } from "./RequestDatePicker";
import { StatusMessage } from "./StatusMessage";

const field =
  "min-h-11 min-w-0 border border-ink/25 bg-white px-3 text-ink focus-visible:outline-2 focus-visible:outline-terracotta";
const fieldGroup = "grid min-w-0 gap-1.5 font-semibold";
const guestCounts = Array.from({ length: 60 }, (_, index) => index + 1);

function formatPhone(digits: string) {
  if (digits.length <= 3) return digits;
  const prefix = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}`;
  return digits.length > 6 ? `${prefix}-${digits.slice(6)}` : prefix;
}

function ServiceCheck() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0 text-[#28704c]">
      <path
        d="m4 10 4 4 8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RequestSummary({ details }: { details: CateringRequest }) {
  const rows = [
    ["Event", cateringEvents[details.eventType].requestTitle],
    ["Date", formatRequestDate(details.date)],
    ["Guests", details.guests],
    ["Name", details.name],
    ["Phone", `+1 ${formatPhone(details.phone.slice(2))}`],
    ["Email", details.email],
  ];
  if (details.eventType !== "full-service") {
    rows.push(
      ["Room rental", ROOM_RENTAL_RATE],
      ["Refreshments", details.refreshment ?? "None requested"],
      ["Audio visual", details.audioVisual ? "Requested" : "None requested"],
    );
  }
  return (
    <div className="grid gap-4">
      <dl className="divide-y divide-ink/10 border-y border-ink/10">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(5.5rem,0.5fr)_1fr] gap-2 py-2 sm:gap-4">
            <dt className="font-semibold">{label}</dt>
            <dd className="wrap-anywhere">{value}</dd>
          </div>
        ))}
      </dl>
      {details.eventType === "full-service" && (
        <div>
          <h3 className="font-semibold">Requested services</h3>
          {details.services.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {details.services.map((service) => (
                <li key={service} className="flex items-center gap-1.5 rounded-sm bg-[#e9f1e9] px-2.5 py-1">
                  <ServiceCheck /> {service}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink/70">None selected</p>
          )}
        </div>
      )}
    </div>
  );
}

export function CateringRequestDialog({ eventType, onClose }: { eventType: EventType; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const summaryHeading = useRef<HTMLHeadingElement>(null);
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [review, setReview] = useState<CateringRequest | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const roomRental = eventType !== "full-service";

  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
  }, []);

  useEffect(() => {
    if (review) summaryHeading.current?.focus();
  }, [review, sent]);

  const reviewRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (phone.length !== 10 || !date) {
      setError(phone.length !== 10 ? "Enter a 10-digit phone number." : "Choose a date for your event.");
      return;
    }
    const values = new FormData(event.currentTarget);
    const details = {
      name: String(values.get("name")).trim(),
      email: String(values.get("email")).trim(),
      phone: `+1${phone}`,
      guests: Number(values.get("guests")),
      date,
    };
    if (!details.name) {
      setError("Enter your name.");
      return;
    }
    setReview(
      eventType === "full-service"
        ? {
            ...details,
            eventType,
            services: cateringServices.filter((service) => values.getAll("services").includes(service)),
          }
        : {
            ...details,
            eventType,
            refreshment: rentalRefreshments.find((option) => option === values.get("refreshment")),
            audioVisual: values.has("audioVisual"),
          },
    );
    dialog.current?.scrollTo(0, 0);
  };

  const sendRequest = async () => {
    if (!review || sending) return;
    setError("");
    setSending(true);
    try {
      await api.requestCatering(review);
      setSent(true);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "We couldn’t send your request. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="catering-request-title"
      className="catering-request-dialog m-auto max-h-[92dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto bg-cream p-5 text-ink shadow-2xl backdrop:bg-ink/65 sm:p-8"
      onClose={onClose}
      onCancel={(event) => {
        if (sending) event.preventDefault();
      }}
    >
      <button
        type="button"
        aria-label="Close request"
        disabled={sending}
        className="absolute top-3 right-3 grid size-10 cursor-pointer place-items-center rounded-full hover:bg-blush disabled:opacity-40"
        onClick={() => dialog.current?.close()}
      >
        <span className="text-2xl leading-none" aria-hidden="true">
          ×
        </span>
      </button>
      <h2 id="catering-request-title" className="pr-9 font-display text-2xl sm:text-3xl">
        {cateringEvents[eventType].requestTitle}
      </h2>
      <p className="mt-2! text-ink/75">
        {roomRental
          ? "Up to 60 guests · Monday–Thursday, 9:00 am–5:00 pm"
          : "Up to 60 guests · Request availability"}
      </p>

      <form className="mt-5" hidden={review !== null} onSubmit={reviewRequest}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={fieldGroup}>
            Name
            <input className={field} name="name" autoComplete="name" maxLength={100} required />
          </label>
          <label className={fieldGroup}>
            Number of guests
            <select className={field} name="guests" defaultValue="" required>
              <option value="" disabled>
                Select guest count
              </option>
              {guestCounts.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <label className={fieldGroup}>
            Phone
            <span className="flex min-w-0 items-stretch border border-ink/25 bg-white focus-within:outline-2 focus-within:outline-terracotta">
              <span
                className="grid place-items-center border-r border-ink/15 bg-[#f2ece4] px-3"
                aria-hidden="true"
              >
                +1
              </span>
              <input
                className="min-h-11 w-full min-w-0 px-3 outline-none"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(555) 123-4567"
                value={formatPhone(phone)}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "");
                  setPhone(
                    (digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits).slice(0, 10),
                  );
                }}
                required
              />
            </span>
          </label>
          <label className={fieldGroup}>
            Email
            <span className="flex min-w-0 items-stretch border border-ink/25 bg-white focus-within:outline-2 focus-within:outline-terracotta">
              <span
                className="grid place-items-center border-r border-ink/15 bg-[#f2ece4] px-3"
                aria-hidden="true"
              >
                @
              </span>
              <input
                className="min-h-11 w-full min-w-0 px-3 outline-none"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={254}
                required
              />
            </span>
          </label>
          <div className="sm:col-span-2">
            <RequestDatePicker value={date} onChange={setDate} roomRental={roomRental} />
          </div>
        </div>
        {roomRental ? (
          <fieldset className="mt-5 border-t border-ink/15 pt-3">
            <legend className="pr-2 font-semibold">Refreshments</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="refreshment" value="" defaultChecked className="accent-ink" /> None
              </label>
              {rentalRefreshments.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-1.5">
                  <input type="radio" name="refreshment" value={option} className="accent-ink" /> {option}
                </label>
              ))}
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input type="checkbox" name="audioVisual" className="accent-ink" /> Request audio visual
              equipment
            </label>
          </fieldset>
        ) : (
          <fieldset className="mt-5">
            <legend className="mb-2 font-semibold">Services</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {cateringServices.map((service) => (
                <label key={service} className="relative cursor-pointer">
                  <input className="peer sr-only" type="checkbox" name="services" value={service} />
                  <span className="flex min-h-10 items-center gap-1.5 rounded-sm border border-ink/20 px-2 text-sm peer-checked:border-[#28704c] peer-checked:bg-[#e9f1e9] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta">
                    <span
                      className="grid size-4 shrink-0 place-items-center rounded-xs border border-ink/25"
                      aria-hidden="true"
                    />
                    {service}
                  </span>
                  <span className="pointer-events-none absolute top-1/2 left-2 hidden -translate-y-1/2 peer-checked:block">
                    <ServiceCheck />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {error && !review && <StatusMessage kind="error">{error}</StatusMessage>}
        <div className="mt-5 flex justify-end">
          <button type="submit" className="button button-navy">
            Review request <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      {review && (
        <div className="mt-5 grid gap-4">
          <h3 ref={summaryHeading} tabIndex={-1} className="font-display text-xl outline-none">
            {sent ? "Request sent" : "Review your request"}
          </h3>
          {sent && (
            <StatusMessage kind="success">The café will contact you to confirm availability.</StatusMessage>
          )}
          <RequestSummary details={review} />
          {error && (
            <div>
              <StatusMessage kind="error">{error}</StatusMessage>
              <a
                href={CATERING_PHONE.href}
                className="font-semibold text-terracotta! underline underline-offset-3"
              >
                Call catering {CATERING_PHONE.label}
              </a>
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            {sent ? (
              <button type="button" className="button button-navy" onClick={() => dialog.current?.close()}>
                Done
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="button border-ink/25!"
                  disabled={sending}
                  onClick={() => {
                    setReview(null);
                    setError("");
                  }}
                >
                  Edit details
                </button>
                <button
                  type="button"
                  className="button button-navy"
                  disabled={sending}
                  onClick={() => void sendRequest()}
                >
                  {sending ? "Sending…" : "Send request"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
