import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import type { GalleryImage } from "@/components/gallery/MasonryGrid";

const galleryImages: GalleryImage[] = [
  { src: "/images/pool-panorama.jpg", alt: "Panoramic pool with mountain views" },
  { src: "/images/exterior-hillside.jpg", alt: "Stone cottage on the Tuscan hillside" },
  { src: "/images/living-room-windows.jpg", alt: "Living room with floor-to-ceiling glass" },
  { src: "/images/bedroom-mountain-view.jpg", alt: "Bedroom with mountain panorama" },
  { src: "/images/pool-house-umbrella.jpg", alt: "Pool and stone house with umbrella" },
  { src: "/images/terrace-mosaic-table.jpg", alt: "Mosaic table on terrace" },
  { src: "/images/living-room-tulips.jpg", alt: "Living room with tulips and pool view" },
  { src: "/images/kitchen-stone-walls.jpg", alt: "Kitchen with stone walls" },
  { src: "/images/pool-sunset-loungers.jpg", alt: "Pool loungers at golden hour" },
  { src: "/images/bedroom-wide.jpg", alt: "Spacious bedroom with mountain view" },
  { src: "/images/outdoor-lounge.jpg", alt: "Outdoor lounge chairs" },
  { src: "/images/bathroom-shower.jpg", alt: "Modern bathroom with glass shower" },
  { src: "/images/dining-room.jpg", alt: "Dining area with wooden hutch and stone wall" },
  { src: "/images/pergola-dining.jpg", alt: "Pergola dining area" },
  { src: "/images/pool-crystal-clear.jpg", alt: "Crystal clear pool" },
  { src: "/images/window-view-olives.jpg", alt: "Window view with olives" },
  { src: "/images/terrace-bistro.jpg", alt: "Bistro table on terrace" },
  { src: "/images/garden-path.jpg", alt: "Garden path through trees" },
  { src: "/images/bedroom-interior.jpg", alt: "Bedroom interior" },
  { src: "/images/terrace-wide-mosaic.jpg", alt: "Terrace with mosaic table" },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-serif text-4xl md:text-5xl">{t("title")}</h1>
          <Link
            href="/"
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            &larr; {t("back")}
          </Link>
        </div>
        <MasonryGrid images={galleryImages} />
      </div>
    </div>
  );
}
