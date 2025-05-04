"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const languages = [
  { id: "en", name: "English" },
  { id: "fr", name: "French" },
  { id: "pt", name: "Portuguese" },
  { id: "es", name: "Spanish" },
  { id: "de", name: "German" },
  { id: "it", name: "Italian" },
];

export function LanguageSelector({
  onChange,
}: {
  onChange?: (languages: string[]) => void;
}) {
  const [, setSelectedLanguages] = useState<string[]>([]);

  const handleLanguageChange = (language: string, checked: boolean) => {
    setSelectedLanguages((prev) => {
      const newSelection = checked
        ? [...prev, language]
        : prev.filter((lang) => lang !== language);

      if (onChange) {
        onChange(newSelection);
      }

      return newSelection;
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {languages.map((language) => (
        <div key={language.id} className="flex items-center space-x-2">
          <Checkbox
            id={language.id}
            onCheckedChange={(checked) =>
              handleLanguageChange(language.id, checked === true)
            }
          />
          <Label
            htmlFor={language.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {language.name}
          </Label>
        </div>
      ))}
    </div>
  );
}
