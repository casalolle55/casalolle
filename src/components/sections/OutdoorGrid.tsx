import { useTranslations } from "next-intl";
import Image from "next/image";

const photos = [
  { src: "/images/terrace-mosaic-table.jpg", alt: "Mosaic table on terrace with mountain view" },
  { src: "/images/outdoor-lounge.jpg", alt: "Outdoor lounge chairs under umbrella" },
  { src: "/images/pool-sunset-loungers.jpg", alt: "Pool loungers at golden hour" },
  { src: "/images/pergola-dining.jpg", alt: "Pergola dining area with hillside steps" },
];

export default function OutdoorGrid() {
  const t = useTranslations("outdoor");

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
