"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { IntlProvider } from "react-intl";

// Import all language files
import enMessages from "@/locales/en.json";
import esMessages from "@/locales/es.json";
import frMessages from "@/locales/fr.json";
import itMessages from "@/locales/it.json";
import deMessages from "@/locales/de.json";

// Define available languages
export type Language = "en" | "es" | "fr" | "it" | "de";

export const languages = {
  en: { name: "English", messages: enMessages },
  es: { name: "Español", messages: esMessages },
  fr: { name: "Français", messages: frMessages },
  it: { name: "Italiano", messages: itMessages },
  de: { name: "Deutsch", messages: deMessages },
};

type LanguageContextType = {
  locale: Language;
  setLocale: (locale: Language) => void;
  languages: typeof languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to English, but check localStorage for saved preference
  const [locale, setLocale] = useState<Language>("en");

  // Load saved language preference on client side
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Language;
    if (savedLocale && languages[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const value = {
    locale,
    setLocale,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider
        locale={locale}
        messages={languages[locale].messages}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}
