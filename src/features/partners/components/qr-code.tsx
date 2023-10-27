import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useQuery } from "react-query";
import { getPartners } from "../api";
import PartnersBalance, { PartnersBalanceFallback } from "./partners-balance";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import PartnersSettings from "./tabs-container/partners-settings";

export interface ViewProps {
  inContainer?: boolean;
}

export const QrCode: React.FC<ViewProps> = ({ inContainer }) => {
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
  return (
    <div
      className={cn(
        inContainer
          ? "w-[100%] px-2 py-1"
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
      <PartnersSettings screen={true}/>
    </div>
  );
};
