import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import { View } from "@/features/partners/components/view";
import BasicLine from "./chartLines";
import CalendarCustom from "./calendarCustom";

import TabsConversersional from "./tabsConversetion";
import CarddWallet from "./cardWallet";
import { useQuery } from "react-query";
import { apiGetDashboard } from "../api";
import ChartDonut from "./chartProcent";

export const DashboardWrapper: React.FC = () => {
  const { data: allData, isLoading } = useQuery(["cardWallet"], () => apiGetDashboard(), {
    keepPreviousData: true,
  });

  return (
    <div
      className={cn(
        "custom-scroll-bar grid h-full w-full gap-4 sm:grid-cols-1 md:grid-cols-2 md:rounded-lg lg:grid-cols-3 xl:grid-cols-3"
      )}
    >
      <div>
        <Card className={cn("p-4")}>
          <CarddWallet loading={isLoading} data={allData?.wallet} image={allData?.avatar}/>
        </Card>
        <div className="pt-2">
          <Card className={cn("p-3")}>
            <TabsConversersional loading={isLoading} data={allData?.chats} />
          </Card>
        </div>
      </div>
      <div>
        <Card className={cn("p-3")}>
          <BasicLine loading={isLoading} data={allData?.SuccessfullyClosedChats} />
        </Card>
        <div className="py-2">
          <View inContainer={true} />
        </div>
      </div>
      <div>
        <Card className={cn("p-3")}>
          <ChartDonut loading={isLoading} data={allData?.reviews} />
        </Card>
        <CalendarCustom loading={isLoading} data={allData?.reservations} />
      </div>
    </div>
  );
};
