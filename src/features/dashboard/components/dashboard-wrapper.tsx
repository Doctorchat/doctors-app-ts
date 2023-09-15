import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils";
import { MoneyIcon } from "../icons/iconMoney";
import { View } from "@/features/partners/components/view";

export const DashboardWrapper: React.FC = () => {
  return (
    <div
      className={cn(
        "custom-scroll-bar grid h-full w-full gap-4 sm:grid-cols-1 md:grid-cols-2 md:rounded-lg lg:grid-cols-3 xl:grid-cols-3"
      )}
    >
      <div>
        <Card className={cn("p-3")}>
          <div className="flex grid h-full grid-cols-2  flex-col gap-4 ">
            <div>
              <CardTitle>
                <span className="text-lg">Portofelul meu</span>
              </CardTitle>
              <CardDescription>Bani in cont:</CardDescription>
              <div className={cn("flex  items-end items-baseline gap-1 font-bold")}>
                <span className="text-xl">45512.72</span>
                <span className="flex  text-xs">USD</span>
              </div>
            </div>
            <div className="flex h-full flex-col justify-between">
              <div className=" flex h-full flex-col gap-4">
                <div className="flex h-full  items-center gap-2">
                  <div>
                    <span className="inline-block h-11 w-11 rounded-md bg-blue-100 text-xl text-blue-600	dark:bg-blue-500/20 dark:text-blue-100">
                      <span className="flex h-full items-center justify-center">
                        <MoneyIcon />
                      </span>
                    </span>
                  </div>
                  <div>
                    <CardDescription>Referalii</CardDescription>
                    <div className={cn("flex items-end items-baseline gap-1 font-bold")}>
                      <span className="text-base">45512.72</span>
                      <span className="flex text-xs">USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="py-2">
          <View inContainer={true} />
        </div>
      </div>
      <div>as</div>
      <div>as</div>
    </div>
  );
};
