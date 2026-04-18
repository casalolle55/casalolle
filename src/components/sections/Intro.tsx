import { useTranslations } from "next-intl";

export default function Intro() {
  const t = useTranslations("intro");

  const highlights = [
    t("bedrooms"),
    t("bathrooms"),
    t("pool"),
    t("sleeps"),
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg md:text-xl leading-relaxed text-foreground/80 text-balance">
          {t("text")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {highlights.map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-sm tracking-wide text-accent">
              {i > 0 && <span className="text-stone">&middot;</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
