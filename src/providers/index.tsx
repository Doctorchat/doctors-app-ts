import { ReactNode } from "react";
import { Settings } from "luxon";
import { useTranslation } from "react-i18next";

export const Providers = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  Settings.defaultLocale = i18n.language;

  return children;
};
