import { useTranslations } from "next-intl";

export default function LocationMap() {
  const t = useTranslations("location");

  const distances = [
    "bagni",
    "lucca",
    "pisa",
    "station",
    "supermarket",
    "parking",
  ] as const;

  return (
    <section className="py-24 px-6 bg-stone/30">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[4/3] md:aspect-auto md:min-h-[400px] rounded-sm overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.5!2d10.555!3d44.015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d58f0000000001%3A0x1!2sFabbriche+di+Casabasciana%2C+Bagni+di+Lucca!5e0!3m2!1sen!2sit!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Casa Lolle location"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-serif text-2xl mb-2">{t("address")}</h3>
            <p className="text-foreground/60 mb-8">{t("region")}</p>
            <ul className="space-y-4">
              {distances.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-accent mt-1 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-foreground/70">{t(`distances.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
