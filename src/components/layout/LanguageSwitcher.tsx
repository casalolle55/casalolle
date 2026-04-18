"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  nl: "NL",
  de: "DE",
  fr: "FR",
};

export default function LanguageSwitcher({ scrolled }: { scrolled: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            loc === locale
              ? "bg-accent text-white"
              : scrolled
              ? "text-foreground/60 hover:text-foreground"
              : "text-white/60 hover:text-white"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
