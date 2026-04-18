import Image from "next/image";

export default function ImageBreak({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
