import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui";
import {
  DocAppointmentsList,
  DocAppointmentsSettings,
  DocAppointmentsSlots
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
    }
  ];

  return (
    <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar")}>
      <Tabs
        defaultValue="appointments"
      >
        <TabsList
          className="flex" aria-label="Partners tabs"
        >
          {TAB_ITEMS.map(({ value, children }) => (
            <TabItem
              value={value}
              key={value}
            >
              {children}
            </TabItem>
          ))}
        </TabsList>
        <TabsContent
          className="grow bg-white rounded-b-md outline-none"
          value="settings"
        >
          <DocAppointmentsSettings />
        </TabsContent>
        <TabsContent
          className="grow bg-white rounded-b-md outline-none"
          value="appointments"
        >
          <DocAppointmentsList />
        </TabsContent>
        <TabsContent
          className="grow bg-white rounded-b-md outline-none"
          value="slots"
        >
          <DocAppointmentsSlots />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TabItem = ({ children, value }: { children: React.ReactNode, value: string }) => {
  return (
    <TabsTrigger
      className="bg-white px-5 py-3 flex-1 flex items-center justify-center text-sm text-primary hover:font-medium cursor-pointer data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:text-primary data-[state=active]:font-bold"
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};