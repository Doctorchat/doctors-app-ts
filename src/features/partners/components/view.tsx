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

export const View: React.FC = () => {
  const { t } = useTranslation();

  const {
    data: partnersData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      return getPartners();
    },
  });

  if (isLoading || isError || !partnersData) {
    return <PartnersBalanceFallback type={isLoading ? "loading" : "error"} />
  };

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
    }
  ];

  return (
    <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar")}>
      <PartnersBalance
        earned={earned}
        referrals={referrals}
        percent={percent}
        currency={currency}
        isLoading={isLoading}
        isError={isError}
      />
      <div className={cn("flex item-center justify-center mb-4 mt-3 border border-primary bg-primary bg-opacity-10 px-3 py-2 rounded-xl font-medium")}>
        <ExclamationCircleIcon
          className="text-primary w-5 h-5 mr-2"
        />
        <p className="text-sm text-primary text-center">{t("partners:description", { percent: percent ?? 0 })}</p>
      </div>

      <Tabs
        defaultValue="settings"
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
          className="grow p-5 bg-white rounded-b-md outline-none"
          value="settings"
        >
          <PartnersSettings />
        </TabsContent>
        <TabsContent
          className="grow bg-white rounded-b-md outline-none"
          value="referrals"
        >
          <PartnersReferrals />
        </TabsContent>
        <TabsContent
          className="grow bg-white rounded-b-md outline-none"
          value="payments"
        >
          <PartnersTransactions />
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