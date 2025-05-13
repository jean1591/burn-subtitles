"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, type Language } from "@/contexts/languageContext";

const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  de: "🇩🇪",
};

export function LanguageSwitcher() {
  const { locale, setLocale, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = (language: Language) => {
    setLocale(language);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:cursor-pointer"
        >
          <span className="text-lg">{languageFlags[locale]}</span>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { name }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleSelect(code as Language)}
            className={locale === code ? "bg-amber-50 font-medium" : ""}
          >
            <span className="mr-2">{languageFlags[code as Language]}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
