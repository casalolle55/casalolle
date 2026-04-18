import Image from "next/image";

const photos = [
  { src: "/images/exterior-hillside.jpg", alt: "Stone cottage on the Tuscan hillside" },
  { src: "/images/pool-house-umbrella.jpg", alt: "Pool with stone house and white umbrella" },
  { src: "/images/living-room-windows.jpg", alt: "Living room with floor-to-ceiling glass walls" },
];

export default function PhotoStrip() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
