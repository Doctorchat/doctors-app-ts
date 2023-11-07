import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
  DocAppointmentsList,
  DocAppointmentsSettings,
  DocAppointmentsSlots,
} from "./tabs-container";

export const View: React.FC = () => {
  const { t } = useTranslation();

  const TAB_ITEMS = [
    {
      value: "settings",
      children: t("common:settings"),
    },
    {
      value: "appointments",
      children: t("common:appointments"),
    },
    {
      value: "slots",
      children: t("common:slots"),
    },
  ];

  return (
    <div
      className={cn(
        "custom-scroll-bar col-span-12 h-full w-full p-10 md:col-span-8 md:rounded-lg md:border md:border-neutral-200 xl:col-span-4"
      )}
    >
      <Tabs defaultValue="appointments">
        <TabsList className="flex" aria-label="Partners tabs">
          {TAB_ITEMS.map(({ value, children }) => (
            <TabItem value={value} key={value}>
              {children}
            </TabItem>
          ))}
        </TabsList>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="settings">
          <DocAppointmentsSettings />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="appointments">
          <DocAppointmentsList />
        </TabsContent>
        <TabsContent className="grow rounded-b-md bg-white outline-none" value="slots">
          <DocAppointmentsSlots />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TabItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  return (
    <TabsTrigger
      className="flex flex-1 cursor-pointer items-center justify-center bg-white px-5 py-3 text-sm text-primary hover:font-medium data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-primary"
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};
