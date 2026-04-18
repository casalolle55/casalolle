import { useTranslations } from "next-intl";

const activities = [
  { key: "beaches" as const, icon: "M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15V9a4 4 0 014-4h14a4 4 0 014 4v6" },
  { key: "adventure" as const, icon: "M3 21l6-6m0 0l4-4m-4 4l8-8m-8 8h6m-6 0v6" },
  { key: "culture" as const, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { key: "golf" as const, icon: "M3 21h18M9 8h1m4 0h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" },
  { key: "swimming" as const, icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "winter" as const, icon: "M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15V9a4 4 0 014-4h14a4 4 0 014 4v6" },
  { key: "shopping" as const, icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  { key: "villages" as const, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { key: "dining" as const, icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
] as const;

export default function ThingsToDo() {
  const t = useTranslations("thingsToDo");

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">
          {t("title")}
        </h2>
        <p className="text-center text-foreground/60 mb-16">{t("subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map(({ key, icon }) => (
            <div key={key} className="p-6 rounded-sm bg-stone/20">
              <div className="flex items-center gap-3 mb-3">
                <svg
                  className="w-5 h-5 text-accent shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <h3 className="font-serif text-lg">{t(`${key}.title`)}</h3>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {t(`${key}.text`)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-foreground/50">
          {t("nearby")}
        </p>
      </div>
    </section>
  );
}
