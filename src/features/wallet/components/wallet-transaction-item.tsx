import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import date from "@/utils/date";

import { 
  CheckIcon, 
  ClockIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";

const transactionStatusIcon = {
  success: <CheckIcon className="w-5 h-5" />,
  pending: <ClockIcon className="w-5 h-5" />,
  cancel: <XMarkIcon className="w-5 h-5" />,
};

const transactionStatusColor = {
  success: "bg-success-10 text-success",
  pending: "bg-warring-10 text-warring",
  cancel: "bg-danger-10 text-danger",
};

const amountColor = {
  incoming: "bg-success-10 text-success",
  withdraw: "bg-danger-10 text-danger",
  outgoing: "bg-danger-10 text-danger",
};


interface WalletTransactionItemProps {
  index: number;
  id?: number;
  amount: string;
  type: "incoming" | "withdraw" | "outgoing";
  status: "success" | "pending" | "cancel";
  created_at: string;
  currency?: string;
  category?: string;
  description?: string;
}

const WalletTransactionItem: FC<WalletTransactionItemProps> = (props) => {
  const { index, amount, type, status, created_at, currency } = props;
  const { t } = useTranslation();

  return (
    <div
      className={cn(`${index % 2 !== 0 ? 'bg-[transparent]' : 'bg-[#f8f9fa]'} p-[8px] rounded flex items-center justify-between mb-[8px]`)}
    >
      <div className="flex items-center">
        <div
          className={cn("mr-[12px] flex items-center justify-center w-10 h-10 rounded-full border border-gray-200", transactionStatusColor[status])}
        >
          {transactionStatusIcon[status]}
        </div>
        <div className="flex flex-col">
          <h4 className="text-black opacity-85 font-medium">{t(`wallet:transactions.${type}`)}</h4>
          <p className="gray-600 mt-[6px]">{date(created_at).dynamic()}</p>
        </div>
      </div>
      <div className="transaction__amount">
        <span className={cn("font-medium py-[4px] px-[12px] rounded-xl", amountColor[type])}>{amount} {currency}</span>
      </div>
    </div>
  );
};

export default WalletTransactionItem;