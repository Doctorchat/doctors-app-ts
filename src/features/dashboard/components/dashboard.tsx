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
import { useDispatch } from "react-redux";
import { addClosed, addDoctors, addPatients } from "@/store/slices/listsChatsShortsSlice";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export const DashboardWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const { data: allData, isLoading } = useQuery({
    queryKey: ["dataDahsboard"],
    queryFn: async () => apiGetDashboard(),
    onSuccess: (data: any) => {
      if (data.chats.open) dispatch(addPatients(data.chats.open));
      if (data.chats.doctor) dispatch(addDoctors(data.chats.doctor));
      if (data.chats.closed) dispatch(addClosed(data.chats.closed));
      return;
    },
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
        <Card className="custom-scroll-bar h-[80%] rounded-lg border  p-3 text-typography-primary sm:h-[30%] sm:overflow-auto md:h-[20%] md:overflow-auto md:rounded-lg md:border md:border-neutral-200 lg:h-1/3 lg:overflow-auto xl:h-1/3 xl:overflow-auto">
          <CarddWallet loading={isLoading} data={allData?.wallet} image={allData?.avatar} />
        </Card>
        <div className="h-[100%] sm:h-[70%] sm:overflow-y-auto md:h-[80%] md:overflow-y-auto lg:h-2/3 lg:overflow-y-auto xl:h-2/3 xl:overflow-y-auto">
          <TabsConversersional loading={isLoading} data={allData?.chats} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Card className="custom-scroll-bar h-[20%] overflow-hidden rounded-lg border p-1 text-typography-primary sm:h-[30%] md:h-[20%] md:rounded-lg md:border md:border-neutral-200 lg:h-1/3 xl:h-1/3">
          <BasicLine loading={isLoading} data={allData?.SuccessfullyClosedChats} />
        </Card>
        <div className=" h-[100%] sm:h-[70%]  sm:overflow-y-auto md:h-[80%] md:overflow-y-auto lg:h-2/3 lg:overflow-y-auto  xl:h-2/3">
          <View inContainer={true} />
        </div>
      </div>
      <div className="flex flex-col gap-2" >
        <Card className="custom-scroll-bar h-[30%] overflow-hidden rounded-lg border p-1 text-typography-primary sm:h-[30%] md:h-[30%] md:rounded-lg md:border md:border-neutral-200 lg:h-1/3 xl:h-1/3">
          <ChartDonut loading={isLoading} data={allData?.reviews} />
          <div className="flex w-[4%]  ">
            <ChatBubbleLeftRightIcon />
            <p className="text-sm ">Recenzii</p>
          </div>
        </Card>
        <div
          className=" h-[100%] sm:h-[70%] sm:overflow-y-auto md:h-[70%] md:overflow-y-auto lg:h-2/3 lg:overflow-y-auto xl:h-2/3 xl:overflow-y-auto"
          key="calendar-apoitments"
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
