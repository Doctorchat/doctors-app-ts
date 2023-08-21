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
    <div className="flex justify-between items-center p-3 rounded-md bg-gray-100">
      <h4 className="text-lg text-gray-800 text-base mb-0 capitalize">{date(created_at).dynamic()}</h4>
      <div>
        <span className="text-md font-medium px-3 py-1 rounded-full text-green-500 bg-green-100">
          {amount} {currency}
        </span>
      </div>
    </div>
  );
};

const TransactionItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="w-full h-12" />
    </div>
  );
};

const PartnersTransactions: React.FC = () => {
  const { t } = useTranslation();

  const { data: partnersData, isLoading } = useQuery(
    ["partners"],
    () => getPartners(),
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-3 mt-5">
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
        <TransactionItemSkeleton />
      </div>
    );
  };

  const { transactions, currency } = partnersData;

  if (!transactions?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <ArchiveBoxXMarkIcon className="w-16 h-16 text-gray-400" />
        <h4 className="text-md font-medium text-gray-400 mb-2">
          {t("partners:transactions.empty")}
        </h4>
      </div>
    );
  };

  return (
    <div className="space-y-3 mt-5">
      {transactions?.data?.map((transaction: TransactionItemProps) => (
        <TransactionItem key={transaction.id} {...transaction} currency={currency} />
      ))}
    </div>
  );
};

export default PartnersTransactions;