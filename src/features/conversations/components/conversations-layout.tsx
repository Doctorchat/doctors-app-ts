import React from "react";

import { useTranslation } from "react-i18next";
import { create } from "zustand";

import { ConversationsList } from "./conversations-list";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { cn } from "@/utils";

export interface ConversationsLayoutStore {
  conversationsType: "patients" | "doctors";
  setConversationsType: (conversationsType: "patients" | "doctors") => void;
}

export const useMainLayoutSidenavStore = create<ConversationsLayoutStore>((set) => ({
  conversationsType: "patients",
  setConversationsType: (conversationsType) => set({ conversationsType }),
}));

export interface ConversationsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ConversationsLayout: React.FC<ConversationsLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  const { t } = useTranslation();

  const conversationsType = useMainLayoutSidenavStore((store) => store.conversationsType);
  const setConversationsType = useMainLayoutSidenavStore((store) => store.setConversationsType);

  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden lg:p-5 lg:pt-0",
        className,
      )}
      {...props}
    >
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
            <TabsTrigger disabled value="doctors">
              {t("conversations:doctors")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden">
        <ConversationsList />
        {children}
      </main>
    </div>
  );
};
