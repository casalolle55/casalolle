import { useTranslations } from "next-intl";
import Image from "next/image";

const sections = [
  { key: "living" as const, image: "/images/living-room-tulips.jpg", alt: "Living room with tulips and pool view" },
  { key: "bedroom" as const, image: "/images/bedroom-mountain-view.jpg", alt: "Bedroom with panoramic mountain view" },
  { key: "kitchen" as const, image: "/images/kitchen-stone-walls.jpg", alt: "Kitchen with stone walls and purple backsplash" },
  { key: "pool" as const, image: "/images/pool-crystal-clear.jpg", alt: "Crystal clear private pool with mountain backdrop" },
];

export default function PropertySection() {
  const t = useTranslations("property");

  return (
    <section id="property" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-20">
          {t("title")}
        </h2>
        <div className="space-y-24">
          {sections.map((section, i) => (
            <div
              key={section.key}
              className={`flex flex-col gap-8 md:gap-16 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-serif text-3xl">{t(`${section.key}.title`)}</h3>
                <p className="text-foreground/70 leading-relaxed text-lg">
                  {t(`${section.key}.text`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
