import React from "react";

import { useTranslation } from "react-i18next";

import { AppLocale } from "@/types";
import { ro, ru, enUS } from "date-fns/locale";

export const useAppI18n = () => {
  const { i18n } = useTranslation();

  const languages = {
    ro: ro,
    ru: ru,
    en: enUS,
  };
  
  const setLanguage = React.useCallback(
    (locale: AppLocale) => {
      i18n.changeLanguage(locale);
    },
    [i18n],
  );
  
  const locale = (locale: AppLocale) => languages[locale]

  return {
    locale: () => locale(i18n.language as AppLocale),
    setLanguage,
  };
};
