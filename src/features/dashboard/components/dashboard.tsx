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
      <div className="grid grid-rows-3 gap-2 ">
        <Card className="custom-scroll-bar row-span-1 rounded-lg border p-3 text-typography-primary md:rounded-lg md:border md:border-neutral-200">
          <CarddWallet loading={isLoading} data={allData?.wallet} image={allData?.avatar} />
        </Card>
        <div className="row-span-2">
          <TabsConversersional loading={isLoading} data={allData?.chats} />
        </div>
      </div>
      <div className="grid grid-rows-3 gap-2">
        <Card className="custom-scroll-bar row-span-1 rounded-lg border p-1 text-typography-primary md:rounded-lg md:border md:border-neutral-200">
          <BasicLine loading={isLoading} data={allData?.SuccessfullyClosedChats} />
        </Card>
        <div className="row-span-2">
          <View inContainer={true} />
        </div>
      </div>
      <div className="grid grid-rows-3 gap-2">
        <Card className="custom-scroll-bar row-span-1 rounded-lg border p-1 text-typography-primary md:rounded-lg md:border md:border-neutral-200">
          <ChartDonut loading={isLoading} data={allData?.reviews} />
        </Card>
        <div className="row-span-2" key="calendar-reservation">
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
