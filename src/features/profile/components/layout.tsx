import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { persist, createJSONStorage } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export interface LayoutProps {
  children?: React.ReactNode;
}

export interface LayoutStore {
  profileLayout: "personal_info" | "security" | "options";
  setProfileLayout: (profileLayout: "personal_info" | "security" | "options") => void;
}

export const useProfileLayoutStore = createWithEqualityFn<
  LayoutStore,
  [["zustand/persist", LayoutStore]]
>(
  persist(
    (set) => ({
      profileLayout: "personal_info",
      setProfileLayout: (profileLayout) => set({ profileLayout }),
    }),
    { name: "profile-layout", storage: createJSONStorage(() => localStorage) }
  ),
  shallow
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  const profileLayout = useProfileLayoutStore((store) => store.profileLayout);
  const setProfileLayout = useProfileLayoutStore((store) => store.setProfileLayout);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden lg:p-5 lg:pt-0">
      <header className="flex h-16 items-center justify-between overflow-hidden px-5 lg:px-0">
        <h1 className="truncate text-lg font-medium text-typography-primary">
          {t("profile:profile")}
        </h1>
        <Tabs
          defaultValue={profileLayout}
          onValueChange={(value) =>
            setProfileLayout(value as "personal_info" | "security" | "options")
          }
          className="ml-2"
        >
          <TabsList>
            <TabsTrigger value="personal_info">{t("profile:personal_info")}</TabsTrigger>
            <TabsTrigger value="options">{t("profile:options")}</TabsTrigger>
            <TabsTrigger value="security">{t("profile:security")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden">{children}</main>
    </div>
  );
};
