import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn, getInitials } from "@/utils";
import { MoneyIcon } from "../icons/iconMoney";
import { useTranslation } from "react-i18next";
import { CardProps } from "../types";
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth";

const CardItemSkeleton: React.FC = () => {
  return (
    <div className="flex-column flex gap-1">
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

const CarddWallet: React.FC<CardProps> = ({ loading, data, image }) => {
  const { t } = useTranslation();
  const { session } = useAuth();
  if (loading) {
    return (
      <div className="space-y-3">
        <CardItemSkeleton />
        <CardItemSkeleton />
        <CardItemSkeleton />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 gap-1 ">
      <div className="flex h-full w-full justify-center overflow-hidden">
        <Avatar className="flex h-full w-full justify-center	overflow-hidden rounded-md">
          <AvatarImage src={session.user?.avatar} alt={session.user?.name} className="w-[80%]" />
          <AvatarFallback className="rounded-md text-xl ">
            {getInitials(session.user?.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex h-full grid-rows-2 flex-col gap-6">
        <div>
          <CardTitle>
            <p className="truncate text-lg">{t("wallet:wallet_personal")}</p>
          </CardTitle>
          <CardDescription>{t("wallet:money_sold")}</CardDescription>
          <div className={cn("flex  items-end items-baseline gap-1 font-bold")}>
            <p className="truncate text-xl">{data?.balance ?? "0.00"}</p>
            <p className="flex  truncate text-xs">{data?.currency ?? "MDL"}</p>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between">
          <div className=" flex h-full flex-col gap-4">
            <div className="flex h-full  items-center gap-1">
              <div>
                <span className="inline-block h-11 w-11 rounded-md bg-blue-100 text-xl text-blue-600	dark:bg-blue-500/20 dark:text-blue-100">
                  <span className="flex h-full items-center justify-center">
                    <MoneyIcon />
                  </span>
                </span>
              </div>
              <div>
                <CardDescription>{t("wallet:referals")}</CardDescription>
                <div className="flex items-end items-baseline gap-1 font-bold">
                  <span className="text-base">{data?.earned ?? "0.00"}</span>
                  <span className="flex text-xs">{data?.currency ?? "MDL"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CarddWallet;
