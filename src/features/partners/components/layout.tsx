import React from "react";
import { useTranslation } from "react-i18next";

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex h-full w-full  flex-col overflow-hidden lg:p-5 lg:pt-0">
      <header className="flex h-16 items-center justify-between overflow-hidden px-5 lg:px-0">
        <h1 className="truncate text-lg font-medium text-typography-primary">
          {t("partners:title")}
        </h1>
      </header>
      <main className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden">{children}</main>
    </div>
  );
};
