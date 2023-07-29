import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// declare module "i18next" {
//   interface CustomTypeOptions {
//     defaultNS: "common";
//     returnNull: false;
//   }
// }

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ["common", "auth"],
    supportedLngs: ["ro", "ru"],
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
