"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Selection = {
  checkIn: Date | null;
  checkOut: Date | null;
};

type Ctx = Selection & {
  pickDate: (d: Date, bookedDates: Date[]) => void;
  setCheckInManual: (d: Date | null) => void;
  setCheckOutManual: (d: Date | null) => void;
  clear: () => void;
};

const BookingSelectionContext = createContext<Ctx | null>(null);

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function rangeContainsAny(fromInclusive: Date, toExclusive: Date, dates: Date[]) {
  const from = startOfDay(fromInclusive).getTime();
  const to = startOfDay(toExclusive).getTime();
  return dates.some((d) => {
    const t = startOfDay(d).getTime();
    return t >= from && t < to;
  });
}

export function dateToISO(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoToDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function BookingSelectionProvider({ children }: { children: React.ReactNode }) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const pickDate = useCallback(
    (d: Date, bookedDates: Date[]) => {
      const clicked = startOfDay(d);

      if (!checkIn) {
        setCheckIn(clicked);
        return;
      }

      if (checkIn && !checkOut) {
        const inTime = startOfDay(checkIn).getTime();
        const clickedTime = clicked.getTime();

        if (clickedTime === inTime) {
          return;
        }

        if (clickedTime < inTime) {
          setCheckIn(clicked);
          return;
        }

        if (rangeContainsAny(checkIn, clicked, bookedDates)) {
          setCheckIn(clicked);
          setCheckOut(null);
          return;
        }

        setCheckOut(clicked);
        return;
      }

      setCheckIn(clicked);
      setCheckOut(null);
    },
    [checkIn, checkOut]
  );

  const clear = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      checkIn,
      checkOut,
      pickDate,
      setCheckInManual: setCheckIn,
      setCheckOutManual: setCheckOut,
      clear,
    }),
    [checkIn, checkOut, pickDate, clear]
  );

  return (
    <BookingSelectionContext.Provider value={value}>
      {children}
    </BookingSelectionContext.Provider>
  );
}

export function useBookingSelection(): Ctx {
  const ctx = useContext(BookingSelectionContext);
  if (!ctx) {
    throw new Error("useBookingSelection must be used inside BookingSelectionProvider");
  }
  return ctx;
}
