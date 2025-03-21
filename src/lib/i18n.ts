import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: [
      "common",
      "auth",
      "conversations",
      "validations",
      "wallet",
      "profile",
      "consultation",
      "partners",
      "video",
      "vacation",
      "survey",
      "notification",
      "medical_centre"
    ],
    supportedLngs: ["ro", "ru", "en"],
    defaultNS: "common",
    load: "languageOnly",
    fallbackLng: "ro",
    returnNull: false,

    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
