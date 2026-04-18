"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState, useEffect } from "react";

export default function Navigation() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className={`font-serif text-2xl font-bold transition-colors ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          Casa Lolle
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#property"
            className={`text-sm tracking-wide transition-colors hover:text-accent ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            {t("property")}
          </a>
          <Link
            href="/gallery"
            className={`text-sm tracking-wide transition-colors hover:text-accent ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            {t("gallery")}
          </Link>
          <a
            href="#contact"
            className={`text-sm tracking-wide transition-colors hover:text-accent ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            {t("contact")}
          </a>
          <LanguageSwitcher scrolled={scrolled} />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 ${scrolled ? "text-foreground" : "text-white"}`}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-stone px-6 py-4 space-y-4">
          <a href="#property" onClick={() => setMenuOpen(false)} className="block text-sm tracking-wide text-foreground hover:text-accent">
            {t("property")}
          </a>
          <Link href="/gallery" onClick={() => setMenuOpen(false)} className="block text-sm tracking-wide text-foreground hover:text-accent">
            {t("gallery")}
          </Link>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-sm tracking-wide text-foreground hover:text-accent">
            {t("contact")}
          </a>
          <LanguageSwitcher scrolled={true} />
        </div>
      )}
    </nav>
  );
}
