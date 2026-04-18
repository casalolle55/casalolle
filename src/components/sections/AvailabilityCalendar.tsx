"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useBookingSelection } from "@/components/BookingSelectionProvider";

type BusyRange = { start: string; end: string };

function expandBusyRanges(ranges: BusyRange[]): Date[] {
  const dates: Date[] = [];
  for (const { start, end } of ranges) {
    const s = new Date(start);
    const e = new Date(end);
    const cur = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    const last = new Date(e.getFullYear(), e.getMonth(), e.getDate());
    const endExclusive = /T00:00:00/.test(end) || !/T/.test(end);
    while (cur < last || (!endExclusive && cur.getTime() === last.getTime())) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }
  return dates;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function MonthGrid({
  year,
  month,
  bookedDates,
  monthName,
  weekdays,
  checkIn,
  checkOut,
  onDayClick,
}: {
  year: number;
  month: number;
  bookedDates: Date[];
  monthName: string;
  weekdays: string[];
  checkIn: Date | null;
  checkOut: Date | null;
  onDayClick: (d: Date) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const today = new Date();
  const todayStart = startOfDay(today);

  const inTime = checkIn ? startOfDay(checkIn).getTime() : null;
  const outTime = checkOut ? startOfDay(checkOut).getTime() : null;

  return (
    <div>
      <h3 className="text-center font-serif text-xl mb-4">
        {monthName} {year}
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs text-foreground/50 pb-2">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1);
          const dayTime = date.getTime();
          const isBooked = bookedDates.some((d) => isSameDay(d, date));
          const isPast = date < todayStart;
          const isCheckIn = inTime !== null && dayTime === inTime;
          const isCheckOut = outTime !== null && dayTime === outTime;
          const isInRange =
            inTime !== null && outTime !== null && dayTime > inTime && dayTime < outTime;

          const disabled = isPast || isBooked;

          let cls = "aspect-square flex items-center justify-center text-sm rounded-sm transition-colors";
          if (isPast) {
            cls += " text-foreground/20 cursor-default";
          } else if (isBooked) {
            cls += " bg-terracotta/80 text-white cursor-not-allowed";
          } else if (isCheckIn || isCheckOut) {
            cls += " bg-accent text-white font-medium";
          } else if (isInRange) {
            cls += " bg-accent/25 text-foreground";
          } else {
            cls += " bg-stone/50 text-foreground/70 hover:bg-stone cursor-pointer";
          }

          return (
            <button
              type="button"
              key={i}
              disabled={disabled}
              onClick={() => onDayClick(date)}
              className={cls}
              aria-label={`${date.toDateString()}${isBooked ? " (booked)" : ""}`}
              aria-pressed={isCheckIn || isCheckOut}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar() {
  const t = useTranslations("calendar");
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const { checkIn, checkOut, pickDate, clear } = useBookingSelection();

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data: { busy?: BusyRange[] }) => {
        if (data.busy) setBookedDates(expandBusyRanges(data.busy));
      })
      .catch(() => {});
  }, []);

  const now = new Date();
  const month1 = new Date(now.getFullYear(), now.getMonth() + offset);
  const month2 = new Date(now.getFullYear(), now.getMonth() + offset + 1);

  const weekdays = Array.from({ length: 7 }, (_, i) => t(`weekdays.${i}`));
  const getMonthName = (d: Date) => t(`months.${d.getMonth()}`);

  const fmtDate = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const nights =
    checkIn && checkOut
      ? Math.round(
          (startOfDay(checkOut).getTime() - startOfDay(checkIn).getTime()) / 86400000
        )
      : 0;

  const handleDayClick = (d: Date) => pickDate(d, bookedDates);

  return (
    <section id="availability" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
          {t("title")}
        </h2>
        <p className="text-center text-foreground/60 mb-4">{t("subtitle")}</p>
        <p className="text-center text-sm text-foreground/50 mb-10">{t("selectPrompt")}</p>

        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, offset - 1))}
            disabled={offset === 0}
            className="p-2 text-foreground/40 hover:text-foreground disabled:opacity-20"
            aria-label="Previous months"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setOffset(offset + 1)}
            className="p-2 text-foreground/40 hover:text-foreground"
            aria-label="Next months"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <MonthGrid
            year={month1.getFullYear()}
            month={month1.getMonth()}
            bookedDates={bookedDates}
            monthName={getMonthName(month1)}
            weekdays={weekdays}
            checkIn={checkIn}
            checkOut={checkOut}
            onDayClick={handleDayClick}
          />
          <MonthGrid
            year={month2.getFullYear()}
            month={month2.getMonth()}
            bookedDates={bookedDates}
            monthName={getMonthName(month2)}
            weekdays={weekdays}
            checkIn={checkIn}
            checkOut={checkOut}
            onDayClick={handleDayClick}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-accent" />
            {t("selected")}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-terracotta/80" />
            {t("booked")}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-stone/50" />
            {t("available")}
          </div>
        </div>

        {checkIn && (
          <div className="mt-8 text-center text-sm">
            <p className="text-foreground/80">
              {fmtDate.format(checkIn)}
              {checkOut && (
                <>
                  {" → "}
                  {fmtDate.format(checkOut)}
                  <span className="text-foreground/50">
                    {" · "}
                    {t("nights", { count: nights })}
                  </span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground underline underline-offset-4"
            >
              {t("clearSelection")}
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-foreground/50 space-y-1">
          <p>{t("checkIn")} / {t("checkOut")}</p>
          <p>{t("minStay")}</p>
        </div>
      </div>
    </section>
  );
}
