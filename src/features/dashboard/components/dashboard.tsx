import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import { View } from "@/features/partners/components/view";
import BasicLine from "./chartLines";
import CalendarReservations from "./CalendarReservations";

import TabsConversersional from "./tabsConversetion";
import CarddWallet from "./cardWallet";
import { useQuery } from "react-query";
import { apiGetDashboard, apiGetReservations } from "../api";
import ChartDonut from "./chartProcent";
import { useEffect, useState } from "react";
import { getCurrentMonth } from "../utils/getDates";

export const DashboardWrapper: React.FC = () => {
  const { data: allData, isLoading } = useQuery(["cardWallet"], () => apiGetDashboard(), {
    keepPreviousData: true,
  });

  const [monthReservations, setMonthReservations] = useState(getCurrentMonth());

  const {
    data: reservations,
    isLoading: calendarLoading,
    refetch,
  } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      return apiGetReservations(monthReservations as string);
    },
  });
  useEffect(() => {
    refetch();
  }, [monthReservations]);

  return (
    <>
      <div className="flex flex-col gap-2 md:col-span-1">
        <Card className="custom-scroll-bar h-[20%] overflow-hidden rounded-lg border p-3 text-typography-primary sm:h-[30%] md:h-[20%] md:rounded-lg md:border md:border-neutral-200 lg:h-1/3 xl:h-1/3">
          <CarddWallet loading={isLoading} data={allData?.wallet} image={allData?.avatar} />
        </Card>
        <div className="h-[80%] overflow-y-auto sm:h-[70%] md:h-[80%] lg:h-2/3 xl:h-2/3">
          <TabsConversersional loading={isLoading} data={allData?.chats} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Card className="custom-scroll-bar h-[20%] rounded-lg border p-1 text-typography-primary sm:h-[30%] md:h-[20%] md:rounded-lg md:border md:border-neutral-200 lg:h-1/3 xl:h-1/3">
          <BasicLine loading={isLoading} data={allData?.SuccessfullyClosedChats} />
        </Card>
        <div className=" h-[80%] overflow-y-auto sm:h-[70%] md:h-[80%] lg:h-2/3 xl:h-2/3">
          <View inContainer={true} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Card className="custom-scroll-bar h-[30%] rounded-lg border p-1 text-typography-primary sm:h-[30%] md:h-[30%] md:rounded-lg md:border md:border-neutral-200 lg:h-1/3 xl:h-1/3">
          <ChartDonut loading={isLoading} data={allData?.reviews} />
        </Card>
        <div
          className=" h-[70%] overflow-y-auto sm:h-[70%] md:h-[70%] lg:h-2/3 xl:h-2/3"
          key="calendar-reservation"
        >
          <CalendarReservations
            key="calendar-reservation"
            loading={calendarLoading}
            data={reservations?.reservations}
            setMonth={setMonthReservations}
          />
        </div>
      </div>
    </>
  );
};
