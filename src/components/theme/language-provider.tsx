
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "zh" | "en";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLanguage = "zh",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage with error handling
    try {
      const storedLanguage = localStorage.getItem("language") as Language;
      return storedLanguage || defaultLanguage;
    } catch (error) {
      console.warn("Failed to read language from localStorage:", error);
      return defaultLanguage;
    }
  });

  // Update localStorage when language changes
  useEffect(() => {
    try {
      localStorage.setItem("language", language);
    } catch (error) {
      console.warn("Failed to save language to localStorage:", error);
    }
  }, [language]);

  const value = React.useMemo(() => ({
    language,
    setLanguage,
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
