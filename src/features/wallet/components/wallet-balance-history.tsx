import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { useEventListener } from "usehooks-ts";
import { cn } from "@/utils";
import WalletTransactionItem from "./wallet-transaction-item";
import { getUserTransactions } from "../api";
import { useQuery } from "react-query";
import { ITransaction } from "../types";
import { Skeleton } from "@/components/ui";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface WalletBalanceProps {
  showFrozen?: boolean;
};

const WalletBalanceHistory: FC<WalletBalanceProps> = () => {

  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = React.useRef(0);
  const { t } = useTranslation();

  const {
    data: userTransactionsList,
    isLoading: isLoading
  } = useQuery({
    queryKey: ["historyTransaction"],
    queryFn: async () => {
      return getUserTransactions();
    },
  }) as {
    data: ITransaction[];
    isLoading: boolean;
  };

  useEventListener(
    "scroll",
    () => {
      if (ref.current) {
        const el = ref.current;
        scroll.current = el.scrollTop + el.clientHeight - el.scrollHeight;
      }
    },
    ref,
  );

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex-1">
          {
            Array.from({ length: 10 }).map((_, index) => (
              <WalletBalanceSkeleton key={index} />
            ))
          }
        </div>
      </div>
    );
  };

  if (!userTransactionsList?.length) {
    return (
      <div className="flex flex-col justify-center align-center">
        <div
          className="mx-auto my-2 flex rounded-full bg-warring-10 text-warring mb-3"
        >
          <ExclamationCircleIcon className="w-10 h-10" />
        </div>
        <p className="text-center">{t("wallet:transactions.empty")}</p>
      </div>
    );
  };

  return (
    <div
      className={cn("relative flex h-full flex-col rounded-lg")}
    >
      <div
        ref={ref}
      >
        {userTransactionsList?.map((transaction: ITransaction, index: number) => (
          <WalletTransactionItem
            index={index}
            key={transaction.id}
            amount={transaction.amount}
            type={transaction.type}
            category={transaction.category}
            status={transaction.status}
            created_at={transaction.created_at}
            currency={transaction.currency}
          />
        ))}
      </div>
    </div>
  );
};

const WalletBalanceSkeleton: FC = memo(() => {
  return (
    <div className="flex items-center mb-3">
      <Skeleton
        className="flex justify-between items-center flex-1 p-3"
      >
        <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
        <div
          className="flex flex-col items-start w-full ml-3"
        >
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-20 rounded-xl" />
      </Skeleton>
    </div>
  );
});

export default WalletBalanceHistory;