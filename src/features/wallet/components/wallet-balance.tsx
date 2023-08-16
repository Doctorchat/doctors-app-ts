import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getWallet } from "../api";
import { Skeleton } from "@/components/ui";

type WalletBalanceFallbackProps = {
  type?: "loading" | "error";
};

const WalletBalanceFallback: FC<WalletBalanceFallbackProps> = memo(({ type = "loading" }) => {
  const { t } = useTranslation();
  return (
    <div className="wallet-balance space-x-2 flex justify-between items-center w-[100%]">
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("wallet:total_balance")}</p>
        {type === "loading" ? <Skeleton className="h-8 w-24 mt-1" /> : <h3 className="text-2xl">-</h3>}
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("wallet:frozen_balance")}</p>
        {type === "loading" ? <Skeleton className="h-8 w-24 mt-1" /> : <h3 className="text-2xl">-</h3>}
      </div>
    </div>
  );
});

interface WalletBalanceProps {
  showFrozen?: boolean;
}

const WalletBalance: FC<WalletBalanceProps> = ({ showFrozen = true }) => {
  const { t } = useTranslation();
  const { data: walletData, isLoading, isError } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      return getWallet();
    },
  });

  if (isLoading || isError) {
    return <WalletBalanceFallback type={isLoading ? "loading" : "error"} />
  };

  const { balance, frozen, currency } = walletData;
  
  return (
    <div className="wallet-balance space-x-2 flex justify-between items-center w-[100%]">
      <div>
        <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("wallet:total_balance")}</p>
        {/* <h3 className="text-2xl">{formatPrice(balance, currency)}</h3> */}
        <h3 className="text-2xl text-black opacity-85 font-medium">{balance} {currency}</h3>
      </div>
      {showFrozen && (
        <div>
          <p className="text-sm text-zinc-500 mb-0 fs-6 text-muted">{t("wallet:frozen_balance")}</p>
          {/* <h3 className="text-2xl">{formatPrice(balance, currency)}</h3> */}
          <h3 className="text-2xl text-black opacity-85 font-medium">{frozen} {currency}</h3>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;