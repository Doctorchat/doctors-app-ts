import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { persist, createJSONStorage } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { List } from "./list";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useLocation } from "react-router-dom";

export interface LayoutStore {
  conversationsType: "patients" | "doctors";
  setConversationsType: (conversationsType: "patients" | "doctors") => void;
}

export const useConversationLayoutStore = createWithEqualityFn<
  LayoutStore,
  [["zustand/persist", LayoutStore]]
>(
  persist(
    (set) => ({
      conversationsType: "patients",
      setConversationsType: (conversationsType) => set({ conversationsType }),
    }),
    { name: "conversations-layout", storage: createJSONStorage(() => localStorage) }
  ),
  shallow
);

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const setConversationsType = useConversationLayoutStore((store) => store.setConversationsType);
  const navigation = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(navigation.search);
    const type = searchParams.get("doctorId") ? "doctors" : "patients";
    setConversationsType(type);
  }, [navigation]);
  return (
    <div className="mx-auto flex h-full w-full  flex-col overflow-hidden lg:p-5 lg:pt-0">
      <header className="flex h-16 items-center justify-between overflow-hidden px-5 lg:px-0">
        <h1 className="truncate text-lg font-medium text-typography-primary">
          {t("conversations:recent_conversations")}
        </h1>
        <Tabs
          defaultValue={conversationsType}
          onValueChange={(value) => setConversationsType(value as "patients" | "doctors")}
          className="ml-2"
        >
          <TabsList>
            <TabsTrigger value="patients">{t("conversations:patients")}</TabsTrigger>
            <TabsTrigger value="doctors">{t("conversations:doctors")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden">
        <List />
        {children}
      </main>
    </div>
  );
};
