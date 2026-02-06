"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/">
          <Image src="/logo.svg" alt="Pollio" width={120} height={40} priority />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">
            {t.header.pricing}
          </a>
          <a href="/login" className="text-text-secondary hover:text-text-primary transition-colors">
            {t.header.login}
          </a>
          <a
            href="/signup"
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            {t.header.getStarted}
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <a
            href="/signup"
            className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
          >
            {t.header.getStarted}
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-surface shadow-lg">
          <div className="flex flex-col p-6 space-y-4">
            <a
              href="#pricing"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-text-primary hover:text-primary transition-colors py-2"
            >
              {t.header.pricing}
            </a>
            <a
              href="/blogg"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-text-primary hover:text-primary transition-colors py-2"
            >
              {t.header.blog}
            </a>
            <a
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-text-primary hover:text-primary transition-colors py-2"
            >
              {t.header.login}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
