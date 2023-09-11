import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { persist, createJSONStorage } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import Notification from "@/components/ui/notification";

export interface LayoutProps {
  children?: React.ReactNode;
}

type TProfileLayout = "personal_info" | "security" | "options";
type TNotififaction = {
  visible: false | true;
  message?: string;
  status?: "success" | "error";
};

export interface LayoutStore {
  profileLayout: TProfileLayout;
  setProfileLayout: (profileLayout: TProfileLayout) => void;
  notification: TNotififaction;
  setNotification: (notification: TNotififaction) => void;
}

export const useProfileLayoutStore = createWithEqualityFn<
  LayoutStore,
  [["zustand/persist", LayoutStore]]
>(
  persist(
    (set) => ({
      profileLayout: "personal_info",
      setProfileLayout: (profileLayout) => set({ profileLayout }),
      notification: {
        visible: false,
        message: "",
        status: "success",
      },
      setNotification: (notification) => set({ notification }),
    }),
    { name: "profile-layout", storage: createJSONStorage(() => localStorage) }
  ),
  shallow
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  const profileLayout = useProfileLayoutStore((store) => store.profileLayout);
  const setProfileLayout = useProfileLayoutStore((store) => store.setProfileLayout);
  const notification = useProfileLayoutStore((store) => store.notification);
  const setNotification = useProfileLayoutStore((store) => store.setNotification);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden lg:p-5 lg:pt-0">
      <header className="2md:px-5 flex h-16 flex-col items-center justify-between overflow-hidden px-1 md:flex-row lg:px-0">
        <h1 className="hidden truncate text-lg font-medium text-typography-primary md:block">
          {t("profile:profile")}
        </h1>
        <Tabs
          defaultValue={profileLayout}
          onValueChange={(value) =>
            setProfileLayout(value as "personal_info" | "security" | "options")
          }
          className="pt-4 sm:pt-0"
        >
          <TabsList>
            <TabsTrigger value="personal_info">{t("profile:personal_info")}</TabsTrigger>
            <TabsTrigger value="options">{t("profile:options")}</TabsTrigger>
            <TabsTrigger value="security">{t("profile:security")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="grid flex-1 grid-cols-12 grid-rows-1 gap-5 overflow-hidden">
        {children}
        <Notification
          open={notification.visible}
          onOpenChange={() => setNotification({ visible: false })}
          type={notification.status}
          description={t(`${notification.message}`)}
        />
      </main>
    </div>
  );
};
