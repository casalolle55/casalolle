import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/hero-pool-sunset.jpg"
        alt="Casa Lolle pool at sunset with mountain views"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-4 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-lg md:text-2xl font-light mb-2 max-w-2xl text-balance">
          {t("subtitle")}
        </p>
        <p className="text-sm md:text-base text-white/70 mb-10 tracking-widest uppercase">
          {t("location")}
        </p>
        <a
          href="#availability"
          className="inline-block bg-accent hover:bg-accent/90 text-white px-8 py-4 text-sm tracking-widest uppercase transition-colors"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
