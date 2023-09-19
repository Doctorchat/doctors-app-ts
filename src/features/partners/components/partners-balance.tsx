import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { IReferral } from "../types";
import { Skeleton } from "@/components/ui";

type PartnersBalanceProps = {
  earned?: number;
  referrals?: IReferral[];
  percent?: number;
  currency?: string;
  isLoading?: boolean;
  isError?: boolean;
};

const PartnersBalance = (props: PartnersBalanceProps) => {
  const { t } = useTranslation();
  const {
    earned,
    referrals,
    percent,
    currency,
  } = props;

  return (
    <div>
      <div className="wallet-balance space-x-2 flex justify-between items-center w-[100%]">
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners:bonus_balance")}</p>
          <h3 className="text-2xl text-black opacity-85 font-medium">{earned} {currency}</h3>
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners:active_referrals")}</p>
          <h3 className="text-2xl text-black opacity-85 font-medium">{referrals?.length ?? 0}</h3>
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners:discount_percent")}</p>
          <h3 className="text-2xl text-black opacity-85 font-medium">{percent ?? 0} %</h3>
        </div>
      </div>
    </div>
  );
};

type PartnersBalanceFallbackProps = {
  type?: "loading" | "error";
};

export const PartnersBalanceFallback: FC<PartnersBalanceFallbackProps> = memo(({ type = "loading" }) => {
  const { t } = useTranslation();
  return (
    <div className="col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar">
      <div className="wallet-balance space-x-2 flex justify-between items-center w-[100%]">
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners:bonus_balance")}</p>
          {type === "loading" ? <Skeleton className="h-8 w-24 mt-1" /> : <h3 className="text-2xl">-</h3>}
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners:active_referrals")}</p>
          {type === "loading" ? <Skeleton className="h-8 w-24 mt-1" /> : <h3 className="text-2xl">-</h3>}
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("partners:discount_percent")}</p>
          {type === "loading" ? <Skeleton className="h-8 w-24 mt-1" /> : <h3 className="text-2xl">-</h3>}
        </div>
      </div>
      <div>
        <Skeleton className="h-[250px] w-full mt-3" />
      </div>
    </div>
  );
});

export default PartnersBalance;