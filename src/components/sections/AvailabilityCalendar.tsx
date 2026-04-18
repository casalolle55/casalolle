"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

type BusyRange = { start: string; end: string };

function expandBusyRanges(ranges: BusyRange[]): Date[] {
  const dates: Date[] = [];
  for (const { start, end } of ranges) {
    const s = new Date(start);
    const e = new Date(end);
    const cur = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    const last = new Date(e.getFullYear(), e.getMonth(), e.getDate());
    // end is exclusive for all-day events; include it only if there's a time component past midnight
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
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function MonthGrid({
  year,
  month,
  bookedDates,
  monthName,
  weekdays,
}: {
  year: number;
  month: number;
  bookedDates: Date[];
  monthName: string;
  weekdays: string[];
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const today = new Date();

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
          const isBooked = bookedDates.some((d) => isSameDay(d, date));
          const isPast =
            date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-sm rounded-sm ${
                isPast
                  ? "text-foreground/20"
                  : isBooked
                  ? "bg-terracotta/80 text-white"
                  : "bg-stone/50 text-foreground/70"
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar() {
  const t = useTranslations("calendar");
  const [offset, setOffset] = useState(0);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

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

  return (
    <section id="availability" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
          {t("title")}
        </h2>
        <p className="text-center text-foreground/60 mb-12">{t("subtitle")}</p>

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setOffset(Math.max(0, offset - 1))}
            disabled={offset === 0}
            className="p-2 text-foreground/40 hover:text-foreground disabled:opacity-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setOffset(offset + 1)}
            className="p-2 text-foreground/40 hover:text-foreground"
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
          />
          <MonthGrid
            year={month2.getFullYear()}
            month={month2.getMonth()}
            bookedDates={bookedDates}
            monthName={getMonthName(month2)}
            weekdays={weekdays}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-terracotta/80" />
            {t("booked")}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-stone/50" />
            {t("available")}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-foreground/50 space-y-1">
          <p>{t("checkIn")} / {t("checkOut")}</p>
          <p>{t("minStay")}</p>
        </div>
      </div>
    </section>
  );
}
