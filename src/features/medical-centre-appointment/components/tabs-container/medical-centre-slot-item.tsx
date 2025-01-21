"use client";
import React from "react";
import { useQuery } from "react-query";
import { Empty, Popconfirm, Skeleton } from "antd";
import { useTranslation } from "react-i18next";

import { getSlots, removeSlot } from "../../api";
import { Button } from "@/components/ui";
import { calculateDateTimeInTimeZone } from "@/utils/time-zone.ts";
import type { Appointment } from "@/features/medical-centre-appointment/types";

interface IProps {
  id: string | number;
}

export const MedicalCentreSlotItem: React.FC<IProps> = ({ id }) => {
  const { t } = useTranslation();

  const {
    data: slots,
    isLoading: isLoadingSlots,
    refetch,
  } = useQuery({
    queryKey: ["medical-centre-slots", id],
    queryFn: () => {
      if (!id) return;
      return getSlots(String(id));
    },
    refetchOnMount: "always",
  });

  const [loadingStates, setLoadingStates] = React.useState<{ [key: string]: boolean }>({});

  const onRemoveSlot = (slotId: number): void => {
    setLoadingStates((prevLoadingStates) => ({ ...prevLoadingStates, [slotId]: true }));
    removeSlot(slotId)
      .catch((error) => console.error(error))
      .finally(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [slotId]: false,
        }));
        refetch();
      });
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        {isLoadingSlots ? (
          <Skeleton active round paragraph={{ rows: 5 }} title={false} />
        ) : (
          <>
            {!slots?.data?.length ? (
              <Empty description={t("common:empty_list")} />
            ) : (
              slots?.data?.map((appointment: Appointment) => (
                <div
                  key={appointment.id}
                  className="border-1 hover:bg-mauve3 relative flex items-center justify-between space-x-4 rounded-md px-2 py-1 shadow-[0_2px_10px] shadow-black/10 focus:shadow-[0_0_0_2px]"
                >
                  <div className="absolute left-[0px] right-1/2 h-10 w-1 rounded-full bg-orange-200" />
                  <div className="flex flex-col">
                    <span>{t("video:consultation_date")}</span>
                    <p>{calculateDateTimeInTimeZone(appointment.start_time)}</p>
                  </div>

                  <Popconfirm
                    title={t("medical_centre:delete_slot_title")}
                    description={t("medical_centre:delete_slot_are_you_sure")}
                    onConfirm={() => onRemoveSlot(appointment.id)}
                    okText={t("common:yes_delete")}
                    cancelText={t("common:no")}
                    className={"max-w-44"}
                    overlayClassName="max-w-72"
                  >
                    <Button
                      variant="destructive"
                      disabled={loadingStates[appointment.id]}
                      size="sm"
                    >
                      {t("survey:title_delete")}
                    </Button>
                  </Popconfirm>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};
