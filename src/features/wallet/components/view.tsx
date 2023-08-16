import React from "react";

import { format, parseISO } from "date-fns";
import { ro, ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useAppI18n } from "@/hooks";
import WalletBalance from "./wallet-balance";
import WalletBalanceHistory from "./wallet-balance-history";
import { Skeleton } from "@/components/ui";
import { useQuery } from "react-query";
import { cn } from "@/utils";
import WalletWithdraw from "./wallet-withdraw";
import { AxiosError } from "axios";
import { IWallet } from "../types";

export const View: React.FC = () => {
  const { t } = useTranslation();
  const {
    data,
    status,
    error
  }: {
    data: IWallet | undefined;
    status: "idle" | "loading" | "error" | "success";
    error: null | AxiosError<any>;
  } = useQuery('wallet');

  return (
    <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar")}>
      <WalletBalance />
      {status === "success"
        ? <WalletWithdraw balance={data?.balance} />
        : <Skeleton className="mt-2 rounded-lg w-full h-10" />
      }
      <div className={cn("text-black opacity-85 font-medium my-3")}>{t("wallet:transactions.history")}</div>
      <WalletBalanceHistory />
    </div>
  );
};
