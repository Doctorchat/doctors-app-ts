import React from "react";
import { useTranslation } from "react-i18next";
import { IReferral } from "../types";

type PartnersBalanceProps = {
  earned?: number;
  referrals?: IReferral[];
  percent?: number;
  currency?: string;
};

const PartnersBalance = (props: PartnersBalanceProps) => {

  const { earned, referrals, percent, currency } = props;

  const { t } = useTranslation();

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
  )
}

export default PartnersBalance