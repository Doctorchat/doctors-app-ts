import React from "react";
import { useTranslation } from "react-i18next";

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="m-auto flex h-full w-full  flex-col overflow-hidden lg:p-5 pr-0">
    <main className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden">{children}</main>
  </div>
);
