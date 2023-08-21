import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useQuery } from "react-query";
import { getPartners } from "../api";
import PartnersBalance from "./PartnersBalance";


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

  if (isLoading || !partnersData) {
    return <div>Loading...</div>;
  };

  if (isError) {
    return <div>Error</div>;
  };

  const { earned, referrals, percent, currency } = partnersData;

  return (
    <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar")}>
      <PartnersBalance
        earned={earned}
        referrals={referrals}
        percent={percent}
        currency={currency}
      />
    </div>
  );
};
