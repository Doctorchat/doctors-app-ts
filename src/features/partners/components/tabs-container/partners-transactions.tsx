import React from "react";
import { useTranslation } from "react-i18next";
import date from "@/utils/date";
import { useQuery } from "react-query";
import { getPartners } from "../../api";
import { Skeleton } from "@/components/ui";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

interface TransactionItemProps {
  id?: number;
  amount: string;
  created_at: string;
  currency: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ amount, created_at, currency }) => {
  return (
    <div className="flex items-center justify-between rounded-md bg-gray-100 p-3">
      <h4 className="mb-0 text-base text-lg capitalize text-gray-800">
        {date(created_at).dynamic()}
      </h4>
      <div>
        <span className="text-md rounded-full bg-green-100 px-3 py-1 font-medium text-green-500">
          {amount} {currency}
        </span>
      </div>
    </div>
  );
};

const TransactionItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

const PartnersTransactions: React.FC = () => {
  const { t } = useTranslation();

  const { data: partnersData, isLoading } = useQuery(["partners"], () => getPartners(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="mt-5 space-y-3">
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
      </div>
    );
  }

  const { transactions, currency } = partnersData;

  if (!transactions?.data?.length) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center">
        <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
        <h4 className="text-md mb-2 font-medium text-gray-400">
          {t("partners:transactions.empty")}
        </h4>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3  px-2">
      {transactions?.data?.map((transaction: TransactionItemProps) => (
        <TransactionItem key={transaction.id} {...transaction} currency={currency} />
      ))}
    </div>
  );
};

export default PartnersTransactions;
