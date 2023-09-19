import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useQuery } from "react-query";
import { getPartners } from "../api";
import PartnersBalance, { PartnersBalanceFallback } from "./partners-balance";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import PartnersSettings from "./tabs-container/partners-settings";
import PartnersReferrals from "./tabs-container/partners-referrals";
import PartnersTransactions from "./tabs-container/partners-transactions";
export interface ViewProps {
  inContainer?: boolean;
}
export const View: React.FC<ViewProps> = ({ inContainer }) => {
  const { t } = useTranslation();

  const {
    data: partnersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      return getPartners();
    },
  });

  if (isLoading || isError || !partnersData) {
    return <PartnersBalanceFallback type={isLoading ? "loading" : "error"} />;
  }

  const { earned, referrals, percent, currency } = partnersData;

  const TAB_ITEMS = [
    {
      value: "settings",
      children: t("common:settings"),
    },
    {
      value: "referrals",
      children: t("partners:referrals"),
    },
    {
      value: "payments",
      children: t("partners:title"),
    },
  ];

  return (
    <div
      className={
        cn("custom-scroll-bar h-full w-full md:rounded-lg md:border md:border-neutral-200") +
        " " +
        cn(inContainer ? "rounded-lg border p-5 text-typography-primary" : "p-10")
      }
    >
      <div
        className={cn(
          inContainer
            ? "gap flex flex-col justify-between"
            : "xs:flex-col flex flex-col justify-between gap-10 sm:flex-row md:flex-col lg:flex-row xl:flex-row"
        )}
      >
        <div
          className={cn(
            inContainer
              ? "w-[100%]"
              : "xs:w-[100%] w-[100%] sm:w-[100%] md:w-[100%] lg:w-[50%] xl:w-[40%]"
          )}
        >
          <PartnersBalance
            earned={earned}
            referrals={referrals}
            percent={percent}
            currency={currency}
            isLoading={isLoading}
            isError={isError}
          />
          <div
            className={cn(
              "item-center mb-4 mt-3 flex justify-center rounded-xl border border-primary bg-primary bg-opacity-10 px-3 py-2 font-medium"
            )}
          >
            <ExclamationCircleIcon className="mr-2 h-5 w-5 text-primary" />
            <p className="text-center text-sm text-primary">
              {t("partners:description", { percent: percent ?? 0 })}
            </p>
          </div>
        </div>
        <div
          className={cn(
            inContainer
              ? "w-[100%]"
              : "xs:w-[100%] w-[100%] sm:w-[100%] md:w-[100%] lg:w-[50%] xl:w-[50%]"
          )}
        >
          <Tabs defaultValue="settings">
            <TabsList className="flex" aria-label="Partners tabs">
              {TAB_ITEMS.map(({ value, children }) => (
                <TabItem value={value} key={value}>
                  {children}
                </TabItem>
              ))}
            </TabsList>
            <TabsContent className="grow rounded-b-md bg-white p-5 outline-none" value="settings">
              <PartnersSettings />
            </TabsContent>
            <TabsContent className="grow rounded-b-md bg-white outline-none" value="referrals">
              <PartnersReferrals />
            </TabsContent>
            <TabsContent className="grow rounded-b-md bg-white outline-none" value="payments">
              <PartnersTransactions />
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
