import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import PhotoStrip from "@/components/sections/PhotoStrip";
import PropertySection from "@/components/sections/PropertySection";
import ImageBreak from "@/components/sections/ImageBreak";
import OutdoorGrid from "@/components/sections/OutdoorGrid";
import Amenities from "@/components/sections/Amenities";
import AvailabilityCalendar from "@/components/sections/AvailabilityCalendar";
import LocationMap from "@/components/sections/LocationMap";
import ThingsToDo from "@/components/sections/ThingsToDo";
import ContactForm from "@/components/sections/ContactForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Intro />
      <PhotoStrip />
      <PropertySection />
      <ImageBreak
        src="/images/pool-panorama.jpg"
        alt="Panoramic view of pool and mountains"
      />
      <OutdoorGrid />
      <Amenities />
      <AvailabilityCalendar />
      <LocationMap />
      <ThingsToDo />
      <ImageBreak
        src="/images/garden-path.jpg"
        alt="Garden path overlooking the property"
      />
      <ContactForm />
    </>
  );
}
