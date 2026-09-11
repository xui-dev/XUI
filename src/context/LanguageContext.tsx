"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

type Locale = "en" | "ar";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any;
}

const messagesMap = {
  en: enMessages,
  ar: arMessages,
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  dir: "ltr",
  messages: enMessages,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = messagesMap[locale] || enMessages;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, messages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
