import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import VacationCalendar from "./calendar-vacation";
import { Tooltip } from "antd";
import { PropsVacations } from "../types";
import { getVacations } from "../api";
import { useQuery } from "react-query";
import StepsVacation from "./steps";
export interface ViewProps {
  inContainer?: boolean;
}
export const View: React.FC<ViewProps> = ({ inContainer }) => {
  const { t } = useTranslation();
  const { data: vacations } = useQuery<PropsVacations>(["vacations"], () => getVacations());
  const TAB_ITEMS = [
    {
      value: "vacation",
      children: t("vacation:vacation"),
    },
    {
      value: "history_vacation",
      children: t("vacation:history_vacation"),
    },
  ];

  return (
    <div
      className={cn(
        "custom-scroll-bar h-full w-full p-10 md:rounded-lg md:border md:border-neutral-200"
      )}
    >
      <div className={cn("gap flex flex-col justify-between")}>
        <Tabs defaultValue="vacation">
          <TabsList className="flex" aria-label="Vacation tabs">
            {TAB_ITEMS.map(({ value, children }) => (
              <TabItem value={value} key={value}>
                {children}
              </TabItem>
            ))}
          </TabsList>
          <TabsContent className="grow rounded-b-md bg-white p-5 outline-none" value="vacation">
            <VacationCalendar vacations={vacations} />
          </TabsContent>
          <TabsContent className="grow rounded-b-md bg-white outline-none" value="history_vacation">
            {vacations && vacations.currentVacation && vacations.vacationsList && (
              <StepsVacation limit={10} data={vacations} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const TabItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  const { t } = useTranslation();
  const isHistory = value === "history_vacation";
  //   // <Tooltip title={t("common:coming_soon")} color="#0066ff">
  return (
    <TabsTrigger
      className={`flex flex-1 cursor-pointer  items-center justify-center bg-white px-5 py-3 text-sm text-primary hover:font-medium data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-primary`}
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};
