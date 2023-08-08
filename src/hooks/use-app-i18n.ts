import React from "react";

import { useTranslation } from "react-i18next";

import { AppLocale } from "@/types";

export const useAppI18n = () => {
  const { i18n } = useTranslation();

  const setLanguage = React.useCallback(
    (locale: AppLocale) => {
      i18n.changeLanguage(locale);
    },
    [i18n],
  );

  return {
    locale: i18n.language.split("-")[0] as AppLocale,
    setLanguage,
  };
};
