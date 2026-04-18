"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  dateToISO,
  isoToDate,
  useBookingSelection,
} from "@/components/BookingSelectionProvider";

export default function ContactForm() {
  const t = useTranslations("contact");
  const { checkIn, checkOut, setCheckInManual, setCheckOutManual } = useBookingSelection();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      checkIn: dateToISO(checkIn),
      checkOut: dateToISO(checkOut),
      guests: (form.elements.namedItem("guests") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-white border border-stone text-foreground placeholder-foreground/30 text-sm focus:outline-none focus:border-accent transition-colors";

  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
          {t("title")}
        </h2>
        <p className="text-center text-foreground/60 mb-12">{t("subtitle")}</p>

        {status === "success" ? (
          <div className="text-center py-12">
            <p className="text-secondary text-lg">{t("success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              required
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              required
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-foreground/50 mb-1">{t("checkIn")}</label>
                <input
                  type="date"
                  name="checkIn"
                  required
                  value={dateToISO(checkIn)}
                  onChange={(e) => setCheckInManual(isoToDate(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-foreground/50 mb-1">{t("checkOut")}</label>
                <input
                  type="date"
                  name="checkOut"
                  required
                  value={dateToISO(checkOut)}
                  onChange={(e) => setCheckOutManual(isoToDate(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <p className="text-xs text-foreground/50 italic">{t("datesTip")}</p>
            <input
              type="number"
              name="guests"
              placeholder={t("guests")}
              min="1"
              max="4"
              required
              className={inputClass}
            />
            <textarea
              name="message"
              placeholder={t("message")}
              rows={4}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-accent hover:bg-accent/90 text-white py-4 text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "..." : t("submit")}
            </button>
            {status === "error" && (
              <p className="text-red-600 text-sm text-center">{t("error")}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
