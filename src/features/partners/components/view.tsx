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
import { QrCode } from "./qr-code";
import { boolean } from "zod";
export interface ViewProps {
  inContainer?: boolean;
}
export const View: React.FC<ViewProps> = ({ inContainer }) => {
  const { t } = useTranslation();

  const TAB_ITEMS = [
    {
      value: "referrals",
      children: t("partners:referrals"),
    },
    {
      value: "payments",
      children: t("partners:transactions:title"),
    },
  ];

  const TAB_QR = [{ value: "qrCode", children: t("partners:download_qr") }];

  return (
    <div
      className={
        cn("custom-scroll-bar h-full w-full md:rounded-lg md:border md:border-neutral-200") +
        " " +
        cn(inContainer ? "rounded-lg border p-1 text-typography-primary" : "p-10")
      }
    >
      <div
        className={cn(
          inContainer
            ? "gap flex flex-col justify-between"
            : "xs:flex-col flex flex-col justify-between gap-10 sm:flex-row md:flex-col lg:flex-row xl:flex-row"
        )}
      >
        {!inContainer && <QrCode inContainer={inContainer} />}
        <div
          className={cn(
            inContainer
              ? "w-[100%]"
              : "xs:w-[100%] w-[100%] sm:w-[100%] md:w-[100%] lg:w-[50%] xl:w-[50%]"
          )}
        >
          <Tabs defaultValue={inContainer ? "qrCode" : "referrals"}>
            <TabsList className="flex" aria-label="Partners tabs">
              {inContainer &&
                TAB_QR.map(({ value, children }) => (
                  <TabItem value={value} key={value} inContainer={inContainer}>
                    {children}
                  </TabItem>
                ))}
              {TAB_ITEMS.map(({ value, children }) => (
                <TabItem value={value} key={value} inContainer={inContainer}>
                  {children}
                </TabItem>
              ))}
            </TabsList>
            {inContainer && (
              <TabsContent className="grow rounded-b-md bg-white outline-none" value="qrCode">
                <QrCode inContainer={inContainer} />
              </TabsContent>
            )}

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

const TabItem = ({
  children,
  value,
  inContainer,
}: {
  children: React.ReactNode;
  value: string;
  inContainer?: boolean;
}) => {
  return (
    <TabsTrigger
      className={`flex flex-1 cursor-pointer items-center justify-center bg-white ${
        inContainer ? "px-0.5 py-3" : "px-5 py-3"
      }px-5 py-3 text-sm text-primary hover:font-medium data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-primary`}
      value={value}
    >
      {children}
    </TabsTrigger>
  );
};
