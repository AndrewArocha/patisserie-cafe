import { useId, useRef, useState } from "react";

const nyDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/New_York", dateStyle: "short" });
const monthLabel = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" });
const dateLabel = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", dateStyle: "full" });
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatRequestDate(date: string) {
  return dateLabel.format(new Date(date));
}

export function RequestDatePicker({
  value,
  onChange,
  roomRental,
}: {
  value: string;
  onChange: (date: string) => void;
  roomRental: boolean;
}) {
  const id = useId();
  const today = nyDate.format(new Date());
  const [month, setMonth] = useState(() => new Date(`${(value || today).slice(0, 7)}-01`));
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const dayCount = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  const shiftMonth = (offset: number) => setMonth(new Date(Date.UTC(year, monthIndex + offset, 1)));

  return (
    <div className="grid gap-1.5">
      <label htmlFor={`${id}-date`} className="font-semibold">
        Date
      </label>
      <button
        id={`${id}-date`}
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-calendar`}
        className="flex min-h-11 cursor-pointer items-center justify-between gap-2 border border-ink/25 bg-white px-3 text-left focus-visible:outline-2 focus-visible:outline-terracotta"
        onClick={() => setOpen(!open)}
      >
        {value ? formatRequestDate(value) : "Choose a date"}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-5 shrink-0"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4m10-4v4M3 10h18" />
        </svg>
      </button>
      <div id={`${id}-calendar`} hidden={!open} className="border border-ink/15 bg-white p-2 sm:p-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Previous month"
            disabled={month.toISOString().slice(0, 7) <= today.slice(0, 7)}
            className="min-h-10 min-w-10 cursor-pointer hover:bg-blush disabled:cursor-default disabled:opacity-35"
            onClick={() => shiftMonth(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <strong aria-live="polite">{monthLabel.format(month)}</strong>
          <button
            type="button"
            aria-label="Next month"
            className="min-h-10 min-w-10 cursor-pointer hover:bg-blush"
            onClick={() => shiftMonth(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {weekdays.map((day) => (
            <span key={day} aria-hidden="true" className="py-1 text-xs text-ink/65">
              {day}
            </span>
          ))}
          {Array.from({ length: month.getUTCDay() }, (_, index) => (
            <span key={`blank-${index}`} />
          ))}
          {Array.from({ length: dayCount }, (_, index) => {
            const day = new Date(Date.UTC(year, monthIndex, index + 1));
            const isoDate = day.toISOString().slice(0, 10);
            const available =
              isoDate >= today && (!roomRental || (day.getUTCDay() >= 1 && day.getUTCDay() <= 4));
            return (
              <button
                key={isoDate}
                type="button"
                aria-label={dateLabel.format(day)}
                aria-pressed={value === isoDate}
                aria-current={isoDate === today ? "date" : undefined}
                disabled={!available}
                className="min-h-9 cursor-pointer rounded-sm text-sm hover:bg-blush focus-visible:outline-2 focus-visible:outline-terracotta aria-pressed:bg-ink aria-pressed:text-white! disabled:cursor-default disabled:opacity-30"
                onClick={() => {
                  onChange(isoDate);
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
