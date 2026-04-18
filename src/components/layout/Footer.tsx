import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-foreground text-background/80 py-12">
      <div className="mx-auto max-w-7xl px-6 text-center space-y-3">
        <p className="font-serif text-xl text-background">Casa Lolle</p>
        <p className="text-sm">{t("location")}</p>
        <div className="text-xs space-y-1 text-background/50">
          <p>CIN: IT0446002LTN0279 &middot; CIR: 046002LTN0279</p>
          <p>&copy; {new Date().getFullYear()} Casa Lolle</p>
        </div>
      </div>
    </footer>
  );
}
