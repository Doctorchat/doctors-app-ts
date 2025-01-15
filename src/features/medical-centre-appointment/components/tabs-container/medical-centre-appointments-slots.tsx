import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { Button } from "@/components/ui";
import { getSlots, removeSlot } from "../../api";
import { useTranslation } from "react-i18next";
import { Appointment } from "../../types";
import { useAuth } from "@/features/auth";
import { ArchiveBoxXMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { calculateDateTimeInTimeZone } from "@/utils/time-zone";
import Notification from "@/components/ui/notification";
import { useMedicalCentreList } from "@/features/medical-centre-appointment/hooks";
import { Avatar, Collapse, Empty, Skeleton } from "antd";
import { cn } from "@/utils";
import { FormAppointmentsSettings } from "@/features/medical-centre-appointment/components/form-appointments-settings.tsx";

const MedicalCentreAppointmentsSlots = () => {
  const { t } = useTranslation();
  const { session } = useAuth();

  const { medicalCentreList, isLoadingMedicalCentre } = useMedicalCentreList();

  const collapseItems = useMemo(
    () =>
      medicalCentreList?.map((item) => {
        const { id, city, address, name, logo } = item?.medical_centre;
        return {
          key: id,
          label: (
            <div className="flex items-center gap-3">
              <Avatar
                shape="square"
                size="large"
                src={<img src={logo?.url} alt="avatar" />}
                className="ring-1 ring-gray-200"
              />
              <div className="">
                <div>{name}</div>
                <div className="text-xs opacity-60">
                  {address}, {city}
                </div>
              </div>
            </div>
          ),
          children: (
            <>
              <div
                className={cn(
                  "item-center mb-4 flex justify-center rounded-xl border border-primary bg-primary bg-opacity-10 px-3 py-2 font-medium"
                )}
              >
                <ExclamationCircleIcon className="mr-2 h-5 w-5 text-primary" />
                <p className="text-center text-sm text-primary">
                  {t("video:appointments_warning")}
                </p>
              </div>

              <FormAppointmentsSettings data={item} />
            </>
          ),
        };
      }),
    [medicalCentreList]
  );

  const {
    data: slots,
    isLoading: areSlotsLoading,
    refetch,
  } = useQuery({
    queryKey: ["medical-centre-slots"],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1] || "";
      return getSlots(id);
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const handleFetchSlots = async (id: string) => {
    await refetch({ queryKey: ["medical-centre-slots", id] });
  };

  const [openNotification, setOpenNotification] = React.useState<boolean>(false);
  const [loadingStates, setLoadingStates] = React.useState<{ [key: string]: boolean }>({});

  const onRemoveSlot = (slotId: number): void => {
    setLoadingStates((prevLoadingStates) => ({ ...prevLoadingStates, [slotId]: true }));
    removeSlot(slotId)
      .then(() => {
        setOpenNotification(true);
        setTimeout(() => {
          setOpenNotification(false);
        }, 3000);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [slotId]: false,
        }));
        refetch();
      });
  };

  if (areSlotsLoading) {
    return (
      <div className="flex h-32 w-full items-center justify-center">{t("common:loading")}</div>
    );
  }

  /*  if (!slots?.length) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center">
        <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
        <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
      </div>
    );
  }*/

  const onChangeCollapse = (key: string | string[]) => {
    handleFetchSlots(typeof key === "string" ? key : key[0]);
    console.log(key);
  };

  return (
    <div className="py-3">
      <div className="mb-5">
        <h6 className="mb-2 ps-2 font-semibold text-gray-700">{t("video:active_appointments")}</h6>
        {isLoadingMedicalCentre ? (
          <Skeleton active round paragraph={{ rows: 5 }} title={false} />
        ) : (
          <>
            {!collapseItems?.length ? (
              <Empty description={t("common:empty_list")} />
            ) : (
              <Collapse
                accordion
                expandIconPosition="end"
                items={collapseItems}
                onChange={onChangeCollapse}
              />
            )}
          </>
        )}
        {/*<div className="flex flex-col space-y-4">
          {slots?.map((appointment: Appointment) => (
            <div
              key={appointment.id}
              className="border-1 hover:bg-mauve3 relative flex items-center justify-between space-x-4 rounded-md px-2 py-1 shadow-[0_2px_10px] shadow-black/10 focus:shadow-[0_0_0_2px]"
            >
              <div className="absolute left-[0px] right-1/2 h-10 w-1 rounded-full bg-orange-200" />
              <div className="flex flex-col">
                <span>{t("video:consultation_date")}</span>
                <p>{calculateDateTimeInTimeZone(appointment.start_time)}</p>
              </div>
              <div key={appointment.id}>
                <Button
                  variant="primary"
                  disabled={loadingStates[appointment.id]}
                  size="sm"
                  onClick={() => onRemoveSlot(appointment.id)}
                >
                  {t("survey:title_delete")}

                  {loadingStates[appointment.id] && <span style={{ marginLeft: "4px" }}>...</span>}
                </Button>
              </div>
            </div>
          ))}
        </div>*/}
      </div>

      <Notification
        open={openNotification ? true : false}
        onOpenChange={setOpenNotification.bind(null, false)}
        type={"success"}
        description={t("common:on_succes_notification")}
      />
    </div>
  );
};

export default MedicalCentreAppointmentsSlots;
